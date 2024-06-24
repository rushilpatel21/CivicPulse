const express = require('express');
const router = express.Router();
const geminiController = require('../controllers/geminiController');

router.use(express.json());
router.post('/', geminiController);

module.exports = router;
