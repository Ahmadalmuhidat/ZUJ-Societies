const Support = require("../models/support");
const JsonWebToken = require("../helpers/jsonWebToken");

exports.CreateTicket = async (req, res) => {
  try {
    const { subject, category, content} = req.body;
    const userId = JsonWebToken.verifyToken(token)['id'];

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


