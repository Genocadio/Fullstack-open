import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NewBlogForm from './components/NewBlogForm'

const Notification = ({ message, type }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000) // Notification hides after 5 seconds (5000 milliseconds)

      return () => clearTimeout(timer) // Clean up timer on unmount or message change
    }
  }, [message])

  if (!isVisible) {
    return null
  }

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }

  return <div style={notificationStyle}>{message}</div>
}

const BlogList = ({ blogs, handleLogout, onUpdate, username, onDelete }) => (
  <div>
    <h2>Blogs</h2>
    <p>
      {username} logged in
      <button onClick={handleLogout}> Logout</button>
    </p>
    {blogs.map((blog) => (
      <Blog key={blog.id} blog={blog} onUpdate={onUpdate} onDelete={onDelete} />
    ))}
  </div>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const BlogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token) // Set token in blogService
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs))
    }
  }, [user])

  const handleLogin = async (userData) => {
    setUser(userData)
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
      setMessage(`Logged in as ${user.username}`)
      setMessageType('success')
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password')
      setMessageType('error')

      console.error('Login error:', exception)
      // Optionally handle and display login error
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null) // Clear token in blogService
    window.localStorage.removeItem('loggedBlogappUser')
    setMessage('You have been logged out')
    setMessageType('success')
    BlogFormRef.current.toggleVisibility()
  }
  const handleNewBlog = async (newBlog) => {
    try {
      BlogFormRef.current.toggleVisibility()
      const createdBlog = await blogService.create(newBlog)
      setMessage(`A new blog ${newBlog.title} by ${newBlog.author} added`)
      setMessageType('success')
      console.log('added:', createdBlog)
      setBlogs([...blogs, createdBlog])
    } catch (error) {
      setMessage(`Error adding blog: ${error.message}`)
      setMessageType('error')
      console.error('Error adding blog:', error)
      // Optionally handle and display error
    }
  }

  const handleUpdate = async (id, updatedBlog) => {
    try {
      // blogService.setToken(user.token)
      const response = await blogService.update(id, updatedBlog)
      setBlogs(
        blogs.map((blog) => (blog.id === response.id ? response : blog))
      )
    } catch (error) {
      console.error('Error updating the blog:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id) // Call the service to delete the blog
      setBlogs(blogs.filter((blog) => blog.id !== id)) // Remove the blog from the state
      setMessage('Blog deleted')
      setMessageType('success')
    } catch (error) {
      setMessage('Error deleting blog')
      setMessageType('error')
      console.error('Error deleting blog:', error)
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <Notification message={message} type={messageType} />
      {!user ? (
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleFormSubmit}
          />
        </Togglable>
      ) : (
        <>
          <BlogList
            blogs={sortedBlogs}
            handleLogout={handleLogout}
            onUpdate={handleUpdate}
            username={user.username}
            onDelete={handleDelete}
          />
          <Togglable buttonLabel='add blog' ref={BlogFormRef}>
            <NewBlogForm handleNewBlog={handleNewBlog} />
          </Togglable>
        </>
      )}
    </div>
  )
}

export default App
