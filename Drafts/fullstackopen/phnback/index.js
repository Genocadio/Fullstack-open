const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3001;
const cors = require('cors');

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0;
  return maxId + 1;
}

app.use(express.json());
app.use(morgan('common'));
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const date = new Date();
  res.send(`<p>Phonebook has info for ${persons.length} people</p> <br /> <p>${date}</p>`);
});


app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if(person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
}
);

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id)
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing'
    });
  }

  const existingPerson = persons.find(person => person.name === body.name);
  if (existingPerson) {
    return res.status(400).json({
      error: 'name must be unique'
    });
  }

  const person  = {
    id: generateId(),
    name: body.name,
    number: body.number
  };
  console.log(person);
  persons = persons.concat(person);
  res.json(person);
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
}
);