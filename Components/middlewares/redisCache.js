const redisClient = require('../../config/redis');

const redisCache = async (req, res, next) => {
    const cacheKey = req.originalUrl; // Use the request URL as the cache key

    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('Cache hit');
            return res.json(JSON.parse(cachedData));
        }
        console.log('Cache miss');
        next();
    } catch (err) {
        console.error('Error checking cache:', err);
        next();
    }
};

module.exports = redisCache;