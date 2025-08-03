const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const {
  getUserProfile,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// @route   GET /api/user/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get('/profile', authenticate, getUserProfile);

// @route   GET /api/user/:userId
// @desc    Get public profile by userId
// @access  Private (only logged-in users can view)
router.get('/:userId', authenticate, getUserById);

// @route   GET /api/user/
// @desc    Get All users profiles
// @access  Private
router.get('/', authenticate, getAllUsers);

// @route   PUT /api/user
// @desc    Update logged-in user's profile
// @access  Private
router.put('/', authenticate, updateUser);

// @route   DELETE /api/user
// @desc    Delete logged-in user's profile
// @access  Private
router.delete('/', authenticate, deleteUser);

module.exports = router;
