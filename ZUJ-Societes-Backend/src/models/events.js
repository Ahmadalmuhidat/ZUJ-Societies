const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  ID: { type: String, unique: true, required: true },
  Title: String,
  Description: String,
  Date: Date,
  Time: String,
  User: String,
  Society: String,
  Location: String,
  Image: String,
  Category: String,
  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);
