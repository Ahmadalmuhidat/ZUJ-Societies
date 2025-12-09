const Notification = require('../models/notifications');

class SSEManager {
  constructor() {
    this.connections = new Map();
    this.heartbeatInterval = 30000;
  }

  async storeNofitication(userIds, notification) {
    try {
      const notificationsToSave = userIds.map(userId => ({
        User: userId,
        Type: notification.type,
        Title: notification.title,
        Message: notification.message,
        Data: notification.data || {},
        Read: false,
        CreatedAt: new Date(notification.time || Date.now())
      }));

      await Notification.insertMany(notificationsToSave);
    } catch (error) {
      console.error('Failed to save notifications to database:', error);
    }
  }

  addClient(userId, res) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control, Authorization'
    });

    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'Connected to notifications' })}\n\n`);

    const heartbeat = setInterval(() => {
      if (!res.destroyed) {
        res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`);
      } else {
        this.removeClient(userId);
        clearInterval(heartbeat);
      }
    }, this.heartbeatInterval);

    res.on('close', () => {
      this.removeClient(userId);
      clearInterval(heartbeat);
    });

    this.connections.set(userId, { res, heartbeat });
  }

  removeClient(userId) {
    const client = this.connections.get(userId);
    if (client) {
      this.connections.delete(userId);
    }
  }

  sendToUser(userIds, notification) {
    try {
      for (const id of userIds) {
        this.storeNofitication([id], notification);
        const client = this.connections.get(id);

        if (client && !client.res.destroyed) {
          client.res.write(
            `data: ${JSON.stringify({
              type: notification.type,
              title: notification.title,
              message: notification.message,
              data: notification.data || {}
            })}\n\n`
          );
        }
      }
    } catch (error) {
      console.error(`Failed to send notification to user ${userIds}:`, error);
      userIds.forEach(id => this.removeClient(id));
    }
  }
}

module.exports = new SSEManager();