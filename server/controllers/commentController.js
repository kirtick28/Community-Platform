const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Create a comment (on post or another comment)
// @route   POST /api/comments/:postId
// @access  Private
const createComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;

    const newComment = await Comment.create({
      post: req.params.postId,
      content,
      author: req.user.id,
      parentComment: parentComment || null
    });

    res.status(201).json(newComment);
  } catch (err) {
    console.error('Create Comment Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get all comments on a post
// @route   GET /api/comments/:postId
// @access  Private
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId, parentComment: null })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Private (Author only)
const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Only author can update
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    console.error('Update Comment Error:', error.message);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get replies of a comment
// @route   GET /api/comments/replies/:commentId
// @access  Private
const getReplies = async (req, res) => {
  try {
    const replies = await Comment.find({
      parentComment: req.params.commentId
    }).populate('author', 'name');

    res.status(200).json(replies);
  } catch (err) {
    console.error('Get Replies Error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private (Author only)
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ msg: 'Comment not found' });
    if (!comment.author.equals(req.user._id))
      return res.status(403).json({ msg: 'Not authorized' });

    const deleteReplies = async (parentId) => {
      const replies = await Comment.find({ parentComment: parentId });
      for (const reply of replies) {
        await deleteReplies(reply._id);
        await reply.deleteOne();
      }
    };

    await deleteReplies(commentId);
    await comment.deleteOne();

    res.status(200).json({ msg: 'Comment and replies deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  getReplies,
  updateComment,
  deleteComment
};
