const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");
const config = require('../config/config');
const fileUtils = require('../utils/fileUtils'); // Import fileUtils module

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(config.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: config.GENERATIVE_MODEL, systemInstruction: config.SYSTEM_INSTRUCTION });
const generationConfig = config.GENERATION_CONFIG;

async function uploadToGemini(imagePath, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(imagePath, {
      mimeType,
      displayName: fileUtils.getBaseName(imagePath), // Use fileUtils here
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error("Error uploading file to Gemini:", error);
    throw error;
  }
}

module.exports = {
  model,
  generationConfig,
  uploadToGemini,
};
