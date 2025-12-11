const { createClient } = require('redis');

let redisClient;

const connectRedis = async () => {
    try {
        const url = process.env.REDIS_URL;

        if (!url) {
            throw new Error('REDIS_URL is not defined in .env');
        }

        console.log('Connecting to Redis at:', url);

        redisClient = createClient({ url });

        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err.message);
        });

        await redisClient.connect();

        console.log('Redis connected');
        return redisClient;

    } catch (err) {
        console.error('Redis connection failed:', err.message);
        // Crucial: Do NOT throw error to prevent server crash
        // We just return null or let the app continue without Redis
        console.log('Continuing without Redis caching...');
    }
};

module.exports = { connectRedis, getRedisClient: () => redisClient };
