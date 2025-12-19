const User = require("../models/users");
const Post = require("../models/posts");
const Event = require("../models/events");
const Society = require("../models/societies");
const JsonWebToken = require("../helpers/jsonWebToken");

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ error_message: "Query must be at least 2 characters long." });
    }

    const users = await User.find(
      {
        $or: [
          {
            Name: {
              $regex: query,
              $options: 'i'
            }
          },
          {
            Email: {
              $regex: query,
              $options: 'i'
            }
          }
        ]
      },
      'ID Name Email Photo'
    ).limit(10);

    res.status(200).json({ data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to search users." });
  }
};

exports.getUserInformation = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];
    const user = await User.findOne({ ID: userId }, 'ID Name Email');
    if (!user) {
      return res.status(404).json({ error_message: "User not found." });
    }

    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get User." });
  }
};

exports.getUserProfileInformation = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];

    const user = await User.findOne(
      { ID: userId },
      'ID Name Email Phone_Number Bio Photo CreatedAt Notifications Privacy'
    );

    if (!user) return res.status(404).json({ error_message: "User not found." });

    const [postCount, eventCount, societyCount] = await Promise.all([
      Post.countDocuments({ User: userId }),
      Event.countDocuments({ User: userId }),
      Society.countDocuments({ User: userId })
    ]);

    res.status(200).json({
      data: {
        ...user.toObject(),
        Post_Count: postCount,
        Event_Count: eventCount,
        Society_Count: societyCount
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get User profile." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, bio, notifications, privacy } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];
    const updateData = {
      ...(name && { Name: name }),
      ...(email && { Email: email.toLowerCase() }),
      ...(phone && { Phone_Number: phone }),
      ...(bio && { Bio: bio }),
      ...(notifications && { Notifications: notifications }),
      ...(privacy && { Privacy: privacy })
    };

    const result = await User.findOneAndUpdate(
      { ID: userId },
      { $set: updateData },
      { new: true }
    );

    if (!result) return res.status(404).json({ error_message: "User not found." });

    res.status(204).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to update User profile." });
  }
};

exports.getUserPublicProfile = async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error_message: 'user_id is required' });
    }

    const token = req.headers['authorization']?.split(' ')[1];
    const viewerId = token ? JsonWebToken.verifyToken(token)['id'] : null;
    const isOwnProfile = viewerId === userId;

    const user = await User.findOne(
      { ID: userId },
      'ID Name Email Phone_Number Bio Photo CreatedAt Privacy'
    );

    if (!user) {
      return res.status(404).json({ error_message: 'User not found' });
    }

    const profileVisibility = user.Privacy?.profileVisibility || 'public';

    if (!isOwnProfile && profileVisibility === 'private') {
      return res.status(403).json({ error_message: 'This profile is private' });
    }

    if (!isOwnProfile && profileVisibility === 'members') {

      if (!viewerId) {
        return res.status(403).json({ error_message: 'This profile is only visible to society members' });
      }

      const viewerSocieties = await Society.find({ 'Members.User': viewerId }).select('ID').lean();
      const userSocieties = await Society.find({ 'Members.User': userId }).select('ID').lean();
      const viewerSocietyIds = viewerSocieties.map(society => society.ID);
      const userSocietyIds = userSocieties.map(society => society.ID);
      const hasCommonSociety = viewerSocietyIds.some(id => userSocietyIds.includes(id));

      if (!hasCommonSociety) {
        return res.status(403).json({ error_message: 'This profile is only visible to society members' });
      }
    }

    const userPosts = await Post.find({ User: userId }).select('Likes').lean();
    const likesCount = userPosts.reduce((sum, post) => sum + (post.Likes?.length || 0), 0);

    const [postCount, eventCount, societyCount] = await Promise.all([
      Post.countDocuments({ User: userId }),
      Event.countDocuments({ User: userId }),
      Society.countDocuments({ User: userId })
    ]);

    const showEmail = isOwnProfile || (user.Privacy?.showEmail ?? false);
    const showPhone = isOwnProfile || (user.Privacy?.showPhone ?? false);

    const profileData = {
      ID: user.ID,
      Name: user.Name,
      Bio: user.Bio,
      Photo: user.Photo,
      CreatedAt: user.CreatedAt,
      Post_Count: postCount,
      Event_Count: eventCount,
      Society_Count: societyCount,
      Likes_Count: likesCount
    };

    if (showEmail) {
      profileData.Email = user.Email;
    }

    if (showPhone) {
      profileData.Phone_Number = user.Phone_Number;
    }

    res.status(200).json({ data: profileData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: 'Failed to get public profile' });
  }
};

exports.getPostsByUserPublic = async (req, res) => {
  try {
    const { limit } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    if (!userID) {
      return res.status(400).json({ error_message: 'user_id is required.' });
    };

    const posts = await Post.find({ User: userID }, 'ID Content Image CreatedAt Likes')
      .sort({ CreatedAt: -1 })
      .limit(Math.min(parseInt(limit || '20', 10), 50))
      .lean();

    res.status(200).json({ data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: 'Failed to get user posts.' });
  }
};

exports.getSocietiesByUserPublic = async (req, res) => {
  try {
    const { limit } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    if (!userID) {
      return res.status(400).json({ error_message: 'user_id is required.' });
    }

    const societies = await Society.find({ User: userID }, 'ID Name Category Description Image CreatedAt Members')
      .sort({ CreatedAt: -1 })
      .limit(Math.min(parseInt(limit || '20', 10), 50))
      .lean();

    const societiesWithCounts = societies.map(society => ({
      ...society,
      Member_Count: society.Members?.length || 0
    }));

    res.status(200).json({ data: societiesWithCounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: 'Failed to get user societies.' });
  }
};

exports.getEventsAttendedByUser = async (req, res) => {
  try {
    const { limit } = req.query;

    const token = req.headers['authorization']?.split(' ')[1];
    const userID = JsonWebToken.verifyToken(token)['id'];

    const events = await Event.find({
      "Attendance.User": userID,
      "Attendance.Status": "attending"
    }).limit(parseInt(limit) || 10).lean();

    if (events.length === 0) {
      return res.status(200).json({ data: [] });
    }

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

exports.getUserEventStatus = async (req, res) => {
  try {
    const { event_id } = req.query;

    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];

    if (!event_id) {
      return res.status(400).json({ error_message: "Event ID is required." });
    }

    const event = await Event.findOne({ ID: event_id });
    const attendance = event?.Attendance.find(attendance => attendance.User === userId);

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

exports.getSocietiesByUser = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = JsonWebToken.verifyToken(token)['id'];
    const createdSocieties = await Society.find({ User: userId });
    const allSocieties = await Society.find({});
    const memberSocieties = allSocieties.filter(society =>
      society.Members?.some(m => m.User === userId && society.User !== userId)
    );

    const societiesWithCounts = [...createdSocieties, ...memberSocieties].map(society => ({
      ...society.toObject(),
      Member_Count: society.Members.length
    }));

    const combined = [
      ...societiesWithCounts.filter(society => createdSocieties.some(created_societies => created_societies.ID === society.ID)).map(society => ({ ...society, Role: 'creator' })),
      ...societiesWithCounts.filter(society => memberSocieties.some(member_societies => member_societies.ID === society.ID)).map(society => {
        const membership = society.Members.find(member => member.User === userId);
        return { ...society, Role: membership?.Role || null };
      })
    ];

    res.status(200).json({ data: combined });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get societies for the user." });
  }
};