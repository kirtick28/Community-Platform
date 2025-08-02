const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { toggleLike, getLikes } = require('../controllers/likeController');

// @route   POST /api/likes/:postId
// @desc    Like or unlike a post
// @access  Private
router.post('/:postId', authenticate, toggleLike);

// @route   GET /api/likes/:postId
// @desc    Get all users who liked the post
// @access  Private
router.get('/:postId', authenticate, getLikes);

module.exports = router;
