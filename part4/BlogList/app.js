const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const blogsRouter = require('./controlers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require ('./utils/middleware')

mongoose.set('strictQuery', false)

logger.info('connecting to: ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
.then(() => {
  logger.info('connected to MongoDB')
})
.catch((error) => {
  logger.error('error connecting to MOngoDB: ', error.message)
})

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(middleware.unkownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
