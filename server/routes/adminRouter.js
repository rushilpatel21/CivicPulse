const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js');

router.get('/role/:id',adminController.getRoleById );
router.put('/role/:id',adminController.changeRoleById);
router.get('/users',adminController.getAllUsers);
router.delete('/user/:id',adminController.deleteId);

module.exports = router;