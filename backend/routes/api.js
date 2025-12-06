const express = require('express');
const router = express.Router();
const entryController = require('../controllers/entryController');
const dashboardController = require('../controllers/dashboardController');

// Import specialized controllers
const vehicleController = require('../controllers/vehicleController');
const plasticController = require('../controllers/plasticController');
const energyController = require('../controllers/energyController');
const plantationController = require('../controllers/plantationController');

// Frontend API endpoints (matching frontend/src/services/api.js)
router.post('/log', entryController.createEntry);
router.post('/calc', entryController.createEntry); // Same as log but for preview
router.get('/analytics', entryController.getLatest);
router.get('/profile', dashboardController.getUserProfile);
router.get('/export', dashboardController.exportCSV);

// Entry management endpoints - using generic createEntry
router.post('/entries', entryController.createEntry);
router.post('/entries/vehicle', entryController.createEntry);
router.post('/entries/plastic', entryController.createEntry);
router.post('/entries/energy', entryController.createEntry);
router.post('/entries/plantation', entryController.createEntry);
router.get('/entries/latest', entryController.getLatest);

// Dashboard and analytics endpoints
router.get('/dashboard/summary', dashboardController.getSummary);
router.get('/analytics/weekly', dashboardController.getWeeklyAnalytics);
router.get('/user/profile', dashboardController.getUserProfile);

// Specialized routes for each entry type
router.post('/energy', energyController.create);
router.get('/energy/latest', energyController.listLatest);

router.post('/vehicles', vehicleController.create);
router.get('/vehicles/latest', vehicleController.listLatest);

router.post('/plastics', plasticController.create);
router.get('/plastics/latest', plasticController.listLatest);

router.post('/plantations', plantationController.create);
router.get('/plantations/latest', plantationController.listLatest);

module.exports = router;
