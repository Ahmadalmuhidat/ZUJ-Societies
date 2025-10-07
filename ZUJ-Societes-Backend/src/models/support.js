const mongoose = require("mongoose");

const supportSchema = new mongoose.Schema({
  ID: { type: String, unique: true, required: true },
  User: { type: String, required: true },
  Category: String,
  Subject: String,
  Content: String,
  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Support", supportSchema);
