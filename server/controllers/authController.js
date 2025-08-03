const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, username, email, password, bio } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const user = await User.create({ name, username, email, password, bio });
  const token = generateToken(user);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio
    }
  });
};

// @desc    Login a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);

  res.status(200).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio
    }
  });
};

module.exports = {
  registerUser,
  loginUser
};
