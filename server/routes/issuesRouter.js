const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController.js');

router.get('/',issueController.getAll );
router.get('/:id',issueController.getById );
router.put('/:id',issueController.updateById );
router.delete('/:id',issueController.deleteById );


module.exports = router;