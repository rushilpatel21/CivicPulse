const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/files');
const config = require('../config/config');
const fileUtils = require('../utils/fileUtils');

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(config.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: config.GENERATIVE_MODEL, systemInstruction: config.SYSTEM_INSTRUCTION });
const model_severity = genAI.getGenerativeModel({ model: config.GENERATIVE_MODEL, systemInstruction: config.SYSTEM_INSTRUCTION_FOR_SEVERITY });

const generationConfig = config.GENERATION_CONFIG;

async function uploadToGemini(imagePath, mimeType) {
  try {
    const uploadResult = await fileManager.uploadFile(imagePath, {
      mimeType,
      displayName: fileUtils.getBaseName(imagePath),
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  } catch (error) {
    console.error('Error uploading file to Gemini:', error);
    throw error;
  }
}

module.exports = {
  model,
  model_severity,
  generationConfig,
  uploadToGemini,
};