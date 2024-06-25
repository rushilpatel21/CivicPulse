require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const geminiRouter = require('./routes/geminiRouter');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

// TODO 1: Change the originalname with something that will always be unique (use time stamp or something).
// TODO 2: Also after this we need to find a way to store the uploads to firebase or some other database. 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Middleware to handle uploads
app.use('/api/gemini', upload.single('photo'));

app.use('/api/gemini', geminiRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});