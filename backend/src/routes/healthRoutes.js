const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

router.get('/ready', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
        res.status(200).json({ status: 'ready', db: 'connected' });
    } else {
        res.status(503).json({ status: 'not_ready', db: 'disconnected' });
    }
});

module.exports = router;
