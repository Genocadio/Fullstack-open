/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import phoneservice from './sevices/number'

//componet to handle diltering numbers
const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      Filter: <input onChange={handleFilterChange} value={filter} />
    </div>
  )
}

// Component for addition of new numbers
const PersonForm = ({ addPerson, newName, newNum, handleChange, handleChangenum }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input onChange={handleChange} value={newName}/>
      </div>
      <div>
        number: <input onChange={handleChangenum} value={newNum}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

//Component to dicplay the content and handle deletion of numbers
const Persons = ({ filteredPersons, updateList }) => {

  const handleDelete = (id, name) => {
    const confirmed = window.confirm(`Delete ${name}?`);
    if (confirmed) {
      console.log(`delete ${id}`);
      phoneservice.Delete(id).then(() => {
        updateList(id);
      });
    }
  };

  return (
    <div>
      {filteredPersons.map(person => (
        <p key={person.name}>
          {person.name} {person.number}
          <button key={person.id} onClick={() => handleDelete(person.id, person.name)}>delete</button>
        </p>
      ))}
    </div>
  );
};

//Notification component
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}


//Main component that calls all other components
const App = () => {

  const [persons, setPersons] = useState([]) //added numbers in database
  const [newName, setNewName] = useState('') //new name state from input
  const [newNum, setNewNum] = useState('') //new number state from input
  const [filter, setFilter] = useState('') //new filterstate from input
  const [message, setMessage] = useState('yves') //message state for notification

  // Fetch data from server with effect hook
  const hook = () => {
    phoneservice
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }
  // Effect hook
  useEffect(hook, [])

  const handleChange = (event) => {
    setNewName(event.target.value)
  }

  const handleMessgae = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  //manage subummussion of the form
  const handleSubmit = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      const confirmed = window.confirm(`${newName} is already added to the phonebook. Replace the old number with a new one?`);
      if (confirmed) {
        const updatedPerson = { ...existingPerson, number: newNum }
        phoneservice
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            handleMessgae(`Updated ${returnedPerson.name}`)
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
            setNewName('')
            setNewNum('')
          })
          .catch(error => {
            handleMessgae(`Information of ${existingPerson.name} has already been removed from server`)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }
      return
    }

    // create new person object
    const newPerson = {
      name: newName,
      number: newNum
    }
    phoneservice
      .Add(newPerson)
      .then(returnedPerson => {
        setPersons([...persons, returnedPerson])
        handleMessgae(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNum('')
      })

    setNewName('')
  }

  const handleChangenum = (event) => {
    setNewNum(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const updateList = (id) => {
    const deletedPerson = filteredPersons.find(person => person.id === id)
    handleMessgae(`Deleted ${deletedPerson.name}`)
    setPersons(filteredPersons.filter(person => person.id !== id))
  }

  const filteredPersons = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

    //main app JSX return for rendering
  return (
    <div>
      <Notification message={message} />
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>Add a new</h2>
      <PersonForm
        addPerson={handleSubmit}
        newName={newName}
        newNum={newNum}
        handleChange={handleChange}
        handleChangenum={handleChangenum}
      />

      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} updateList={updateList} />
    </div>
  )
}

export default App