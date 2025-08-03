const User = require('../models/User');
const bcrypt = require('bcrypt');

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

// @desc    Get all users
// @route   GET /api/users
// @access  Private (or Public if you removed auth)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Update user
// @route   PUT /api/user
// @access  Private
const updateUser = async (req, res) => {
  const { name, username, email, bio, oldPassword, newPassword } = req.body;
  console.log(req.body);
  if (!name && !username && !email && !bio && !newPassword) {
    return res.status(400).json({ message: 'Please provide data to update' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (name) user.name = name;

    if (username) {
      const usernameExists = await User.findOne({ username });
      if (
        usernameExists &&
        usernameExists._id.toString() !== user._id.toString()
      ) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }
    if (bio) user.bio = bio;
    if (newPassword) {
      if (!oldPassword) {
        return res
          .status(400)
          .json({ message: 'Old password is required to set new password' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Old password is incorrect' });
      }

      user.password = newPassword; // Will be hashed via pre-save hook
    }
    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
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
  getAllUsers,
  updateUser,
  deleteUser
};
