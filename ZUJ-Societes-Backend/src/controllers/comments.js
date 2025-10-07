const Comment = require("../models/comments");
const User = require("../models/users");
const Post = require("../models/posts");
const { v4: uuidv4 } = require("uuid");
const jsonWebToken = require("../helper/json_web_token");
const { sendNotificationToUsers } = require('./notifications');

exports.createComment = async (req, res) => {
  try {
    const userId = jsonWebToken.verify_token(req.body.token)['id'];

    const newComment = new Comment({
      ID: uuidv4(),
      Content: req.body.content,
      Post: req.body.post_id,
      User: userId
    });

    await newComment.save();

    try {
      const post = await Post.findOne({ ID: req.body.post_id });
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

        await sendNotificationToUsers([post.User.toString()], notification);
      }
    } catch (notificationError) {
      console.error('Failed to send comment notification:', notificationError);
    }

    res.status(201).json({ data: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to create comment" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { comment_id, token } = req.query;
    const userId = jsonWebToken.verify_token(token)['id'];

    const comment = await Comment.findOne({ ID: comment_id });
    if (!comment) {
      return res.status(404).json({ error_message: "Comment not found" });
    }

    if (comment.User !== userId) {
      return res.status(403).json({ error_message: "Not authorized to delete this comment" });
    }

    const result = await Comment.deleteOne({ ID: comment_id });
    res.status(200).json({ message: "Comment deleted successfully", data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error_message: "Failed to delete comment" });
  }
};

exports.getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({ Post: req.query.post_id }).lean();

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
    res.status(500).json({ error_message: "Failed to get Comments for this post" });
  }
};
