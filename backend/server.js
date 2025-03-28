const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const { connectToRedis } = require('./services/redis');

app.use(express.json());

async function startServer() {
    console.info('Starting express server with redis ....');
    try {
        const redisClient = await connectToRedis(REDIS_PORT)
        await redisClient.connect();
        console.info('Redis connected on PORT', REDIS_PORT)
        app.locals.redis = redisClient
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.err(err);
    }
}

startServer();