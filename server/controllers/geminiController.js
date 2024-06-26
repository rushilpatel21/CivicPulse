const geminiService = require('../services/geminiService');

async function uploadToGemini(req, res) {
  const { tags, photo, mimeType } = req.body;

  try {
    console.log(photo);
    const response = await geminiService.uploadToGemini(photo, mimeType);
    console.log(response);
    const chatSession = geminiService.model.startChat({
      generationConfig: geminiService.generationConfig,
      history: [
        {
          role: 'user',
          parts: [
            {
              fileData: {
                mimeType: mimeType,
                fileUri: photo,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(tags);
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
