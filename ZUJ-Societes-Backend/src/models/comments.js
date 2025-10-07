const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  ID: { type: String, unique: true },
  Post: String,
  User: String,
  Content: String,
  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
