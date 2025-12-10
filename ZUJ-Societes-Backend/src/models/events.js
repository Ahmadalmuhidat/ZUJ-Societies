const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const attendanceSchema = new mongoose.Schema({
  User: { type: String, required: true },
  Status: {
    type: String,
    enum: ["attending", "not_attending"],
    default: "not_attending"
  },
  UpdatedAt: { type: Date, default: Date.now }
});

const interactionSchema = new mongoose.Schema({
  ID: { type: String, required: true, default: uuidv4 },
  User: { type: String, required: true },
  Action: {
    type: String,
    enum: ['share', 'view'],
    required: true
  },
  CreatedAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  ID: {
    type: String,
    unique: true,
    required: true,
    default: function () { return uuidv4(); }
  },
  Title: String,
  Description: String,
  Date: Date,
  StartTime: String,
  EndTime: String,
  User: String,
  Society: String,
  Location: String,
  Image: String,
  Category: String,

  Attendance: { type: [attendanceSchema], default: [] },
  Interactions: { type: [interactionSchema], default: [] },

  CreatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", eventSchema);
