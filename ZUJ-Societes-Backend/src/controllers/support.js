const Support = require("../models/support");
const Report = require("../models/reports");
const { v4: uuidv4 } = require("uuid");
const jsonWebToken = require("../helper/json_web_token");

exports.CreateTicket = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];

    const newTicket = new Support({
      ID: uuidv4(),
      User: userId,
      Category: req.body.category,
      Subject: req.body.subject,
      Content: req.body.content
    });

    await newTicket.save();
    res.status(201).json({ data: newTicket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to create ticket" });
  }
};

exports.reportPost = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];

    const newReport = new Report({
      ID: uuidv4(),
      Type: "post",
      ReferenceID: req.body.post_id,
      User: userId,
      Reason: req.body.reason || ""
    });

    await newReport.save();
    res.status(201).json({ data: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to report post" });
  }
};

exports.reportEvent = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];

    const newReport = new Report({
      ID: uuidv4(),
      Type: "event",
      ReferenceID: req.body.event_id,
      User: userId,
      Reason: req.body.reason || ""
    });

    await newReport.save();
    res.status(201).json({ data: newReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to report event" });
  }
};
