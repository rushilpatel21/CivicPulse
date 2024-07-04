const express = require('express');
const router = express.Router();
const bugController = require('../controllers/bugController.js');

router.post('/',bugController.reportBug );

module.exports = router;