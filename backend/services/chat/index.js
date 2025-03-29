const { WebSocketServer } = require('ws');

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
          message: text,
          timestamp = new Date().toISOString(),
          senderRole,
        } = msg;

        if (!familyId || !senderId || !text) {
          console.warn('Invalid WebSocket message payload');
          return;
        }

        const chatMessage = {
          senderId,
          senderRole,
          message: text,
          timestamp,
        };

        const redisKey = `chat:${familyId}`;
        await redisClient.rpush(redisKey, JSON.stringify(chatMessage));

        // Broadcast to all connected clients (you can later filter by familyId if needed)
        wss.clients.forEach((client) => {
          if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify({ ...chatMessage, familyId }));
          }
        });

        console.log(`Stored and broadcasted group message: ${redisKey}`);
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
