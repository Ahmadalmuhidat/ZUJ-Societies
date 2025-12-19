const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const supportSchema = new mongoose.Schema({
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
  Category: String,
  Subject: String,
  Content: String,
  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Support", supportSchema);
