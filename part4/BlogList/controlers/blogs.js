const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
        console.log(authorization)
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.get('/', async (request, response) => {
    const blog = await Blog.find({}).populate('user', { username: 1, name: 1 })   
    response.json(blog)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = request.user
    if(!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    // if (!body.userId) {
    //     return response.status(400).json({ error: 'userId is required' })
    // }
    console.log(decodedToken.id)
    const user = await User.findById(decodedToken.id)
    if(!user) {
        return response.status(404).json({ error: 'user not found' })
    }


    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id,
    })

    const saveBlog = await blog.save()
    user.blogs = user.blogs.concat(saveBlog._id)
    await user.save()
    response.status(201).json(saveBlog)
})
blogsRouter.delete('/:id', async (request, response) => {
    const decodedToken = request.user
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }
    const blog = await Blog.findById(request.params.id)
    console.log(blog)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    console.log(blog.user)
    if (blog.user === undefined) {
        return response.status(403).json({ error: 'blog not assigned to any user'})
    }
    if (blog.user && blog.user.toString() !== decodedToken.id) {
        return response.status(403).json({ error: 'forbidden: cannot delete another user\'s blog' })
    }

    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})
blogsRouter.put('/:id', async (request, response) => {
    const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.json(blog)
})

module.exports = blogsRouter