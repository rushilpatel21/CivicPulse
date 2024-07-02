// const serviceAccount = require('../config/serviceAccountKey.json');
const admin = require('firebase-admin');
const geminiService = require('../services/geminiService');
const fs = require('fs');
require('dotenv').config();


const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadToGemini(req, res) {
  const { tags, user, location, severity, photoUrl } = req.body;
  const prompt = JSON.stringify(tags);
    
  const imagePath = req.file.path;

  try {
    const uploadedFile = await geminiService.uploadToGemini(imagePath, req.file.mimetype);
    const chatSession = geminiService.model.startChat({
      generationConfig: geminiService.generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                mimeType: uploadedFile.mimeType,
                fileUri: uploadedFile.uri,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const department = result.response.text().replace(/\s+$/, '').trim();
    console.log(department);

    const date = new Date();
    await db.collection('IssueDetails').add({
      user,
      date,
      department,
      location,
      tags,
      severity,
      photoUrl,
      progress: 1
    });

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
      } else {
        console.log('File deleted:', imagePath);
      }
    });

    res.status(200).json({ response: department });
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  uploadToGemini,
};
