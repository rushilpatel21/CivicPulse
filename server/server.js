// server.js
const express = require('express');
const geminiRouter = require('./routes/geminiRouter');

const app = express();
const PORT = process.env.PORT || 8000;

app.use('/api/gemini', geminiRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
