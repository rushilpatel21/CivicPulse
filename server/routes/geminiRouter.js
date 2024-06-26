const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

router.post('/', geminiController.uploadToGemini);

module.exports = router;