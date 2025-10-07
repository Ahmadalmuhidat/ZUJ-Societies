const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  ID: { type: String, unique: true },
  User: String,
  Post: String,
  CreatedAt: { type: Date, default: Date.now }
});

likeSchema.index({ User: 1, Post: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
