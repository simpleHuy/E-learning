const redis = require("redis");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

const redisClient = redis.createClient({
    username: 'default',
    password: 'IzOpBngdPcPTeSuA63AVnBHjf1KOr662',
    socket: {
        host: 'redis-12111.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',
        port: 12111
    }
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});
redisClient.on("error", (err) => {
});


module.exports = redisClient;