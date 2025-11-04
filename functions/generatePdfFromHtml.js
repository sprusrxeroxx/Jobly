import * as functions from 'firebase-functions';

const CRAFT_URL = 'https://api.craftmypdf.com/v1/generate'; // <-- placeholder, replace if needed
const SIGNED_URL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const generatePdfFromHtml = functions
  .https.onCall(async (data, context) => {
    if (!context.auth || !context.auth.uid) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be signed in to call this function.');
    }
    const uid = context.auth.uid;
    const html = typeof data?.html === 'string' ? data.html : null;
    const filenameRaw = typeof data?.filename === 'string' && data.filename.trim() ? data.filename.trim() : 'resume.pdf';

    if (!html) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing html parameter.');
    }

    // Get API key from functions config
    const craftKey = functions.config()?.craftmypdf?.key || process.env.CRAFTMYPDF_KEY;
    if (!craftKey) {
      throw new functions.https.HttpsError('failed-precondition', 'Server missing PDF provider key.');
    }

    try {
      // 1) request PDF from provider
      const payload = { html }; // adjust if provider expects different shape
      const resp = await fetch(CRAFT_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${craftKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/pdf, application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '<no body>');
        console.error('PDF provider error', resp.status, txt);
        throw new functions.https.HttpsError('unavailable', `PDF provider returned ${resp.status}`);
      }

      // 2) get pdf bytes (handle binary or JSON with file_url)
      const contentType = (resp.headers.get('content-type') || '').toLowerCase();
      let pdfBuffer;
      if (contentType.includes('application/pdf')) {
        const arrayBuf = await resp.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuf);
      } else if (contentType.includes('application/json')) {
        const json = await resp.json();
        const remoteUrl = json.file_url || json.url || json.download_url;
        if (!remoteUrl) {
          console.error('Provider returned JSON but no file URL', json);
          throw new functions.https.HttpsError('internal', 'PDF provider returned no file URL.');
        }
        const dl = await fetch(remoteUrl);
        if (!dl.ok) {
          throw new functions.https.HttpsError('unavailable', 'Failed to download generated PDF from provider.');
        }
        const arrayBuf = await dl.arrayBuffer();
        pdfBuffer = Buffer.from(arrayBuf);
      } else {
        const txt = await resp.text().catch(() => '<no body>');
        console.error('Unexpected provider content-type', contentType, txt);
        throw new functions.https.HttpsError('internal', 'Unexpected provider response.');
      }

      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new functions.https.HttpsError('internal', 'Received empty PDF from provider.');
      }

      // 3) upload to Storage
      const safeFilename = filenameRaw.replace(/[\/\\\s]+/g, '_');
      const ts = Date.now();
      const storagePath = `user_uploads/${uid}/${ts}_${safeFilename}`;
      const bucket = admin.storage().bucket();
      const file = bucket.file(storagePath);

      await file.save(pdfBuffer, { contentType: 'application/pdf' });

      // 4) create signed url
      const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: Date.now() + SIGNED_URL_EXPIRY_MS });

      return { success: true, storagePath, downloadUrl: signedUrl };
    } catch (err) {
      console.error('generatePdfFromHtml error', err);
      throw new functions.https.HttpsError('internal', 'Failed to generate or upload PDF.');
    }
  });
