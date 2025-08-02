const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Create a comment on a post
// @route   POST /api/comments/:postId
// @access  Private
const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get all comments on a post
// @route   GET /api/comments/:postId
// @access  Private
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
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

    await comment.deleteOne();
    res.status(200).json({ msg: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment
};
