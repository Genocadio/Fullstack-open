import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onUpdate, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false)
  const currentUser = JSON.parse(window.localStorage.getItem('loggedBlogappUser') || '{}');
  const isUserBlogOwner = blog.user.username === currentUser.username; // Using username for comparison
  
  const toggleDetails = () => {
    console.log('toggleDetails:', blog, currentUser)
    setShowDetails(!showDetails)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id ? blog.user.id : blog.user,
    }
    console.log('update', updatedBlog)

    onUpdate(blog.id, updatedBlog) // Call the onUpdate function to update the parent component
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onDelete(blog.id)
    }
  }
  
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const buttonStyle = {
    backgroundColor: 'blue',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  }

  return (
    <div style={blogStyle}>
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{showDetails ? 'Hide' : 'View'}</button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p data-testid='likes'>
            <span id="likes-count">{blog.likes} likes</span> 
            <button data-testid='likebutton' onClick={handleLike}>Like</button>
          </p>
          <p>{blog.user.username}</p>
          {isUserBlogOwner && (
            <button data-testid='delete' style={buttonStyle} onClick={handleDelete}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string.isRequired,
      name: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default Blog
