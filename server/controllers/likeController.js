const Post = require('../models/Post');

// @desc    Like or unlike a post (toggle)
// @route   POST /api/likes/:postId
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId); // remove
      await post.save();
      return res.status(200).json({ msg: 'Unliked post' });
    } else {
      post.likes.push(userId); // add
      await post.save();
      return res.status(200).json({ msg: 'Liked post' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @desc    Get users who liked a post
// @route   GET /api/likes/:postId
// @access  Private
const getLikes = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate('likes', 'name email');
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    res.status(200).json(post.likes);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports = {
  toggleLike,
  getLikes
};
