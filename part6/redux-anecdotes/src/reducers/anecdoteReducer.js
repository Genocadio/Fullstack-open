import { createSlice } from "@reduxjs/toolkit";
import anecdotesService from "../services/anecdotesService";


// Initial anecdotes
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

// Generate unique ID
const getId = () => (100000 * Math.random()).toFixed(0);

// Convert string to anecdote object
const asObject = (anecdote) => ({
  content: anecdote,
  id: getId(),
  votes: 0
});

// Initial state
const initialState = anecdotesAtStart.map(asObject);

// Create the slice
const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload; // Expecting payload to be just the id
      const anecdoteToChange = state.find(a => a.id === id);
      if (anecdoteToChange) {
        anecdoteToChange.votes++;
      }
    },
    addAnecdote(state, action) {
      state.push(action.payload); // Expecting payload to be an anecdote object
    },
    setAnecdotes(state, action) {
      return action.payload; // Overwrite state with the new array of anecdotes
    }
  }
});

export const intializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(content);
    dispatch(addAnecdote(newAnecdote));
  };
};

export const voteForAnecdotes = (id, anecd) => {
  return async dispatch => {
    const updatedAnecdote = { ...anecd, votes: anecd.votes + 1}
    const returnedAnecdote = await anecdotesService.updateVote(id, updatedAnecdote);
    dispatch(voteAnecdote(returnedAnecdote.id));
  };
}

// Export actions and reducer
export const { voteAnecdote, addAnecdote, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
