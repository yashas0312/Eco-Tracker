const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const dashboardController = require('../controllers/dashboardController');

// Entry management endpoints
router.post('/entries/vehicle', entryController.createVehicleEntry);
router.post('/entries/plastic', entryController.createPlasticEntry);
router.post('/entries/energy', entryController.createEnergyEntry);
router.post('/entries/plantation', entryController.createPlantationEntry);
router.get('/entries/history', entryController.getHistory);
router.get('/entries/recent', dashboardController.getRecentEntries);

// Dashboard and analytics endpoints
router.get('/dashboard/summary', dashboardController.getSummary);
router.get('/analytics/weekly', dashboardController.getWeeklyAnalytics);
router.get('/user/profile', dashboardController.getUserProfile);

module.exports = router;
