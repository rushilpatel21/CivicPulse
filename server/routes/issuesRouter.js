const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController.js');

router.get('/',issueController.getAll ); // get 
router.get('/:id',issueController.getById ); // get by id
router.get('/department/:dep',issueController.getByDep);
// router.put('/:id',issueController.updateById ); // updating (data in body)
router.delete('/:id',issueController.deleteById ); // delete by user id
router.delete('/issues/:id',issueController.deleteByIssueId); // delete by issue id
router.put('/:id',issueController.updateProgress);

module.exports = router;