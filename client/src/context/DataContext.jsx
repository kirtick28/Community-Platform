import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext();
const API_URL = import.meta.env.API_URL;

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [allPosts, setAllPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await axios.get(`${API_URL}/posts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAllPosts(response.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchPosts();
      fetchUsers();
    } else if (!authLoading && !user) {
      setLoading(false);
      setAllUsers([]);
      setAllPosts([]);
    }
  }, [user, authLoading]);

  const createPost = async (content) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/posts`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchPosts();
      return { success: true };
    } catch (err) {
      console.error('Error creating post:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to create post'
      };
    }
  };

  const updatePost = async (postId, newContent) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/posts/${postId}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchPosts();
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const deletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const toggleLike = async (postId) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/likes/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchPosts();
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const addComment = async (postId, content, parentCommentId = null) => {
    if (!user) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/comments/${postId}`,
        { content, parentComment: parentCommentId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await fetchPosts();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPosts = allPosts.filter((p) =>
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const value = {
    posts: allPosts,
    filteredPosts,
    filteredUsers,
    allPosts,
    allUsers,
    searchTerm,
    loading,
    setSearchTerm,
    createPost,
    deletePost,
    toggleLike,
    addComment,
    setAllUsers,
    updatePost
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
