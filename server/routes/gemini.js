const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// IMP: we need to use "@google/generative-ai": "0.12.0" inorder to use the AIFileManager

// model: "gemini-1.5-pro" 
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function uploadToGemini(imagePath, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(imagePath, {
      mimeType,
      displayName: path.basename(imagePath), // Get the filename from the path
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error("Error uploading file to Gemini:", error);
    throw error;
  }
}

router.post('/', async (req, res) => {
  const { prompt, imagePath } = req.body;

  try {
    let files = [];
    if (imagePath) {
      const uploadedFile = await uploadToGemini('./test.webp', "image/webp");
      files.push(uploadedFile);
    }

    const chatSession = model.startChat({ 
      generationConfig,
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
