const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// @desc    Get another user's profile by ID
// @route   GET /api/user/:userId
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};

// @desc    Search users by name or email
// @route   GET /api/user/search
// @access  Private
const searchUsers = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // case-insensitive
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password'); // don't return passwords

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error searching users' });
  }
};

// @desc    Update user
// @route   PUT /api/user
// @access  Private
const updateUser = async (req, res) => {
  const { name, bio } = req.body;

  if (!name && !bio) {
    return res.status(400).json({ message: 'Please provide data to update' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user profile' });
  }
};

// @desc    Delete user
// @route   DELETE /api/user
// @access  Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.remove();

    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user profile' });
  }
};

module.exports = {
  getUserProfile,
  getUserById,
  searchUsers,
  updateUser,
  deleteUser
};
