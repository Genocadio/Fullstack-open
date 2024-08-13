import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from './redux/userReducer'
import { showNotification } from './redux/notificationReducer'
import { useNavigate, Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import blogService from './services/blogs'

const Notification = () => {
  const dispatch = useDispatch()
  const notification = useSelector((state) => state.notification)

  return (
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
  )
}

const Navigation = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token) // Set token in blogService
    }
  }, [dispatch])

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleLogout = () => {
    dispatch(clearUser())
    blogService.setToken(null) // Clear token in blogService
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(showNotification('You have been logged out', 'success'))
    navigate('/')
  }

  if (!user) {
    return null // Optionally return null or a loading spinner while redirecting
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Home
            </Link>
          </Typography>
          <Button color="inherit" component={Link} to="/users">
            Users
          </Button>
          <Button color="inherit" component={Link} to="/blogs">
            Blogs
          </Button>
          <Typography
            variant="body1"
            sx={{ marginLeft: 'auto', marginRight: 2 }}
          >
            {user.username} logged in
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Notification />
    </>
  )
}

export default Navigation
