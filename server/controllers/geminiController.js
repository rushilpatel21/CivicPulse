// controllers/geminiController.js
const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

router.post('/', async (req, res) => {
  const { prompt, imagePath } = req.body;

  try {
    let files = [];
    if (imagePath) {
      const uploadedFile = await geminiService.uploadToGemini(imagePath, "image/webp");
      files.push(uploadedFile);
    }

    const chatSession = geminiService.model.startChat({
      generationConfig: geminiService.generationConfig,
      history: files.map(file => ({
        role: "user",
        parts: [{
          fileData: {
            mimeType: file.mimeType,
            fileUri: file.uri,
          },
        }],
      })),
    });

    const result = await chatSession.sendMessage(prompt);
    const responseText = result.response.text();

    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
