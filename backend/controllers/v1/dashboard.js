const getUserIdByRole = async (redis, userId, role) => {
    const userDetails = await redis.hgetall(`user:${userId}`)

    const { familyId } = userDetails;

    const memberIds = await redis.smembers(`familyGroup:${familyId}:members`);
    const memberData = await Promise.all(
        memberIds.map(userId => redis.hgetall(`user:${userId}`))
    );

    // Filter by role
    const user = memberData.filter(member => member.role === role);
    if (!user?.length) return null;

    return user[0].userId
}

const dashboard = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { userId, role, familyId } = req.user;
    const redis = req.app.locals.redis;

    let dashboardUser = await redis.hgetall(`user:${userId}`);
    
    let portfolioUserId = userId;

    portfolioUserId = role === 'Child' ? userId : await getUserIdByRole(redis, userId, 'Child');;

    if (portfolioUserId === null) return res.status(401).json({ error: 'Portfolio not found for user' });

    let portfolioUser = portfolioUserId === userId ? dashboardUser : await redis.hgetall(`user:${portfolioUserId}`);
    let portfolio = await redis.hgetall(`portfolio:${portfolioUserId}`);

    const history = await redis.lrange(`portfolio:${portfolioUserId}:history`, 0, -1);

    const investmentSymbols = await redis.lrange(`investment:${portfolioUserId}:symbol`, 0, -1);
    const investmentPromises = investmentSymbols.map(async (investmentSymbol) => redis.hgetall(`investment:${portfolioUserId}:${investmentSymbol}`))
    const investments = await Promise.all(investmentPromises);

    const chatIds = {
        senderId: userId,
        familyId
    }
    

    res.json({
        ...dashboardUser,
        portfolio: {
            ...portfolioUser,
            ...portfolio,
            history,
            investments,
        },
        chat: {
            ...chatIds
        }
    })

}

module.exports = {
    dashboard
}