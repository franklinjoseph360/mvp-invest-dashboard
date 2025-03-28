const familyGroups = require('./__mock_data__/familyGroups.json');
const portfolios = require('./__mock_data__/portfolio.json');
const investments = require('./__mock_data__/investments.json');

const { connectToRedis } = require('../services/redis')

async function loadData(redis) {
    // Load Family Data
    for (const familyId in familyGroups) {
        for (const member of familyGroups[familyId].members) {
            const { role, name, userId } = member;
            await redis.hset(`user:${userId}`, {
                familyId,
                name,
                role
            });
            await redis.sadd(`familyGroup:${familyId}:members`, userId)
            await redis.hset(`login:${userId}`, {
                username: userId,
                password: userId
            })
        }
    }

    // Load portfolio data
    for (const userId in portfolios) {
        const { portfolioValue, monthlyChange, historicalValues } = portfolios[userId];

        await redis.hset(`portfolio:${userId}`, {
            portfolioValue,
            monthlyChange,
        });

        for (const entry of historicalValues) {
            await redis.rpush(`portfolio:${userId}:history`, JSON.stringify(entry));
        }
    }

    // Load investments data
    for (const userId in investments) {
        for (const investment of investments[userId]) {
            const { symbol, ...rest} = investment;
            redis.hset(`investment:${userId}:${symbol}`, rest)
            redis.rpush(`investment:${userId}:symbol`, symbol)
        }
    }
}

async function main() {
    // Flust first for good measure
    const redisClient = await connectToRedis(process.env.PORT || 6379)
    await redisClient.flushdb();
    console.log('Redis DB Flushed');
    // Load data from mock json
    await loadData(redisClient);
}

main().then((res) => console.log(res));
