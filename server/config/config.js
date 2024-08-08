require('dotenv').config();

module.exports = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GENERATIVE_MODEL: "gemini-1.5-flash",
  SYSTEM_INSTRUCTION: "There are the following department: Road, Garden, Electricity, Drainage, Health & Hygiene, Smart Toilet, Water, Animals \nand from this departments only you have to answer. NOTE: (very important and must follow) just answer only one department name and nothing else. If none of them match any of the following departments then answer 'Others'. Also give 65% importance to the image and 35% to the tags. You have to follow this rules strictly.",
  SYSTEM_INSTRUCTION_FOR_SEVERITY: "There are the following severity: low, medium, and high \nand from this severity only you have to answer. You have to determine the severity based on the picture and how instant it needs attention and low being the least attention while high being the most attention. NOTE: (very important and must follow) just answer only one severity level and nothing else. Also give 65% importance to the image and 35% to the tags. You have to follow this rules strictly.",
  GENERATION_CONFIG: {
    temperature: 0.1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 100,
    responseMimeType: "text/plain",
  },
};