const getChildUserId = async (redis, userId) => {
    const userDetails = await redis.hgetall(`user:${userId}`)
    const { familyId, role } = userDetails;
    if (role != 'Parent') return null;
    const memberIds = await redis.smembers(`familyGroup:${familyId}:members`);

    const memberData = await Promise.all(
        memberIds.map(userId => redis.hgetall(`user:${userId}`))
    );

    // Filter by role
    const children = memberData.filter(member => member.role === 'Child');
    if (children.length) return children[0].userId;

    return null;
}
const dashboard = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { userId, role } = req.user;
    const redis = req.app.locals.redis;

    let dashboardUser = await redis.hgetall(`user:${userId}`);

    const portfolioUserId = role === 'Child' ? userId : await getChildUserId(redis, userId);
    if (portfolioUserId === null) return res.status(401).json({ error: 'Portfolio not found for user' });

    let portfolioUser = portfolioUserId === userId ? dashboardUser : await redis.hgetall(`user:${portfolioUserId}`);
    let portfolio = await redis.hgetall(`portfolio:${portfolioUserId}`);
    const history = await redis.lrange(`portfolio:${portfolioUserId}:history`, 0, -1);
    const investmentSymbols = await redis.lrange(`investment:${portfolioUserId}:symbol`, 0, -1);
    const investmentPromises = investmentSymbols.map(async (investmentSymbol) => redis.hgetall(`investment:${portfolioUserId}:${investmentSymbol}`))
    const investments = await Promise.all(investmentPromises);

    res.json({
        ...dashboardUser,
        portfolio: {
            ...portfolioUser,
            ...portfolio,
            history,
            investments,
        },
    })

}

module.exports = {
    dashboard
}