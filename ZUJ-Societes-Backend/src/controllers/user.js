const User = require("../models/users");
const Post = require("../models/posts");
const Event = require("../models/events");
const Society = require("../models/societies");
const jsonWebToken = require("../helper/json_web_token");

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ error_message: "Query must be at least 2 characters long" });
    }

    const users = await User.find(
      {
        $or: [
          { Name: { $regex: query, $options: 'i' } },
          { Email: { $regex: query, $options: 'i' } }
        ]
      },
      'ID Name Email Photo'
    ).limit(10);

    res.status(200).json({ data: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to search users" });
  }
};

exports.getUserInformation = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.query.token)['id'];
    const user = await User.findOne({ ID: userId }, 'ID Name Email');
    if (!user) return res.status(404).json({ error_message: "User not found" });
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get User" });
  }
};

exports.getUserProfileInformation = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.query.token)['id'];

    const user = await User.findOne(
      { ID: userId },
      'ID Name Email Phone_Number Bio Photo CreatedAt Notifications Privacy'
    );

    if (!user) return res.status(404).json({ error_message: "User not found" });

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
    res.status(500).json({ error_message: "Failed to get User profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];
    const updateData = {
      ...(req.body.name && { Name: req.body.name }),
      ...(req.body.email && { Email: req.body.email.toLowerCase() }),
      ...(req.body.phone && { Phone_Number: req.body.phone }),
      ...(req.body.bio && { Bio: req.body.bio }),
      ...(req.body.notifications && { Notifications: req.body.notifications }),
      ...(req.body.privacy && { Privacy: req.body.privacy })
    };

    const result = await User.findOneAndUpdate(
      { ID: userId },
      { $set: updateData },
      { new: true }
    );

    if (!result) return res.status(404).json({ error_message: "User not found" });

    res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to update User profile" });
  }
};

exports.getUserPublicProfile = async (req, res) => {
  try {
    const userId = req.query.user_id;
    if (!userId) return res.status(400).json({ error_message: 'user_id is required' });

    const user = await User.findOne(
      { ID: userId },
      'ID Name Email Bio Photo CreatedAt'
    );

    if (!user) return res.status(404).json({ error_message: 'User not found' });

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
    res.status(500).json({ error_message: 'Failed to get public profile' });
  }
};

exports.getPostsByUserPublic = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);
    if (!userId) return res.status(400).json({ error_message: 'user_id is required' });

    const posts = await Post.find({ User: userId }, 'ID Content Image CreatedAt Likes')
      .sort({ CreatedAt: -1 })
      .limit(limit)
      .lean();

    res.status(200).json({ data: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: 'Failed to get user posts' });
  }
};

exports.getSocietiesByUserPublic = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 50);
    if (!userId) return res.status(400).json({ error_message: 'user_id is required' });

    const SocietyMember = require("../models/societyMembers");
    const societies = await Society.find({ User: userId }, 'ID Name Category Description Image CreatedAt')
      .sort({ CreatedAt: -1 })
      .limit(limit)
      .lean();

    const societiesWithCounts = await Promise.all(
      societies.map(async (society) => {
        const memberCount = await SocietyMember.countDocuments({ Society: society.ID });
        return {
          ...society,
          Member_Count: memberCount
        };
      })
    );

    res.status(200).json({ data: societiesWithCounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: 'Failed to get user societies' });
  }
};