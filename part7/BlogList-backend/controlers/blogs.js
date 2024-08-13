const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// Middleware to extract token
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

// Fetch all blogs
blogsRouter.get('/', async (request, response) => {
    const blog = await Blog.find({}).populate('user', { username: 1, name: 1 })   
    response.json(blog)
})

// Create a new blog
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = request.user
    if (decodedToken === null || decodedToken === undefined || !decodedToken.id) {
        return response.status(401).json({ error: 'Unauthorized' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(404).json({ error: 'user not found' })
    }

    const blog = new Blog({
        url: body.url,
        title: body.title,
        author: body.author,
        likes: body.likes,
        user: user.id,
    })

    const saveBlog = await blog.save()
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()
    const populatedBlog = await Blog.findById(saveBlog._id).populate('user', { username: 1, id: 1 })
    response.status(201).json(populatedBlog)
})

// Delete a blog
blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = request.user
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    if (blog.user === undefined) {
        return response.status(403).json({ error: 'blog not assigned to any user'})
    }
    if (blog.user && blog.user.toString() !== decodedToken.id) {
        return response.status(403).json({ error: 'forbidden: cannot delete another user\'s blog' })
    }

    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

// Update a blog
blogsRouter.put('/:id', async (request, response, next) => {
    const body = request.body
    const decodedToken = request.user
    if (decodedToken === null || decodedToken === undefined || !decodedToken.id) {
        return response.status(401).json({ error: 'Unauthorized' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
        return response.status(404).json({ error: 'user not found' })
    }

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        const populatedBlog = await Blog.findById(updatedBlog._id).populate('user', { username: 1, id: 1 })
        response.json(populatedBlog)
    } catch (error) {
        next(error)
    }
})

// Add a comment to a blog
blogsRouter.post('/:id/comments', async (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({ error: 'Content is required' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'Blog not found' })
    }

    blog.comments = blog.comments.concat({
        content: body.content
    })

    const updatedBlog = await blog.save()
    const populatedBlog = await Blog.findById(updatedBlog._id).populate('user', { username: 1, id: 1 })
    response.json(populatedBlog)
})

module.exports = blogsRouter
