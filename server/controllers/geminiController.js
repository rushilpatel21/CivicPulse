const { Firestore } = require('@google-cloud/firestore');
const serviceAccount = require('../config/serviceAccountKey.json');
const admin = require('firebase-admin');
const geminiService = require('../services/geminiService');
const fs = require('fs');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadToGemini(req, res) {
  const { tags, user, location, severity, photoUrl } = req.body;
  const prompt = JSON.stringify(tags);
  
  console.log(req.file.path);
  
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
    const department = result.response.text();
    console.log(department);

    const date = new Date();
    // Store data in Firestore
    const docRef = await db.collection('IssueDetails').add({
      user,
      date,
      department,
      location,
      tags,
      severity,
      photoUrl,
    });

    console.log(`Document written with ID: ${docRef.id}`);

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
