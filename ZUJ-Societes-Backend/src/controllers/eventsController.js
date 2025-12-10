const Event = require("../models/events");
const User = require("../models/users");
const Society = require("../models/societies");
const SocietyMember = require("../models/societyMembers");
const EventAttendance = require("../models/eventAttendance");
const EventInteractions = require("../models/eventInteractions");
const jsonWebToken = require("../helpers/jsonWebToken");
const mailer = require("../services/mailer");
const serverSentEvents = require('../helpers/serverSentEvents');

exports.getAllEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find(
      { CreatedAt: { $gte: today } },
      "-__v"
    ).lean();

    res.status(200).json({ data: events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get events." });
  }
};

exports.getEventInfo = async (req, res) => {
  try {
    const { event_id } = req.query;

    const event = await Event.findOne({ ID: event_id }).lean();
    if (!event) {
      return res.status(404).json({ error_message: "Event not found." });
    }

    const organizer = await User.findOne({ ID: event.User }).select("Name").lean();
    res.status(200).json({ data: { ...event, Organizer: organizer?.Name || null } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get Event info." });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      start_time,
      end_time,
      society_id,
      location,
      image,
      category
    } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];
    const society = await Society.findOne({ ID: society_id });

    if (!society) {
      return res.status(404).json({ error_message: 'Society not found.' });
    }

    const whoCanCreateEvent = society.Permissions?.whoCanCreateEvents || 'all-members';
    const membership = await SocietyMember.findOne({ Society: society_id, User: userId });
    const userRole = membership?.Role;

    const isAllowedToCreateEvents =
      (whoCanCreateEvent === 'all-members') ||
      (whoCanCreateEvent === 'moderators' && ['moderator', 'admin'].includes(userRole)) ||
      (whoCanCreateEvent === 'admins' && userRole === 'admin');

    if (!isAllowedToCreateEvents) {
      return res.status(403).json({ error_message: 'You do not have permission to create events in this society.' });
    }

    const newEvent = new Event({
      Title: title,
      Description: description,
      Date: date,
      StartTime: start_time,
      EndTime: end_time,
      User: userId,
      Society: society_id,
      Location: location,
      Image: image,
      Category: category
    });

    await newEvent.save();

    try {
      const society = await Society.findOne({ ID: society_id });
      const eventCreator = await User.findOne({ ID: userId }).select('Name Photo');

      const members = await SocietyMember.find({ Society: society_id, User: { $ne: userId } }).select("User").lean();
      const memberUserIds = members.map(member => member.User);

      if (memberUserIds.length > 0) {
        const notification = {
          type: 'new_event',
          title: 'New Event Created',
          message: `${eventCreator?.Name || 'Someone'} created a new event: "${title}" in ${society?.Name || 'your society'}`,
          data: {
            eventId: newEvent.ID,
            societyId: society_id,
            userId: userId,
            eventTitle: title,
            societyName: society?.Name
          },
          time: new Date().toISOString()
        };
        await serverSentEvents.sendToUser(memberUserIds, notification);
      }
    } catch (notificationError) {
      console.error('Failed to send event notification:', notificationError);
    }
    res.status(201).json({ data: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to create event." });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { event_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];

    if (!event_id) {
      return res.status(400).json({ error_message: "Event ID is required." });
    }

    const event = await Event.findOne({ ID: event_id });
    if (!event) {
      return res.status(404).json({ error_message: "Event not found." });
    }

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
      return res.status(403).json({ error_message: "You don't have permission to delete this event." });
    }

    const result = await Event.deleteOne({ ID: event_id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error_message: "Event not found." });
    }

    res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to delete event." });
  }
};

exports.getEventsBySociety = async (req, res) => {
  try {
    const { society_id } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find(
      {
        Society: society_id,
        CreatedAt: { $gte: today }
      }
    ).lean();

    const userIds = events.map(e => e.User);
    const users = await User.find({ ID: { $in: userIds } })
      .select("ID Name")
      .lean();

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
    res.status(500).json({ error_message: "Failed to get Events for this society." });
  }
};

exports.getEventStats = async (req, res) => {
  try {
    const { event_id } = req.query;

    if (!event_id) {
      return res.status(400).json({ error_message: "Event ID is required." });
    }

    const [attendingCount, shareCount] = await Promise.all([
      EventAttendance.countDocuments({ Event: event_id, Status: 'attending' }),
      EventInteractions.countDocuments({ Event: event_id, Action: 'share' })
    ]);

    res.status(200).json({
      data: {
        attendees: attendingCount,
        shares: shareCount
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get event statistics." });
  }
};

exports.toggleEventAttendance = async (req, res) => {
  try {
    const { event_id, status } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];

    if (!event_id || !status) {
      return res.status(400).json({ error_message: "Event ID and status are required." });
    }

    const event = await Event.findOne({ ID: event_id });
    if (!event) {
      return res.status(404).json({ error_message: "Event not found." });
    }

    let attendance = await EventAttendance.findOne({ Event: event_id, User: userId });

    if (attendance) {
      attendance.Status = status;
      attendance.UpdatedAt = new Date();
      await attendance.save();
    } else {
      attendance = new EventAttendance({
        Event: event_id,
        User: userId,
        Status: status
      });
      await attendance.save();
    }

    res.status(200).json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to update event attendance." });
  }
};

exports.recordEventShare = async (req, res) => {
  try {
    const { event_id } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];

    if (!event_id) {
      return res.status(400).json({ error_message: "Event ID is required." });
    }

    const shareRecord = new EventInteractions({
      Event: event_id,
      User: userId,
      Action: 'share'
    });
    await shareRecord.save();

    res.status(200).json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to record share" });
  }
};

exports.getUserEventStatus = async (req, res) => {
  try {
    const { event_id } = req.query;

    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];

    if (!event_id) {
      return res.status(400).json({ error_message: "Event ID is required." });
    }

    const attendance = await EventAttendance.findOne({ Event: event_id, User: userId });

    res.status(200).json({
      data: {
        attendance: attendance?.Status || null,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get user event status." });
  }
};

exports.getEventsAttendedByUser = async (req, res) => {
  try {
    const { limit } = req.query;

    const token = req.headers['authorization']?.split(' ')[1];
    const userID = jsonWebToken.verifyToken(token)['id'];

    const attendanceRecords = await EventAttendance.find({
      User: userID,
      Status: 'attending'
    }).limit(parseInt(limit) || 10).lean();

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
    res.status(500).json({ error_message: "Failed to get events attended by user." });
  }
};
