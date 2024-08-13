import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Card, CardContent, Typography } from '@mui/material'

const Blog = ({ blog }) => {
  return (
    <Card sx={{ mb: 2, border: '1px solid', borderColor: 'divider' }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6">
          <Link
            to={`/blogs/${blog.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {blog.title}
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {blog.author}
        </Typography>
      </CardContent>
    </Card>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string,
    likes: PropTypes.number,
    user: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string.isRequired,
      name: PropTypes.string,
    }),
  }).isRequired,
}

export default Blog
