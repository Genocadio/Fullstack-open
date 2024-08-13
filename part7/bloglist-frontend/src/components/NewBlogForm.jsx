import React, { useState } from 'react'
import { Button, TextField, Typography, Paper, Box } from '@mui/material'

const NewBlogForm = ({ handleNewBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url,
      likes: Number(likes) || 0, // Ensure likes is a number, defaulting to 0
    }

    handleNewBlog(newBlog)
    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }

  return (
    <Paper sx={{ padding: 3, maxWidth: 600, margin: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Create New Blog
      </Typography>
      <form onSubmit={addBlog}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Author"
            variant="outlined"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter author"
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            required
          />
        </Box>
        <Button type="submit" variant="contained" color="primary">
          Create Blog
        </Button>
      </form>
    </Paper>
  )
}

export default NewBlogForm
