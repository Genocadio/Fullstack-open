const { request, response } = require('../app')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('path: ', request.path)
    logger.info('body: ', request.body)
    logger.info('.........')
    next()
}

const unkownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }

  module.exports = {
    requestLogger,
    unkownEndpoint,
    errorHandler
  }