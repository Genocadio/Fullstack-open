import React, { useState } from 'react'

const Blog = ({ blog, onUpdate, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
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
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleDetails}>{showDetails ? 'Hide' : 'View'}</button>
      </div>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes <button onClick={handleLike}>Like</button>
          </p>
          <p>{blog.user.username}</p>
          <button style={buttonStyle} onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog
