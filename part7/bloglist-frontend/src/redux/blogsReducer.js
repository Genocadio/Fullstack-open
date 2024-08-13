import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    addBlog(state, action) {
      state.push(action.payload)
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload
      return state.map((blog) =>
        blog.id === updatedBlog.id ? updatedBlog : blog
      )
    },
    deleteBlog(state, action) {
      const id = action.payload
      return state.filter((blog) => blog.id !== id)
    },
    addComment(state, action) {
      const { blogId, comment } = action.payload
      return state.map((blog) =>
        blog.id === blogId
          ? { ...blog, comments: blog.comments.concat(comment) }
          : blog
      )
    },
  },
})

export const { setBlogs, addBlog, updateBlog, deleteBlog, addComment } =
  blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      dispatch(addBlog(createdBlog))
      dispatch(
        showNotification(
          `A new blog ${newBlog.title} by ${newBlog.author} added`,
          'success'
        )
      )
    } catch (error) {
      dispatch(showNotification(`Error adding blog: ${error.message}`, 'error'))
    }
  }
}

export const updateBlogDetails = (id, updatedBlog) => {
  return async (dispatch) => {
    try {
      const response = await blogService.update(id, updatedBlog)
      dispatch(updateBlog(response))
    } catch (error) {
      dispatch(
        showNotification(`Error updating blog: ${error.message}`, 'error')
      )
    }
  }
}

export const removeBlog = (id) => {
  return async (dispatch) => {
    try {
      await blogService.remove(id)
      dispatch(deleteBlog(id))
      dispatch(showNotification('Blog deleted', 'success'))
    } catch (error) {
      dispatch(showNotification('Error deleting blog', 'error'))
    }
  }
}

export const addBlogComment = (blogId, comment) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.addComment(blogId, comment)
      // dispatch(updateBlog(response))
      const addedComment = updatedBlog.comments[updatedBlog.comments.length - 1]
      console.log(updatedBlog)
      dispatch(addComment({ blogId, comment: addedComment }))
      dispatch(showNotification(`Comment added`, 'success'))
    } catch (error) {
      dispatch(
        showNotification(`Error adding comment: ${error.message}`, 'error')
      )
    }
  }
}

export default blogsSlice.reducer
