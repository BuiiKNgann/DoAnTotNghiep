const mongoose = require('mongoose');

// Message
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  sentAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', MessageSchema);

// Notification
const NotificationSchema = new mongoose.Schema({
  title: String,
  content: String,
  targetUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { Message, Notification };
