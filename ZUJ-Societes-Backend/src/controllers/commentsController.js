const Comment = require("../models/comments");
const User = require("../models/users");
const Post = require("../models/posts");
const jsonWebToken = require("../helpers/jsonWebToken");
const serverSentEvents = require('../helpers/serverSentEvents');

exports.createComment = async (req, res) => {
  try {
    const { content, post_id } = req.body;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];

    const newComment = new Comment({
      Content: content,
      Post: post_id,
      User: userId
    });

    await newComment.save();

    try {
      const post = await Post.findOne({ ID: post_id });
      if (post && post.User.toString() !== userId) {
        const user = await User.findOne({ ID: userId }).select('Name Photo');
        
        const notification = {
          type: 'comment',
          title: 'New Comment',
          message: `${user?.Name || 'Someone'} commented on your post`,
          data: {
            commentId: newComment.ID,
            postId: post._id.toString(),
            userId: userId
          },
          time: new Date().toISOString()
        };

        await serverSentEvents.sendToUser([post.User.toString()], notification);
      }
    } catch (notificationError) {
      console.error('Failed to send comment notification:', notificationError);
    }

    res.status(201).json({ data: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to create comment." });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.query;
    const token = req.headers['authorization']?.split(' ')[1];
    const userId = jsonWebToken.verifyToken(token)['id'];

    const comment = await Comment.findOne({ ID: comment_id });
    if (!comment) {
      return res.status(404).json({ error_message: "Comment not found." });
    }

    if (comment.User !== userId) {
      return res.status(403).json({ error_message: "Not authorized to delete this comment." });
    }

    const result = await Comment.deleteOne({ ID: comment_id });
    res.status(200).json({ data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to delete comment." });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const { post_id } = req.query;
    const comments = await Comment.find({ Post: post_id }).lean();

    const userIds = comments.map(c => c.User);
    const users = await User.find({ ID: { $in: userIds } }).select("ID Name Photo").lean();

    const data = comments.map(comment => {
      const user = users.find(u => u.ID === comment.User) || {};
      return {
        ID: comment.ID,
        Content: comment.Content,
        User: comment.User,
        User_Name: user.Name || null,
        User_Photo: user.Photo || null
      };
    });

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to get Comments for this post." });
  }
};
