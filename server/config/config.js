// config/config.js
require('dotenv').config();

module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GENERATIVE_MODEL: "gemini-1.5-flash", // Adjust model as per your requirement
  GENERATION_CONFIG: {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  },
};
