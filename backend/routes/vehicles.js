const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehicleController');

router.post('/', controller.create);       // POST /api/vehicles
router.get('/latest', controller.listLatest);

module.exports = router;
