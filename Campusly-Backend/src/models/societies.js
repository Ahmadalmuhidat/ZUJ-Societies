const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const memberSchema = new mongoose.Schema({
  ID: {
    type: String,
    default: uuidv4
  },
  User: String,
  Role: {
    type: String,
    enum: ['admin', 'moderator', 'member'],
    default: 'member'
  },
  JoinedAt: {
    type: Date,
    default: Date.now
  }
});

const inviteSchema = new mongoose.Schema({
  ID: {
    type: String,
    default: uuidv4
  },
  Inviter: String,
  Invitee: String,
  Status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending'
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

const joinRequestSchema = new mongoose.Schema({
  ID: {
    type: String,
    default: uuidv4
  },
  User: String,
  Status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  RequestedAt: {
    type: Date,
    default: Date.now
  }
});

const societySchema = new mongoose.Schema({
  ID: {
    type: String,
    unique: true,
    required: true,
    default: function () { return uuidv4(); }
  },
  Name: String,
  Description: String,
  User: String,
  Category: String,
  Image: String,
  CreatedAt: {
    type: Date,
    default: Date.now
  },

  Privacy: {
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    joinApproval: {
      type: Boolean,
      default: true
    },
    memberListVisible: {
      type: Boolean,
      default: true
    },
    eventsVisible: {
      type: Boolean,
      default: true
    }
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
    newMemberNotifications: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    }
  },

  Members: {
    type: [memberSchema],
    default: []
  },
  Invites: {
    type: [inviteSchema],
    default: []
  },
  JoinRequests: {
    type: [joinRequestSchema],
    default: []
  }
});

module.exports = mongoose.model('Society', societySchema);
