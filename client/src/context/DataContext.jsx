import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext.jsx'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within DataProvider')
  }
  return context
}

export const DataProvider = ({ children }) => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const savedPosts = localStorage.getItem('posts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      // Initialize with sample data
      const samplePosts = [
        {
          id: '1',
          userId: 'sample1',
          username: 'john_doe',
          name: 'John Doe',
          content: 'Just launched my new project! Excited to share it with everyone. Building in public has been an amazing journey.',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          likes: ['sample2', 'sample3'],
          comments: [
            {
              id: '1',
              userId: 'sample2',
              username: 'jane_smith',
              name: 'Jane Smith',
              content: 'Congratulations! Looks amazing!',
              createdAt: new Date(Date.now() - 43200000).toISOString(),
              replies: []
            }
          ]
        },
        {
          id: '2',
          userId: 'sample2',
          username: 'jane_smith',
          name: 'Jane Smith',
          content: 'Beautiful sunset today! Sometimes we need to pause and appreciate the simple things in life.',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          likes: ['sample1'],
          comments: []
        }
      ]
      setPosts(samplePosts)
      localStorage.setItem('posts', JSON.stringify(samplePosts))
    }
  }, [])

  const createPost = (content) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    const newPost = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      name: user.name,
      content,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: []
    }

    const updatedPosts = [newPost, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem('posts', JSON.stringify(updatedPosts))
    return { success: true }
  }

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId)
    setPosts(updatedPosts)
    localStorage.setItem('posts', JSON.stringify(updatedPosts))
  }

  const toggleLike = (postId) => {
    if (!user) return

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(user.id)
          ? post.likes.filter(id => id !== user.id)
          : [...post.likes, user.id]
        return { ...post, likes }
      }
      return post
    })

    setPosts(updatedPosts)
    localStorage.setItem('posts', JSON.stringify(updatedPosts))
  }

  const addComment = (postId, content, parentCommentId = null) => {
    if (!user) return

    const newComment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      name: user.name,
      content,
      createdAt: new Date().toISOString(),
      replies: []
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        if (parentCommentId) {
          // Add reply to existing comment
          const updateCommentsRecursively = (comments) => {
            return comments.map(comment => {
              if (comment.id === parentCommentId) {
                return { ...comment, replies: [...comment.replies, newComment] }
              }
              if (comment.replies.length > 0) {
                return { ...comment, replies: updateCommentsRecursively(comment.replies) }
              }
              return comment
            })
          }
          return { ...post, comments: updateCommentsRecursively(post.comments) }
        } else {
          // Add new top-level comment
          return { ...post, comments: [...post.comments, newComment] }
        }
      }
      return post
    })

    setPosts(updatedPosts)
    localStorage.setItem('posts', JSON.stringify(updatedPosts))
  }

  const filteredPosts = posts.filter(post =>
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.username.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const value = {
    posts: filteredPosts,
    allPosts: posts,
    searchTerm,
    setSearchTerm,
    createPost,
    deletePost,
    toggleLike,
    addComment
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}