import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const Anecdote = ({ anecdote, votes }) => {
  return (
    <div>
      <p>{anecdote}</p>
      <p>has {votes} votes</p>
    </div>
  )
}

/**
 * The main component of the application.
 * Renders the current anecdote, allows voting on anecdotes, and displays the anecdote with the most votes.
 */
const App = () => {
  /**
   * An array of anecdotes.
   */
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  /**
   * The index of the currently selected anecdote.
   */
  const [selected, setSelected] = useState(0)

  /**
   * An array of votes for each anecdote.
   */
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  /**
   * Handles the event when the "Next Anecdote" button is clicked.
   * Selects a random anecdote from the anecdotes array.
   */
  const handleNextAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  /**
   * Handles the event when the "Vote" button is clicked.
   * Increases the vote count for the currently selected anecdote.
   */
  const handleVote = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes)
  }

  /**
   * Returns the anecdote with the most votes.
   * If multiple anecdotes have the same highest vote count, a random one is returned.
   * @returns {string} The anecdote with the most votes.
   */
  const getMaxVotesAnecdote = () => {
    const maxVotes = Math.max(...votes)
    const maxVotesAnecdotes = anecdotes.filter((_, index) => votes[index] === maxVotes)
    const randomIndex = Math.floor(Math.random() * maxVotesAnecdotes.length)
    return maxVotesAnecdotes[randomIndex]
  }

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={handleVote} text="Vote" />
      <Button handleClick={handleNextAnecdote} text="Next Anecdote" />

      <h2>Anecdote with the Most Votes</h2>
      <Anecdote anecdote={getMaxVotesAnecdote()} votes={Math.max(...votes)} />
    </div>
  )
}

export default App