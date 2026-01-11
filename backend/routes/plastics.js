const express = require('express');
const router = express.Router();
const controller = require('../controllers/plasticController');

router.post('/', controller.create);       // POST /api/plastics
router.get('/latest', controller.listLatest);

module.exports = router;
