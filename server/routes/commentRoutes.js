const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createComment,
  getCommentsByPost,
  getReplies,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

// @route   POST /api/comments/:postId
// @desc    Add a comment to a post
// @access  Private
router.post('/:postId', authenticate, createComment);

// @route   GET /api/comments/:postId
// @desc    Fetch comments for a post
// @access  Private
router.get('/:postId', authenticate, getCommentsByPost);

// @desc    Get all direct replies to a specific comment
// @route   GET /api/comments/replies/:commentId
// @access  Private
router.get('/replies/:commentId', authenticate, getReplies);

// @route   PUT /api/comments/:commentId
// @desc    Update a comment by ID
// @access  Private
router.put('/:commentId', authenticate, updateComment);

// @route   DELETE /api/comments/:commentId
// @desc    Delete a comment by ID
// @access  Private
router.delete('/:commentId', authenticate, deleteComment);

module.exports = router;
