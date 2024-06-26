const geminiService = require('../services/geminiService');

async function uploadToGemini(req, res) {
  const { tags } = req.body;
  const prompt = tags;
  console.log(req.file.path);
  const imagePath = req.file.path; // Path to uploaded file

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
    const responseText = result.response.text();
    console.log(responseText);
    res.status(200).json({ response: responseText });
  } catch (error) {
    console.error('Error in Gemini API call:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  uploadToGemini,
};