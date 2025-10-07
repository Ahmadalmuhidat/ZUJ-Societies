const mongoose = require('mongoose');

const societyJoinRequestSchema = new mongoose.Schema({
  ID: { type: String, unique: true },
  Society: String,
  User: String,
  Status: { type: String, default: 'pending' },
  RequestedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocietyJoinRequest', societyJoinRequestSchema);