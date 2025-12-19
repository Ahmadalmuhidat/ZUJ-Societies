const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const notificationSchema = new mongoose.Schema({
  ID: {
    type: String,
    unique: true,
    required: true,
    default: function () { return uuidv4(); }
  },
  User: {
    type: String,
    required: true
  },
  Type: {
    type: String,
    required: true,
    enum: ['like',
      'comment',
      'join_request',
      'join_approved',
      'join_rejected',
      'new_event',
      'post',
      'invitation'
    ]
  },
  Title: {
    type: String,
    required: true
  },
  Message: {
    type: String,
    required: true
  },
  Data: {
    type: Object,
    default: {}
  },
  Read: {
    type: Boolean,
    default: false
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', notificationSchema);


