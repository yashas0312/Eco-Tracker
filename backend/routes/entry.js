// backend/routes/entry.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/entryController');

router.post('/', controller.createEntry);   // POST /api/entries
router.get('/latest', controller.getLatest); // GET /api/entries/latest

module.exports = router;
