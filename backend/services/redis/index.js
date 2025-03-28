const Redis = require('ioredis');

async function connectToRedis(PORT) {
    console.log('Connection to Redis .....')
    return new Redis({
        host: '127.0.0.1',
        port: process.env.REDIS_PORT,
        lazyConnect: true
    });
}

module.exports = {
    connectToRedis
};
