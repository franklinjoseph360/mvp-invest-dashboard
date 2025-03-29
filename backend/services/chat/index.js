const { WebSocketServer } = require('ws');
const { getPrivateChatKey } = require('../../utils/chatKey');

function setupWebSocketServer(server, redisClient) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', async (data) => {
      try {
        const msg = JSON.parse(data);
        const {
          familyId,
          senderId,
          receiverId,
          message: text,
          timestamp = new Date().toISOString(),
        } = msg;

        if (!familyId || !senderId || !receiverId || !text) {
          console.warn('Invalid WebSocket message payload');
          return;
        }

        const chatMessage = {
          senderId,
          receiverId,
          message: text,
          timestamp,
        };

        const redisKey = getPrivateChatKey(familyId, senderId, receiverId);
        console.log('redisKey', redisKey)
        await redisClient.rpush(redisKey, JSON.stringify(chatMessage));

        // TODO: don't broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ ...chatMessage, familyId }));
          }
        });

        console.log(`Stored and broadcasted: ${redisKey}`);
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  console.log('WebSocket server is ready');
}

module.exports = { setupWebSocketServer };
