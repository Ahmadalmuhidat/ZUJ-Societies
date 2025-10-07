const mongoose = require('mongoose');

const societyMemberSchema = new mongoose.Schema({
  ID: { type: String, unique: true },
  Society: String,
  User: String,
  Role: {
    type: String,
    enum: ['admin', 'moderator', 'member'],
    default: 'member'
  },
  JoinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocietyMember', societyMemberSchema);
