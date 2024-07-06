const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.get('/role/:id',adminController.getRoleById );
router.get('/users',adminController.getAllUsers);

module.exports = router;