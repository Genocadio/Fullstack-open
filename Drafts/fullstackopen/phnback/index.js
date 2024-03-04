const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()// module to use .env file in my data
const port = process.env.PORT
const Person = require('./models/person') // import the person model for database
const cors = require('cors') // module to allow cross-origin requests
// eslint-disable-next-line no-unused-vars
const req = require('express/lib/request')

app.use(express.json())
morgan.token('mBody', (req) => JSON.stringify(req.body)
)
app.use(morgan(':method :url :res[content-length] - :response-time ms :mBody')) // use morgan to log the request
app.use(cors())
app.use(express.static('dist'))

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message })
    }
    next(error)
}

app.get('/api/persons', (req, res) => {
    // get all persons from the database MongoDB
    Person.find({}).then(result => {
        res.json(result)
    })
})

app.get('/info', async (req, res) => {
    const personCount = await Person.countDocuments({})
    const date = new Date()
    res.send(`<p>Phonebook has info for ${personCount} people</p> <br /> <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            if (result) {
                res.json(result)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'Name or number is missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
}
)


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
