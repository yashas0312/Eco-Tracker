const express = require('express');
const router = express.Router();
const controller = require('../controllers/energyController');

router.post('/', controller.create);       // POST /api/energy
router.get('/latest', controller.listLatest);

module.exports = router;
