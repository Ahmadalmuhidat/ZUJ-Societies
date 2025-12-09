const Support = require("../models/support");
const Report = require("../models/reports");
const jsonWebToken = require("../helpers/jsonWebToken");

exports.CreateTicket = async (req, res) => {
  try {
    const { subject, category, content} = req.body;
    const userId = jsonWebToken.verifyToken(token)['id'];

    const newTicket = new Support({
      User: userId,
      Category: category,
      Subject: subject,
      Content: content
    });

    await newTicket.save();
    res.status(201).json({ data: newTicket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to create ticket." });
  }
};

exports.reportPost = async (req, res) => {
  try {
    const {post_id, message} = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];

    const newReport = new Report({
      Type: "post",
      ReferenceID: post_id,
      User: userId,
      Reason: message || ""
    });

    await newReport.save();
    res.status(201).json({ data: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to report post." });
  }
};

exports.reportEvent = async (req, res) => {
  try {
    const { event_id, reason } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];

    const newReport = new Report({
      Type: "event",
      ReferenceID: event_id,
      User: userId,
      Reason: reason || ""
    });

    await newReport.save();
    res.status(201).json({ data: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to report event." });
  }
};
