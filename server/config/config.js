require('dotenv').config();

module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GENERATIVE_MODEL: "gemini-1.5-flash",
  SYSTEM_INSTRUCTION: "There are the following department: Road, Garden, Electricity, Drainage, Health & Hygiene, Smart Toilet, Water, Animals, Others \nand from this departments only you have to answer. also just answer the department name and nothing else ",
  GENERATION_CONFIG: {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  },
};
