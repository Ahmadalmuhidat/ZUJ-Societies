const JsonWebToken = require("../helpers/jsonWebToken");
const Notification = require("../models/notifications");
const ServerSentEvents = require('../helpers/serverSentEvents');

exports.getNotifications = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];
    const notifications = await Notification.find({ User: userId }).sort({ CreatedAt: -1 }).limit(50);

    res.status(200).json({ data: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to fetch notifications." });
  }
};

exports.getNotificationsSSE = (req, res) => {
  const token = req.query.token;
  const userId = JsonWebToken.verifyToken(token)['id'];

  ServerSentEvents.addClient(userId, res);
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];

    await Notification.updateOne({ ID: notificationId, User: userId }, { Read: true });
    res.status(200).json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to mark notification as read." });
  }
};

exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];

    await Notification.updateMany({ User: userId, Read: false }, { Read: true });
    res.status(200).json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to mark all notifications as read." });
  }
};
