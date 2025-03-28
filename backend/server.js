const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

app.use(express.json());

const { connectToRedis } = require('./services/redis');
const initRoutes  = require('./routes');

async function startServer() {
    console.info('Starting express server with redis ....');
    try {
        const redisClient = await connectToRedis(REDIS_PORT)
        await redisClient.connect();
        console.info('Redis connected on PORT', REDIS_PORT)
        app.locals.redis = redisClient

        // backend routes
        initRoutes(app);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error(err);
    }
}

startServer();