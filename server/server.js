require('dotenv').config();
const express = require('express');
const cors = require('cors');
const geminiRouter = require('./routes/geminiRouter');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());


app.use('/api/gemini', geminiRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});