const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// model: "gemini-1.5-flash" 
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro", // Use gemini-1.5-pro for image generation
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Function to upload file to Google AI FileManager (Gemini)
async function uploadToGemini(path, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error("Error uploading file to Gemini:", error);
    throw error;
  }
}

// POST / endpoint to handle prompting with optional image
router.post('/', async (req, res) => {
  const { prompt, imagePath } = req.body; // Assuming prompt and imagePath are sent in the request body

  try {
    let files = [];
    if (imagePath) {
      const uploadedFile = await uploadToGemini('../test.webp', "image/webp"); // Adjust MIME type as per your image type
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
