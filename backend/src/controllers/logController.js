const Log = require('../models/Log');
const asyncWrapper = require('../utils/asyncWrapper');
const buildQuery = require('../utils/buildQuery');
const { getRedisClient } = require('../config/redis');

// @desc    Create a new log
// @route   POST /api/logs
// @access  Public
exports.createLog = asyncWrapper(async (req, res) => {
    const {
        level,
        message,
        resourceId,
        timestamp,
        traceId,
        spanId,
        commit,
        metadata
    } = req.body;

    // Basic validation could be added here, simplified for brevity
    // Timestamp string to Date object conversion happens automatically by Mongoose if format is valid,
    // but we can enforce it explicitly if needed.

    const log = await Log.create({
        level,
        message,
        resourceId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        traceId,
        spanId,
        commit,
        metadata
    });

    // Invalidate cache on write
    const redisClient = getRedisClient();
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.flushAll();
        } catch (err) {
            console.error('Redis cache error:', err.message);
        }
    }

    res.status(201).json({
        success: true,
        data: log
    });
});

// @desc    Create bulk logs
// @route   POST /api/logs/bulk
// @access  Public
exports.createBulkLogs = asyncWrapper(async (req, res) => {
    const logs = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide an array of logs' });
    }

    // Ensure timestamps are date objects
    const formattedLogs = logs.map(log => ({
        ...log,
        timestamp: log.timestamp ? new Date(log.timestamp) : new Date()
    }));

    const result = await Log.insertMany(formattedLogs);

    // Invalidate cache on write
    const redisClient = getRedisClient();
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.flushAll();
        } catch (err) {
            console.error('Redis cache error:', err.message);
        }
    }

    res.status(201).json({
        success: true,
        count: result.length,
        message: `Successfully inserted ${result.length} logs`
    });
});

// @desc    Get all logs with advanced filtering and pagination
// @route   GET /api/logs
// @access  Public
exports.getLogs = asyncWrapper(async (req, res) => {
    // Check Redis Cache
    const redisClient = getRedisClient();
    const cacheKey = 'logs:' + JSON.stringify(req.query);

    if (redisClient && redisClient.isOpen) {
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                return res.status(200).json({
                    ...parsedData,
                    fromCache: true
                });
            }
        } catch (err) {
            console.error('Redis cache error:', err.message);
            // Fallback to database if redis fails
        }
    }

    const query = buildQuery(req.query);

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Execute query with pagination and sort
    // Sort by timestamp DESC
    const logs = await Log.find(query)
        .sort({ timestamp: -1 })
        .skip(startIndex)
        .limit(limit);

    const total = await Log.countDocuments(query);

    const totalPages = Math.ceil(total / limit);

    const responseData = {
        success: true,
        data: logs,
        pagination: {
            total,
            page,
            limit,
            totalPages
        }
    };

    // Set Redis Cache
    if (redisClient && redisClient.isOpen) {
        try {
            await redisClient.setEx(cacheKey, 30, JSON.stringify(responseData));
        } catch (err) {
            console.error('Redis cache error:', err.message);
        }
    }

    res.status(200).json({
        ...responseData,
        fromCache: false
    });
});
