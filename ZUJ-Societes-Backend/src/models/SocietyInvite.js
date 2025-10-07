const mongoose = require('mongoose');

const societyInviteSchema = new mongoose.Schema({
  ID: { type: String, unique: true },
  Society: String,
  Inviter: String,
  Invitee: String,
  Status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SocietyInvite', societyInviteSchema);
