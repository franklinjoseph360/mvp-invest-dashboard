
const { getPrivateChatKey } = require('../../utils/chatKey');

exports.getChatMessages = async (req, res) => {
    const redis = req.app.locals.redis;
    const { familyId, userId, receiverId } = req.params;

    if (!receiverId) {
        return res.status(400).json({ error: 'receiverId is required in route' });
    }

    if (userId != req.user.userId) {
        return res.status(401).json({
            error: 'Wrong sender'
        })
    }

    try {
        const key = getPrivateChatKey(familyId, userId, receiverId);
        const raw = await redis.lrange(key, 0, -1);
        const messages = raw.map(JSON.parse);

        res.json({ familyId, participants: [userId, receiverId], messages });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Could not fetch messages' });
    }
};

exports.postMessages = async (req, res) => {
    const redis = req.app.locals.redis;
    const { familyId, userId, receiverId } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    if (userId != req.user.userId) {
        return res.status(401).json({
            error: 'Wrong sender'
        })
    }

    const chatMessage = {
        senderId: userId,
        receiverId,
        message,
        timestamp: new Date().toISOString(),
    };

    try {
        const key = getPrivateChatKey(familyId, userId, receiverId);
        await redis.rpush(key, JSON.stringify(chatMessage));

        res.status(201).json({ status: 'Message sent', chatMessage });
    } catch (err) {
        console.error('Failed to send message:', err);
        res.status(500).json({ error: 'Could not send message' });
    }
};
