const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const logRoutes = require('./routes/logRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.use('/health', healthRoutes);

// Auth routes -> final URLs: /auth/register, /auth/login
app.use('/auth', authRoutes);

// Log routes -> final URLs: /api/logs/...
app.use('/api/logs', logRoutes);

// Error Handler
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});


module.exports = app;
