import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { initializeUsers } from './redux/usersReducer'
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'

const UserDetail = () => {
  const { id } = useParams() // Get the user ID from the URL parameters
  const dispatch = useDispatch()
  const users = useSelector((state) => state.users)
  const user = users.find((user) => user.id === id)

  useEffect(() => {
    if (users.length === 0) {
      dispatch(initializeUsers()) // Fetch users if they are not already in the store
    }
  }, [dispatch, users.length])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {user.username}'s Blogs
      </Typography>
      <Paper sx={{ padding: 2 }}>
        {user.blogs.length > 0 ? (
          <List>
            {user.blogs.map((blog) => (
              <ListItem key={blog.id}>
                <ListItemText primary={blog.title} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">No blogs available</Typography>
        )}
      </Paper>
    </Box>
  )
}

export default UserDetail
