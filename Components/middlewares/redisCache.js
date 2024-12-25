const redisClient = require('../../config/redis');

const redisCache = {
    CourseListCache: async (req, res, next) => {
        const cacheKey = req.originalUrl;
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
    },

    CourseDetailCache: async (req, res, next) => {
        const cacheKey = req.params.id;
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                console.log('Cache hit');
                const data = JSON.parse(cachedData);
                return res.status(200).render("pages/CourseDetail", data);
            }
            console.log('Cache miss');
            next();
        } catch (err) {
            console.error('Error checking cache:', err);
            next();
        }
    },

    CourseRenderCache: async (req, res, next) => {
        const cacheKey = req.originalUrl;
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                const data = JSON.parse(cachedData);
                return res.status(200).render("pages/Courseslist", data);
            }
            console.log('Cache miss');
            next();
        } catch (err) {
            console.error('Error checking cache:', err);
            next();
        }
    }
};

module.exports = redisCache;