import { https } from 'firebase-functions';
import admin from "firebase-admin";
import puppeteer from 'puppeteer';
import chromium from '@sparticuz/chromium-min';

const SIGNED_URL_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const generatePdfFromHtml = https.onRequest({ memory: '512GB', timeoutSeconds: 60 }, async (req, res) => {
  // --- CORS (simple) ---
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }
  
  if (!req.headers.authorization) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Authentication required' });
  }

  const { htmlContent, fileName } = req.body;
  
  if (!htmlContent) {
    return res.status(400).json({ success: false, error: 'Bad Request: HTML content is required' });
  }

  let browser = null;
  
  try {
    chromium.setGraphicsMode = false;
    browser = await puppeteer.launch({
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ],
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
      
      // --- Upload to Firebase Storage at user_uploads/{userId}/... ---
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const bucket = admin.storage().bucket();
    const safeFilename = fileName.replace(/[\/\\\s]+/g, '_');
    const ts = Date.now();
    const storagePath = `user_uploads/${uid}/${ts}_${safeFilename}`;
    const file = bucket.file(storagePath);

      await file.save(pdfBuffer, { 
        contentType: 'application/pdf', 
        metadata: { userId: uid, generatedAt: new Date().toISOString() } 
      });

      // --- Signed URL (7 days) ---
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + SIGNED_URL_EXPIRY_MS
      });
      return res.status(200).json({
        success: true,
        storagePath,
        downloadUrl: signedUrl,
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'PDF generation failed',
        details: err.message 
      });
    } finally {
          if (browser) {
        await browser.close();
      }
    }
  });
