// src/server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');

const PORT = process.env.PORT || 3000;

// Create a new parent app to handle health checks before the main app's 404 handler
const express = require('express');
const mongoose = require('mongoose');
const mainApp = express();

const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();

        // Root Route - Friendly Welcome
        mainApp.get('/', (req, res) => {
            res.status(200).send('Log Ingestion Backend is Running 🚀');
        });

        // Health Check - Liveness
        mainApp.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok' });
        });

        // Readiness Check
        mainApp.get('/ready', (req, res) => {
            const isConnected = mongoose.connection.readyState === 1;
            if (isConnected) {
                res.status(200).json({ status: 'ready' });
            } else {
                res.status(503).json({ status: 'not ready' });
            }
        });

        // Mount the main application
        mainApp.use(app);

        mainApp.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message);
        process.exit(1);
    }
};

startServer();
