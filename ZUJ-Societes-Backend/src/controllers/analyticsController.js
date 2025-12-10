const User = require('../models/users');
const Post = require('../models/posts');
const Event = require('../models/events');
const Society = require('../models/societies');
const jsonWebToken = require("../helpers/jsonWebToken");

exports.getPlatformAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSocieties,
      totalPosts,
      totalEvents
    ] = await Promise.all([
      User.countDocuments(),
      Society.countDocuments(),
      Post.countDocuments(),
      Event.countDocuments()
    ]);

    // Count total comments from all posts
    const posts = await Post.find({}).select('CommentsCount').lean();
    const totalComments = posts.reduce((sum, post) => sum + (post.CommentsCount || 0), 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentPosts = await Post.countDocuments({
      CreatedAt: { $gte: sevenDaysAgo }
    });

    const recentEvents = await Event.countDocuments({
      CreatedAt: { $gte: sevenDaysAgo }
    });

    const recentSocieties = await Society.countDocuments({
      CreatedAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      data: {
        totalUsers,
        totalSocieties,
        totalPosts,
        totalEvents,
        totalComments,
        recentActivity: {
          posts: recentPosts,
          events: recentEvents,
          societies: recentSocieties
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to fetch analytics." });
  }
};

exports.getTrendingPosts = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];
    const limit = parseInt(req.query.limit) || 10;
    const days = parseInt(req.query.days) || 7;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const posts = await Post.find({
      CreatedAt: { $gte: daysAgo }
    })
      .sort({ LikesCount: -1, CommentsCount: -1 })
      .limit(limit);

    const userIds = [...new Set(posts.map(post => post.User.toString()))];
    const societyIds = [...new Set(posts.map(post => post.Society.toString()))];
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name Photo").lean();
    const societies = await Society.find({ ID: { $in: societyIds } }).select("ID Name").lean();

    const trendingPosts = posts.map(post => {
      const postUser = users.find(user => user.ID === post.User);
      const postSociety = societies.find(society => society.ID === post.Society);
      const likeCount = post.LikesCount || 0;
      const isLiked = post.Likes?.some(like => like.User === userId) || false;

      return {
        ID: post.ID,
        Content: post.Content,
        Likes: likeCount,
        CommentsCount: post.CommentsCount || 0,
        Comments: post.CommentsCount || 0,
        Image: post.Image,
        CreatedAt: post.CreatedAt,
        IsLiked: isLiked,
        engagement: likeCount + (post.CommentsCount || 0),
        User_Name: postUser?.Name || 'Unknown User',
        User_Image: postUser?.Photo || 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png',
        Society_Name: postSociety?.Name || 'Unknown Society',
        User: post.User,
        Society: post.Society
      };
    });

    res.status(200).json({ data: trendingPosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to fetch trending posts." });
  }
};

exports.getActivityFeed = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];
    const limit = parseInt(req.query.limit) || 20;
    const activities = [];

    const allSocieties = await Society.find({}).select("ID Members").lean();
    const userSocieties = allSocieties
      .filter(s => s.Members?.some(m => m.User === userId))
      .map(s => s.ID);

    const recentPosts = await Post.aggregate([
      {
        $match: {
          Society: { $in: userSocieties }
        }
      },
      { $sort: { CreatedAt: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "ID",
          as: "UserData"
        }
      },
      { $unwind: { path: "$UserData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "societies",
          localField: "Society",
          foreignField: "ID",
          as: "SocietyData"
        }
      },
      { $unwind: { path: "$SocietyData", preserveNullAndEmptyArrays: true } }
    ]);

    recentPosts.forEach(post => {
      activities.push({
        id: `post-${post.ID}`,
        type: "post",
        user: post.UserData?.Name || "Unknown User",
        action: "created a new post in",
        target: post.SocietyData?.Name || "Unknown Society",
        time: post.CreatedAt,
        avatar: "https://cdn-icons-png.flaticon.com/512/4537/4537019.png",
        data: {
          postId: post.ID,
          content: post.Content,
          userId: post.User,
          societyId: post.Society
        }
      });
    });

    const recentEvents = await Event.aggregate([
      {
        $match: {
          Society: { $in: userSocieties }
        }
      },
      { $sort: { CreatedAt: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "ID",
          as: "UserData"
        }
      },
      { $unwind: { path: "$UserData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "societies",
          localField: "Society",
          foreignField: "ID",
          as: "SocietyData"
        }
      },
      { $unwind: { path: "$SocietyData", preserveNullAndEmptyArrays: true } }
    ]);

    recentEvents.forEach(event => {
      activities.push({
        id: `event-${event.ID}`,
        type: "event",
        user: event.UserData?.Name || "Unknown User",
        action: "created an event at",
        target: event.Title,
        time: event.CreatedAt,
        avatar: "https://cdn-icons-png.flaticon.com/512/4537/4537019.png",
        data: {
          eventId: event.ID,
          title: event.Title,
          userId: event.User,
          societyId: event.Society
        }
      });
    });

    const recentSocieties = await Society.aggregate([
      {
        $match: {
          Society: { $in: userSocieties }
        }
      },
      { $sort: { CreatedAt: -1 } },
      { $limit: 2 },
      {
        $lookup: {
          from: "users",
          localField: "User",
          foreignField: "ID",
          as: "UserData"
        }
      },
      { $unwind: { path: "$UserData", preserveNullAndEmptyArrays: true } }
    ]);

    recentSocieties.forEach(society => {
      activities.push({
        id: `society-${society.ID}`,
        type: "society",
        user: society.UserData?.Name || "Unknown User",
        action: "created a society",
        target: society.Name,
        time: society.CreatedAt,
        avatar: "https://cdn-icons-png.flaticon.com/512/4537/4537019.png",
        data: {
          societyId: society.ID,
          name: society.Name,
          userId: society.User
        }
      });
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json({
      data: activities.slice(0, limit)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to fetch activity feed." });
  }
};