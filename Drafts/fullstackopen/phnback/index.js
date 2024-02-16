const express = require('express');
const morgan = require('morgan');
const app = express();
require('dotenv').config();// module to use .env file in my data
const port = process.env.PORT;
const Person = require('./models/person'); // import the person model for database
const cors = require('cors'); // module to allow cross-origin requests

app.use(express.json());
app.use(morgan('common')); // use morgan to log the request
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (req, res) => {
  // get all persons from the database MongoDB
  Person.find({}).then(result => {
    res.json(result);
  });
});

app.get('/info', async (req, res) => {
  const personCount = await Person.countDocuments({});
  const date = new Date();
  res.send(`<p>Phonebook has info for ${personCount} people</p> <br /> <p>${date}</p>`);
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
