const Like = require('../models/likes');
const Post = require('../models/posts');
const User = require("../models/users");
const Society = require("../models/societies");
const Comment = require('../models/comments');
const SocietyMember = require("../models/societyMembers");
const { v4: uuidv4 } = require("uuid");
const jsonWebToken = require("../helper/json_web_token");
const { sendNotificationToUsers } = require('./notifications');

exports.getAllPosts = async (req, res) => {
  try {
    const token = req.query.token;

    let userId;
    try {
      userId = jsonWebToken.verify_token(token)['id'];
    } catch {
      return res.status(401).json({ error_message: "Invalid token" });
    }

    const societyMemberships = await SocietyMember.find({ User: userId }).select("Society");
    const societyIds = societyMemberships.map(m => m.Society);

    const posts = await Post.find({ Society: { $in: societyIds } }).sort({ CreatedAt: -1 }).lean();
    const userIds = [...new Set(posts.map(p => p.User.toString()))];
    const postIds = posts.map(p => p._id.toString());

    const [users, societies, likes] = await Promise.all([
      User.find({ ID: { $in: userIds } }).select("ID Name Photo").lean(),
      Society.find({ ID: { $in: societyIds } }).select("ID Name").lean(),
      Like.find({ User: userId, Post: { $in: postIds } }).lean()
    ]);

    const postsWithDetails = posts.map(post => {
      const postUser = users.find(u => u.ID === post.User);
      const postSociety = societies.find(s => s.ID === post.Society);
      const isLiked = likes.some(l => l.Post.toString() === post._id.toString());

      const likeCount = post.LikesCount || 0;

      return {
        ID: post.ID,
        Content: post.Content || "",
        Likes: likeCount,
        Image: post.Image || "",
        Comments: post.CommentsCount || 0,
        Society_Name: postSociety?.Name || null,
        User: post.User,
        User_Name: postUser?.Name || null,
        User_Image: postUser?.Photo || null,
        Is_Liked: isLiked ? 1 : 0
      };
    });

    return res.status(200).json({ data: postsWithDetails });
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    return res.status(500).json({ error_message: "Failed to get Posts" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { society_id, content, image, token } = req.body;

    const decoded = jsonWebToken.verify_token(token);
    const userId = decoded.id;

    const society = await Society.findOne({ ID: society_id });
    if (!society) {
      return res.status(404).json({ error_message: 'Society not found' });
    }

    const whoCanPost = society.Permissions?.whoCanPost || 'all-members';
    const membership = await SocietyMember.findOne({ Society: society_id, User: userId });
    const userRole = membership?.Role;

    const isAllowedToPost =
      (whoCanPost === 'all-members') ||
      (whoCanPost === 'moderators' && ['moderator', 'admin'].includes(userRole)) ||
      (whoCanPost === 'admins' && userRole === 'admin');

    if (!isAllowedToPost) {
      return res.status(403).json({ error_message: 'You do not have permission to post in this society.' });
    }

    const post = new Post({
      ID: uuidv4(),
      Content: content,
      Image: image,
      User: userId,
      Society: society_id,
      LikesCount: 0,
      CommentsCount: 0,
      CreatedAt: new Date()
    });

    await post.save();

    try {
      const societyMembers = await SocietyMember.find({ Society: society_id }).select('User');
      const memberUserIds = societyMembers.map(member => member.User.toString());
      const user = await User.findById(userId).select('Name Photo');
      
      const notification = {
        type: 'post',
        title: 'New Post',
        message: `${user?.Name || 'Someone'} posted in ${society.Name}`,
        data: {
          postId: post.ID,
          societyId: society_id,
          userId: userId
        },
        time: new Date().toISOString()
      };

      sendNotificationToUsers(memberUserIds, notification);
    } catch (notificationError) {
      console.error('Failed to send post notification:', notificationError);
    }

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error_message: 'Internal server error' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { post_id } = req.query;
    let token = req.query.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }

    if (!token) {
      return res.status(401).json({ error_message: "Token is required" });
    }

    let userId;
    try {
      const userData = jsonWebToken.verify_token(token);
      userId = userData['id'];
    } catch (error) {
      return res.status(401).json({ error_message: "Invalid or expired token" });
    }

    if (!userId) {
      return res.status(401).json({ error_message: "Invalid token payload" });
    }

    const post = await Post.findOne({ ID: post_id });
    if (!post) {
      return res.status(404).json({ error_message: "Post not found" });
    }

    if (String(post.User) !== String(userId)) {
      return res.status(403).json({ error_message: "Not authorized to delete this post" });
    }

    await Post.deleteOne({ ID: post_id });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to delete post" });
  }
};

exports.getPostsBySociety = async (req, res) => {
  try {
    const token = req.query.token || req.headers.authorization?.split(' ')[1];
    const userId = jsonWebToken.verify_token(token).id;

    const societyId = req.query.society_id;
    if (!societyId) return res.status(400).json({ error_message: "Missing society_id" });

    const posts = await Post.find({ Society: societyId }).sort({ CreatedAt: -1 });
    const userIds = [...new Set(posts.map(p => p.User.toString()))];
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name Photo").lean();
    const postIds = posts.map(p => p._id.toString());
    const likes = await Like.find({ Post: { $in: postIds } }).lean();
    const userLikes = new Set(
      likes.filter(like => like.User.toString() === userId).map(like => like.Post.toString())
    );

    const postsWithDetails = posts.map(post => {
      const postUser = users.find(u => u.ID === post.User);
      const likeCount = post.LikesCount || 0;
      const isLiked = userLikes.has(post._id.toString()) ? 1 : 0;

      return {
        ID: post.ID,
        Content: post.Content,
        Likes: likeCount,
        Image: post.Image || "",
        Comments: post.CommentsCount || 0,
        User: post.User,
        User_Name: postUser?.Name || null,
        User_Image: postUser?.Photo || null,
        Is_Liked: isLiked
      };
    });

    res.status(200).json({ data: postsWithDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get Posts for this society" });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];
    const postId = req.body.post_id;

    const post = await Post.findOne({ ID: postId });
    if (!post) {
      return res.status(404).json({ error_message: "Post not found" });
    }

    const existingLike = await Like.findOne({ User: userId, Post: post._id.toString() });
    if (!existingLike) {
      return res.status(400).json({ error_message: "User has not liked this post" });
    }

    await Like.deleteOne({ _id: existingLike._id });

    await Post.updateOne(
      { ID: postId },
      { $inc: { LikesCount: -1 } }
    );

    res.status(200).json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to unlike post" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];
    const postId = req.body.post_id;

    const post = await Post.findOne({ ID: postId });
    if (!post) {
      return res.status(404).json({ error_message: "Post not found" });
    }

    const existingLike = await Like.findOne({ User: userId, Post: post._id.toString() });
    if (existingLike) return res.status(400).json({ error_message: "User already liked this post" });

    const newLike = new Like({ ID: uuidv4(), User: userId, Post: post._id.toString() });
    await newLike.save();

    await Post.updateOne({ ID: postId }, { $inc: { LikesCount: 1 } });

    try {
      if (post.User.toString() !== userId) {
        const user = await User.findOne({ ID: userId }).select('Name Photo');
        const postAuthor = await User.findOne({ ID: post.User }).select('Name');
        
        const notification = {
          type: 'like',
          title: 'New Like',
          message: `${user?.Name || 'Someone'} liked your post`,
          data: {
            likeId: newLike.ID,
            postId: postId,
            userId: userId
          },
          time: new Date().toISOString()
        };

        await sendNotificationToUsers([post.User.toString()], notification);
      }
    } catch (notificationError) {
      console.error('Failed to send like notification:', notificationError);
    }

    res.status(201).json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to like post" });
  }
};

exports.getCommentsForPost = async (req, res) => {
  try {
    const postId = req.query.post_id;

    const comments = await Comment.find({ Post: postId })
      .sort({ CreatedAt: -1 })
      .lean();

    res.status(200).json({ data: comments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get comments" });
  }
};
