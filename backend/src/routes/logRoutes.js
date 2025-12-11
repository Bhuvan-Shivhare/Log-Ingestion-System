const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Ingest a single log
// POST /api/logs
router.post('/', logController.createLog);

// Search / list logs with filters
// GET /api/logs
router.get('/', logController.getLogs);

module.exports = router;
