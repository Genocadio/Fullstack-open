import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeBlogs,
  updateBlogDetails,
  removeBlog,
  addBlogComment,
} from './redux/blogsReducer'
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material'

const BlogDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [newComment, setNewComment] = useState('')

  const blog = useSelector((state) =>
    state.blogs.find((blog) => blog.id === id)
  )

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  const handleLike = () => {
    if (blog) {
      const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
      }
      dispatch(updateBlogDetails(blog.id, updatedBlog))
    }
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(removeBlog(blog.id))
      navigate('/')
    }
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    if (newComment.trim()) {
      dispatch(addBlogComment(blog.id, newComment))
      setNewComment('')
    }
  }

  if (!blog) {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {blog.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            <a href={blog.url} target="_blank" rel="noopener noreferrer">
              {blog.url}
            </a>
          </Typography>
          <Typography variant="body1">
            {blog.likes} likes
            <Button
              variant="contained"
              color="primary"
              onClick={handleLike}
              sx={{ marginLeft: 2 }}
            >
              Like
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleRemove}
              sx={{ marginLeft: 2 }}
            >
              Remove
            </Button>
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Added by: {blog.user.username}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ marginTop: 3 }}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Add a Comment
          </Typography>
          <form onSubmit={handleAddComment}>
            <TextField
              fullWidth
              variant="outlined"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Add Comment
            </Button>
          </form>
        </Paper>
        <List>
          {blog.comments.map((comment, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={<strong>{comment.author}</strong>}
                secondary={comment.content}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default BlogDetail
