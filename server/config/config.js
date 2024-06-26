require('dotenv').config();

module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GENERATIVE_MODEL: "gemini-1.5-flash",
  SYSTEM_INSTRUCTION: "There are the following department: Road, Garden, Electricity, Drainage, Health & Hygiene, Smart Toilet, Water, Animals, Others \nand from this departments only you have to answer. NOTE: (very important and must follow) just answer only one department name and nothing else ",
  GENERATION_CONFIG: {
    temperature: 0.1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 100,
    responseMimeType: "text/plain",
  },
};