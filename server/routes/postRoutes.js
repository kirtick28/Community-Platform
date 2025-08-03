const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost
} = require('../controllers/postController');

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', authenticate, createPost);

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Private
router.get('/', authenticate, getAllPosts);

// @route   GET /api/posts/:postId
// @desc    Get a single post by ID
// @access  Private
router.get('/:postId', authenticate, getPostById);

// @route   PUT /api/posts/:postId
// @desc    Update a single post by ID
// @access  Private
router.put('/:postId', authenticate, updatePost);

// @route   DELETE /api/posts/:postId
// @desc    Delete a post (only by author)
// @access  Private
router.delete('/:postId', authenticate, deletePost);

module.exports = router;
