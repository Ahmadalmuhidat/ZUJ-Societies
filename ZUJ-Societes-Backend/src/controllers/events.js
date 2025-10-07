const Event = require("../models/events");
const User = require("../models/users");
const Society = require("../models/societies");
const SocietyMember = require("../models/societyMembers");
const EventAttendance = require("../models/eventAttendance");
const EventInteractions = require("../models/eventInteractions");
const { v4: uuidv4 } = require("uuid");
const jsonWebToken = require("../helper/json_web_token");
const jwt = require("jsonwebtoken");
const mailer = require("../services/mailer");
const { sendNotificationToUsers } = require('./notifications');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}, "-_id -__v").lean();
    res.status(200).json({ data: events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get Events" });
  }
};

exports.getEventInfo = async (req, res) => {
  try {
    const event = await Event.findOne({ ID: req.query.event_id }).lean();
    if (!event) return res.status(404).json({ error_message: "Event not found" });

    const organizer = await User.findOne({ ID: event.User }).select("Name").lean();
    res.status(200).json({ data: { ...event, Organizer: organizer?.Name || null } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get Event info" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];
    const newEventId = uuidv4();

    const newEvent = new Event({
      ID: newEventId,
      Title: req.body.title,
      Description: req.body.description,
      Date: req.body.date,
      Time: req.body.time,
      User: userId,
      Society: req.body.society_id,
      Location: req.body.location,
      Image: req.body.image,
      Category: req.body.category
    });

    await newEvent.save();

    try {
      const society = await Society.findOne({ ID: req.body.society_id });
      const eventCreator = await User.findOne({ ID: userId }).select('Name Photo');
      
      const members = await SocietyMember.find({ Society: req.body.society_id }).select("User").lean();
      const memberUserIds = members.map(m => m.User);
      
      if (memberUserIds.length > 0) {
        const notification = {
          type: 'new_event',
          title: 'New Event Created',
          message: `${eventCreator?.Name || 'Someone'} created a new event: "${req.body.title}" in ${society?.Name || 'your society'}`,
          data: {
            eventId: newEventId,
            societyId: req.body.society_id,
            userId: userId,
            eventTitle: req.body.title,
            societyName: society?.Name
          },
          time: new Date().toISOString()
        };

        await sendNotificationToUsers(memberUserIds, notification);
      }
    } catch (notificationError) {
      console.error('Failed to send event notification:', notificationError);
    }

    res.status(201).json({ data: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to create event" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { event_id } = req.query;
    let token = req.query.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }

    if (!event_id) {
      return res.status(400).json({ error_message: "Event ID is required" });
    }

    if (!token) {
      return res.status(401).json({ error_message: "Token is required" });
    }

    const event = await Event.findOne({ ID: event_id });
    if (!event) {
      return res.status(404).json({ error_message: "Event not found" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userId = user.id;
    const isCreator = event.User && event.User === userId;

    let isAdminOrModerator = false;
    if (event.Society) {
      try {
        const member = await SocietyMember.findOne({ 
          Society: event.Society, 
          User: userId 
        });
        isAdminOrModerator = member && (member.Role === 'admin' || member.Role === 'moderator');
      } catch (err) {
        console.error('Error checking admin/moderator status:', err);
      }
    }

    if (!isCreator && !isAdminOrModerator) {
      return res.status(403).json({ error_message: "You don't have permission to delete this event" });
    }

    const result = await Event.deleteOne({ ID: event_id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error_message: "Event not found" });
    }

    res.status(200).json({ 
      message: "Event deleted successfully",
      data: result 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to delete event" });
  }
};

exports.getEventsBySociety = async (req, res) => {
  try {
    const events = await Event.find({ Society: req.query.society_id }).lean();
    const userIds = events.map(e => e.User);
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name").lean();

    const result = events.map(event => {
      const organizer = users.find(u => u.ID === event.User);
      return {
        ...event,
        Organizer: organizer?.Name || null
      };
    });

    res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get Events for this society" });
  }
};

exports.getEventStats = async (req, res) => {
  try {
    const eventId = req.query.event_id;
    if (!eventId) {
      return res.status(400).json({ error_message: "Event ID is required" });
    }

    const [attendingCount, interestedCount, shareCount] = await Promise.all([
      EventAttendance.countDocuments({ Event: eventId, Status: 'attending' }),
      EventAttendance.countDocuments({ Event: eventId, Status: 'interested' }),
      EventInteractions.countDocuments({ Event: eventId, Action: 'share' })
    ]);

    res.status(200).json({ 
      data: {
        attendees: attendingCount,
        interested: interestedCount,
        shares: shareCount
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get event statistics" });
  }
};

exports.toggleEventAttendance = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];
    const eventId = req.body.event_id;
    const status = req.body.status;

    if (!eventId || !status) {
      return res.status(400).json({ error_message: "Event ID and status are required" });
    }

    const event = await Event.findOne({ ID: eventId });
    if (!event) {
      return res.status(404).json({ error_message: "Event not found" });
    }

    let attendance = await EventAttendance.findOne({ Event: eventId, User: userId });
    
    if (attendance) {
      attendance.Status = status;
      attendance.UpdatedAt = new Date();
      await attendance.save();
    } else {
      attendance = new EventAttendance({
        Event: eventId,
        User: userId,
        Status: status
      });
      await attendance.save();
    }

    res.status(200).json({ 
      data: { 
        message: `Successfully ${status} event`,
        status: attendance.Status
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to update event attendance" });
  }
};

exports.toggleEventBookmark = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];
    const eventId = req.body.event_id;

    if (!eventId) {
      return res.status(400).json({ error_message: "Event ID is required" });
    }

    const existingBookmark = await EventInteractions.findOne({
      Event: eventId,
      User: userId,
      Action: 'bookmark'
    });

    if (existingBookmark) {
      await EventInteractions.deleteOne({ _id: existingBookmark._id });
      res.status(200).json({ data: { bookmarked: false, message: "Bookmark removed" } });
    } else {
      const newBookmark = new EventInteractions({
        ID: uuidv4(),
        Event: eventId,
        User: userId,
        Action: 'bookmark'
      });
      await newBookmark.save();
      res.status(200).json({ data: { bookmarked: true, message: "Event bookmarked" } });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to toggle bookmark" });
  }
};

exports.recordEventShare = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];
    const eventId = req.body.event_id;

    if (!eventId) {
      return res.status(400).json({ error_message: "Event ID is required" });
    }

    const shareRecord = new EventInteractions({
      ID: uuidv4(),
      Event: eventId,
      User: userId,
      Action: 'share'
    });
    await shareRecord.save();

    res.status(200).json({ data: { message: "Share recorded successfully" } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to record share" });
  }
};

exports.getUserEventStatus = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.query.token)['id'];
    const eventId = req.query.event_id;

    if (!eventId) {
      return res.status(400).json({ error_message: "Event ID is required" });
    }

    const attendance = await EventAttendance.findOne({ Event: eventId, User: userId });
    const bookmark = await EventInteractions.findOne({ Event: eventId, User: userId, Action: 'bookmark' });

    res.status(200).json({ 
      data: {
        attendance: attendance?.Status || null,
        bookmarked: !!bookmark
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get user event status" });
  }
};

exports.getRelatedEvents = async (req, res) => {
  try {
    const eventId = req.query.event_id;
    const limit = parseInt(req.query.limit) || 3;

    if (!eventId) {
      return res.status(400).json({ error_message: "Event ID is required" });
    }

    const currentEvent = await Event.findOne({ ID: eventId });
    if (!currentEvent) {
      return res.status(404).json({ error_message: "Event not found" });
    }

    const relatedEvents = await Event.find({
      Category: currentEvent.Category,
      ID: { $ne: eventId }
    })
    .sort({ CreatedAt: -1 })
    .limit(limit)
    .lean();

    const result = await Promise.all(
      relatedEvents.map(async (event) => {
        const organizer = await User.findOne({ ID: event.User }).select("Name").lean();
        return {
          ...event,
          Organizer: organizer?.Name || null
        };
      })
    );

    res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get related events" });
  }
};

exports.getEventsAttendedByUser = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const limit = parseInt(req.query.limit) || 10;

    if (!userId) {
      return res.status(400).json({ error_message: "User ID is required" });
    }

    const attendanceRecords = await EventAttendance.find({ 
      User: userId, 
      Status: 'attending' 
    }).limit(limit).lean();

    if (attendanceRecords.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const eventIds = attendanceRecords.map(record => record.Event);
    const events = await Event.find({ 
      ID: { $in: eventIds } 
    }).lean();

    const societyIds = [...new Set(events.map(e => e.Society).filter(Boolean))];
    const societies = await Society.find({ 
      ID: { $in: societyIds } 
    }).lean();

    const societyMap = {};
    societies.forEach(society => {
      societyMap[society.ID] = society;
    });

    const result = events.map(event => ({
      ...event,
      Society_Name: societyMap[event.Society]?.Name || null,
      Society_Image: societyMap[event.Society]?.Image || null
    }));

    res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get events attended by user" });
  }
};
