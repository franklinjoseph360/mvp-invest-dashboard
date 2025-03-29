
exports.getChatMessages = async (req, res) => {
  const redis = req.app.locals.redis;
  const { familyId, userId } = req.params;

  if (userId != req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized sender' });
  }

  try {
    const key = `chat:${familyId}`;
    const raw = await redis.lrange(key, 0, -1);
    const messages = raw.map(JSON.parse);

    res.json({ familyId, messages });
  } catch (err) {
    console.error('Error fetching family chat messages:', err);
    res.status(500).json({ error: 'Could not fetch messages' });
  }
};

exports.postMessages = async (req, res) => {
  const redis = req.app.locals.redis;
  const { familyId, userId } = req.params;
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (userId != req.user.userId) {
    return res.status(401).json({ error: 'Unauthorized sender' });
  }

  const chatMessage = {
    senderId: userId,
    // senderRole: "", TODO: update role to support labels in REST API endpoint
    message,
    timestamp: new Date().toISOString(),
  };

  try {
    const key = `chat:${familyId}`;
    await redis.rpush(key, JSON.stringify(chatMessage));

    res.status(201).json({ status: 'Message sent', chatMessage });
  } catch (err) {
    console.error('Failed to send message:', err);
    res.status(500).json({ error: 'Could not send message' });
  }
};
