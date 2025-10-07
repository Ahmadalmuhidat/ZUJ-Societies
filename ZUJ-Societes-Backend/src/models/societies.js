const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  ID: { type: String, unique: true },
  Name: String,
  Description: String,
  User: String,
  Category: String,
  Visibility: String,
  Image: String,
  CreatedAt: { type: Date, default: Date.now },

  Privacy: {
    visibility: {
      type: String,
      enum: ['public', 'private', 'invite-only'],
      default: 'public'
    },
    joinApproval: { type: Boolean, default: true },
    memberListVisible: { type: Boolean, default: true },
    eventsVisible: { type: Boolean, default: true }
  },

  Permissions: {
    whoCanPost: {
      type: String,
      enum: ['admins', 'moderators', 'all-members'],
      default: 'all-members'
    },
    whoCanCreateEvents: {
      type: String,
      enum: ['admins', 'moderators', 'all-members'],
      default: 'moderators'
    },
    whoCanInvite: {
      type: String,
      enum: ['admins', 'moderators', 'all-members'],
      default: 'admins'
    }
  },

  Notifications: {
    newMemberNotifications: { type: Boolean, default: true },
    eventReminders: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false },
    emailNotifications: { type: Boolean, default: true }
  }
});

module.exports = mongoose.model('Society', societySchema);
