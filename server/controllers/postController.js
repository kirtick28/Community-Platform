const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Post content is required' });
  }

  try {
    const newPost = await Post.create({
      content,
      author: req.user._id
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post' });
  }
};

const populateComments = async (comments) => {
  return await Promise.all(
    comments.map(async (comment) => {
      const populatedComment = await Comment.findById(comment._id).populate(
        'author',
        'name username'
      );
      if (!populatedComment) return null;

      const replies = await Comment.find({
        parentComment: populatedComment._id
      }).sort({ createdAt: 1 });
      const populatedReplies = await populateComments(replies);

      return {
        ...populatedComment.toObject(),
        replies: populatedReplies.filter((r) => r !== null)
      };
    })
  );
};

const fetchPostsWithDetails = async (query = {}) => {
  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .populate('author', '_id name username');

  const detailedPosts = await Promise.all(
    posts.map(async (post) => {
      const topLevelComments = await Comment.find({
        post: post._id,
        parentComment: null
      }).sort({ createdAt: 1 });
      const populatedComments = await populateComments(topLevelComments);

      return {
        ...post.toObject(),
        comments: populatedComments
      };
    })
  );

  return detailedPosts;
};

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Private
const getAllPosts = async (req, res) => {
  try {
    const posts = await fetchPostsWithDetails();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// @desc    Get a single post by ID
// @route   GET /api/posts/:postId
// @access  Private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate(
      'author',
      'name bio'
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post' });
  }
};

// @desc    Update a post (only by author)
// @route   PUT /api/posts/:postId
// @access  Private
const updatePost = async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Post content is required' });
  }

  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this post' });
    }
    post.content = content;
    await post.save();

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (err) {
    res.status(500).json({ message: 'Error updating post' });
  }
};

// @desc    Delete post (if author)
// @route   DELETE /api/posts/:postId
// @access  Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting post' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost
};
