import { https } from 'firebase-functions';

const CRAFT_URL = 'https://api.craftmypdf.com/v1/create';
const SIGNED_URL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const generatePdfFromHtml = https.onRequest(async (req, res) => {
  // --- CORS (simple) ---
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type, x-api-key');
  if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      return res.status(204).send('');
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method Not Allowed. Use POST.' });
    }

    try {
      // --- simple API key auth ---
      const clientKey = req.header('x-api-key') || '';
      const configuredClientKey = process.env.GENERATEPDF_APIKEY;
      if (!configuredClientKey || clientKey !== configuredClientKey) {
        console.warn('generatePdfFromHtml: invalid or missing x-api-key');
        return res.status(401).json({ success: false, error: 'Unauthorized (invalid x-api-key).' });
      }

      // --- validate body ---
      const body = req.body || {};
      const html = typeof body.html === 'string' ? body.html : null;
      const userId = typeof body.userId === 'string' && body.userId.trim() ? body.userId.trim() : null;
      const filenameRaw = typeof body.filename === 'string' && body.filename.trim() ? body.filename.trim() : 'resume.pdf';
      const template_id = typeof body.template_id === 'string' && body.template_id.trim() ? body.template_id.trim() : null;
      const expiration = Number(body.expiration) || 60;

      if (!html) {
        return res.status(400).json({ success: false, error: 'Missing required field: html' });
      }
      if (!userId) {
        return res.status(400).json({ success: false, error: 'Missing required field: userId' });
      }

      const craftKey = process.env.CRAFTMYPDF_KEY;
      if (!craftKey) {
        console.error('generatePdfFromHtml: craftmypdf.key not configured');
        return res.status(500).json({ success: false, error: 'Server misconfiguration (missing provider key).' });
      }

      const craftPayload = {
        template_id: template_id || undefined,
        data: { htmlResume: html },
        version: 8,
        export_type: 'json',
        expiration: expiration,
        output_file: filenameRaw,
        direct_download: 1,
        cloud_storage: 0,
      };

      // Remove undefined keys to keep payload clean
      Object.keys(craftPayload).forEach(k => (craftPayload[k] === undefined) && delete craftPayload[k]);

      // --- Call CraftMyPdf ---
      const craftResp = await fetch(CRAFT_URL, {
        method: 'POST',
        headers: {
          'X-API-KEY': `${craftKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json, application/pdf'
        },
        body: JSON.stringify(craftPayload),
      });

      if (!craftResp.ok) {
        const txt = await craftResp.text().catch(() => '<no body>');
        console.error('CraftMyPdf error', craftResp.status, txt);
        console.log(craftResp)
        return res.status(502).json({ success: false, error: `PDF provider returned ${craftResp.status}`, details: txt });
      }

      // --- Handle provider response: JSON with file URL OR binary PDF ---
      const contentType = (craftResp.headers.get('content-type') || '').toLowerCase();
      let pdfBuffer;
      if (contentType.includes('application/pdf')) {
        const arr = await craftResp.arrayBuffer();
        pdfBuffer = Buffer.from(arr);
      } else {
        // assume JSON with file property
        const json = await craftResp.json();
        const remoteUrl = json.file;
        if (!remoteUrl) {
          console.error('Provider JSON missing file URL', craftResp);
          return res.status(502).json({ success: false, error: 'PDF provider returned no file URL.' });
        }
        const dl = await fetch(remoteUrl);
        if (!dl.ok) {
          const txt = await dl.text().catch(() => '<no body>');
          console.error('Failed to download PDF from provider URL', dl.status, txt);
          return res.status(502).json({ success: false, error: 'Failed to download generated PDF.' });
        }
        const arr = await dl.arrayBuffer();
        pdfBuffer = Buffer.from(arr);
      }

      if (!pdfBuffer || pdfBuffer.length === 0) {
        return res.status(502).json({ success: false, error: 'Received empty PDF from provider.' });
      }

      // --- Upload to Firebase Storage at user_uploads/{userId}/... ---
      const safeFilename = filenameRaw.replace(/[\/\\\s]+/g, '_');
      const ts = Date.now();
      const storagePath = `user_uploads/${userId}/${ts}_${safeFilename}`;
      const bucket = admin.storage().bucket(); // default bucket
      const file = bucket.file(storagePath);

      await file.save(pdfBuffer, { contentType: 'application/pdf' });

      // --- Signed URL (7 days) ---
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + SIGNED_URL_EXPIRY_MS,
      });

      // --- Success response ---
      return res.status(200).json({
        success: true,
        storagePath,
        downloadUrl: signedUrl,
        providerResponse: { status: 'ok' }
      });
    } catch (err) {
      console.error('generatePdfFromHtml unexpected error', err);
      return res.status(500).json({ success: false, error: 'Internal server error', details: String(err) });
    }
  });
