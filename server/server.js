require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const geminiRouter = require('./routes/geminiRouter');
const issuesRouter = require('./routes/issuesRouter.js');
const app = express();
const PORT = process.env.PORT || 8000;


const corsOptions = {
  origin: [
    'https://civicpulse.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: '*/*',
};

app.use(cors(corsOptions));
// app.use(cors());


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

app.get('/', (req, res) => {
  res.send("Server is running.")
})

app.use('/api/gemini', upload.single('photo'));

app.use('/api/gemini', geminiRouter);

app.use('/api/issues', issuesRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});