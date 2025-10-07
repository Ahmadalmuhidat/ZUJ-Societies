const User = require('../models/users');
const Post = require('../models/posts');
const Event = require('../models/events');
const Society = require('../models/societies');
const Comment = require('../models/comments');
const Like = require('../models/likes');
const { v4: uuidv4 } = require("uuid");
const jsonWebToken = require("../helper/json_web_token");

exports.getPlatformAnalytics = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ error_message: "Token required" });
    }

    const [
      totalUsers,
      totalSocieties,
      totalPosts,
      totalEvents,
      totalComments
    ] = await Promise.all([
      User.countDocuments(),
      Society.countDocuments(),
      Post.countDocuments(),
      Event.countDocuments(),
      Comment.countDocuments()
    ]);

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
    res.status(500).json({ error_message: "Failed to fetch analytics" });
  }
};

exports.getTrendingPosts = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ error_message: "Token required" });
    }

    let userId;
    try {
      userId = jsonWebToken.verify_token(token)['id'];
    } catch {
      return res.status(401).json({ error_message: "Invalid token" });
    }

    const limit = parseInt(req.query.limit) || 10;
    const days = parseInt(req.query.days) || 7;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - days);

    const posts = await Post.find({
      CreatedAt: { $gte: daysAgo }
    })
    .sort({ Likes: -1, CommentsCount: -1 })
    .limit(limit);

    const postIds = posts.map(p => p._id.toString());
    const likes = await Like.find({ Post: { $in: postIds } }).lean();
    
    const userLikes = new Set(
      likes.filter(like => like.User.toString() === userId).map(like => like.Post.toString())
    );

    const userIds = [...new Set(posts.map(p => p.User.toString()))];
    const societyIds = [...new Set(posts.map(p => p.Society.toString()))];
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name Photo").lean();
    const societies = await Society.find({ ID: { $in: societyIds } }).select("ID Name").lean();

    const trendingPosts = posts.map(post => {
      const postUser = users.find(u => u.ID === post.User);
      const postSociety = societies.find(s => s.ID === post.Society);
      const likeCount = post.LikesCount || 0;
      const isLiked = userLikes.has(post._id.toString());

      return {
        ID: post.ID,
        Content: post.Content,
        Likes: likeCount,
        CommentsCount: post.CommentsCount || 0,
        Comments: post.Comments || 0,
        Image: post.Image,
        CreatedAt: post.CreatedAt,
        Is_Liked: isLiked,
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
    res.status(500).json({ error_message: "Failed to fetch trending posts" });
  }
};

exports.getActivityFeed = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ error_message: "Token required" });
    }

    const limit = parseInt(req.query.limit) || 20;
    const userId = req.query.user_id;

    const activities = [];

    const recentPosts = await Post.find({})
      .sort({ CreatedAt: -1 })
      .limit(5);

    recentPosts.forEach(post => {
      activities.push({
        id: `post-${post.ID}`,
        type: 'post',
        user: 'User', // Will be populated by frontend
        action: 'created a new post',
        target: 'Society', // Will be populated by frontend
        time: post.CreatedAt,
        avatar: 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png',
        data: {
          postId: post.ID,
          content: post.Content,
          userId: post.User,
          societyId: post.Society
        }
      });
    });

    const recentEvents = await Event.find({})
      .sort({ CreatedAt: -1 })
      .limit(3);

    recentEvents.forEach(event => {
      activities.push({
        id: `event-${event.ID}`,
        type: 'event',
        user: 'User', // Will be populated by frontend
        action: 'created an event',
        target: event.Title,
        time: event.CreatedAt,
        avatar: 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png',
        data: {
          eventId: event.ID,
          title: event.Title,
          userId: event.User,
          societyId: event.Society
        }
      });
    });

    const recentSocieties = await Society.find({})
      .sort({ CreatedAt: -1 })
      .limit(2);

    recentSocieties.forEach(society => {
      activities.push({
        id: `society-${society.ID}`,
        type: 'society',
        user: 'User', // Will be populated by frontend
        action: 'created a society',
        target: society.Name,
        time: society.CreatedAt,
        avatar: 'https://cdn-icons-png.flaticon.com/512/4537/4537019.png',
        data: {
          societyId: society.ID,
          name: society.Name,
          userId: society.User
        }
      });
    });

    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const limitedActivities = activities.slice(0, limit);

    res.status(200).json({ data: limitedActivities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to fetch activity feed" });
  }
};

exports.getUserRecommendations = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(401).json({ error_message: "Token required" });
    }

    const userId = req.query.user_id;
    if (!userId) {
      return res.status(400).json({ error_message: "User ID required" });
    }

    const allSocieties = await Society.find({});
    const userSocietyIds = []; // This would need to be populated based on actual membership logic
    
    const userCategories = [...new Set(allSocieties.map(s => s.Category).filter(Boolean))];

    const recommendedSocieties = await Society.find({
      ID: { $nin: userSocietyIds },
      Category: { $in: userCategories }
    }).limit(3);

    const recommendedEvents = await Event.find({}).limit(2);
    const recommendations = [];

    recommendedSocieties.forEach(society => {
      recommendations.push({
        id: society.ID,
        type: 'society',
        title: society.Name,
        description: society.Description,
        reason: `Similar to your interests in ${society.Category}`,
        members: society.Member_Count || 0,
        category: society.Category,
        image: society.Image
      });
    });

    recommendedEvents.forEach(event => {
      recommendations.push({
        id: event.ID,
        type: 'event',
        title: event.Title,
        description: event.Description,
        reason: 'From your societies',
        date: event.Date,
        time: event.Time,
        location: event.Location,
        image: event.Image
      });
    });

    res.status(200).json({ data: recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to fetch recommendations" });
  }
};
