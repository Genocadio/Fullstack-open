import { useDispatch } from 'react-redux';
import { createAnecdote } from '../reducers/anecdoteReducer';  // Make sure this matches your file structure
import anecdotes from '../services/anecdotesService';

const AnecdoteForm = () => {
    const dispatch = useDispatch();

    const addNewAnecdote = async (event) => {
        event.preventDefault();
        const content = event.target.anecdote.value;
        event.target.anecdote.value = '';

        // Create an anecdote object with content and default votes
        const newAnecdote = {
            content,
            id: String(Date.now() + Math.random()), // Generate unique ID for the anecdote
            votes: 0
        };

        dispatch(createAnecdote(newAnecdote));
    };

    return (
        <div>
            <h2>Create New</h2>
            <form onSubmit={addNewAnecdote}>
                <div><input name="anecdote" /></div>
                <button type="submit">create</button>
            </form>
        </div>
    );
};

export default AnecdoteForm;
