import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  Box,
} from '@mui/material'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NewBlogForm from './components/NewBlogForm'
import { showNotification } from './redux/notificationReducer'
import {
  createBlog,
  initializeBlogs,
  removeBlog,
  updateBlog,
  updateBlogDetails,
} from './redux/blogsReducer'
import { clearUser, setUser } from './redux/userReducer'
import BlogList from './BlogList'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useSelector((state) => state.user)
  const notification = useSelector((state) => state.notification)

  const BlogFormRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token) // Set token in blogService
    }
  }, [dispatch])

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs())
    }
  }, [dispatch, user])

  const handleLogin = async (userData) => {
    dispatch(setUser(userData))
    blogService.setToken(userData.token) // Set token in blogService
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(userData))
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await blogService.login({
        username,
        password,
      })
      handleLogin(user)
      dispatch(showNotification(`Logged in as ${user.username}`, 'success'))
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch(showNotification('Wrong username or password', 'error'))
      console.error('Login error:', exception)
    }
  }

  const handleNewBlog = async (newBlog) => {
    BlogFormRef.current.toggleVisibility()
    dispatch(createBlog(newBlog))
  }

  const handleUpdate = async (id, updatedBlog) => {
    dispatch(updateBlogDetails(id, updatedBlog))
  }

  const handleDelete = async (id) => {
    dispatch(removeBlog(id))
  }

  return (
    <Container>
      <Typography variant="h2" gutterBottom>
        Blogs
      </Typography>
      {notification.message && (
        <Snackbar
          open={!!notification.message}
          autoHideDuration={6000}
          onClose={() => dispatch(showNotification(''))}
        >
          <Alert
            onClose={() => dispatch(showNotification(''))}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
      {!user ? (
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleFormSubmit}
        />
      ) : (
        <Box>
          <BlogList onUpdate={handleUpdate} onDelete={handleDelete} />
          <Togglable buttonLabel="Create New Blog" ref={BlogFormRef}>
            <NewBlogForm handleNewBlog={handleNewBlog} />
          </Togglable>
        </Box>
      )}
    </Container>
  )
}

export default App
