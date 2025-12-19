const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const reportSchema = new mongoose.Schema({
  ID: {
    type: String,
    unique: true,
    required: true,
    default: function () { return uuidv4(); }
  },
  Type: {
    type: String,
    enum: ["post", "event"],
    required: true
  },
  ReferenceID: {
    type: String,
    required: true
  },
  User: {
    type: String,
    required: true
  },
  Reason: String,
  CreatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", reportSchema);
