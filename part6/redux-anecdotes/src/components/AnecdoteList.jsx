import { useSelector, useDispatch } from 'react-redux';
import { voteAnecdote, voteForAnecdotes } from '../reducers/anecdoteReducer'; // Adjust path if necessary
import { setNotification, clearNotification } from '../reducers/notificationReducer';
const AnecdoteList = () => {
    const { anecdotes, filter } = useSelector(state => ({
        anecdotes: state.anecdotes,
        filter: state.filter
    }));
    
    // Filter anecdotes based on filter value
    const filteredAnecdotes = filter 
        ? anecdotes.filter(anecdote => 
            anecdote.content.toLowerCase().includes(filter.toLowerCase())
          )
        : anecdotes;

    // Sort filtered anecdotes by votes in descending order
    const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes);

    const dispatch = useDispatch();

    const handleVote = (id) => {
        const anecdoteToVote = anecdotes.find(a => a.id === id);
        dispatch(voteForAnecdotes(id, anecdoteToVote)); // Ensure id is passed correctly
        dispatch(setNotification(`You voted for the anecdote: "${anecdotes.find(a => a.id === id).content}"`, 10));
    };

    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes} votes
                        <button onClick={() => handleVote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnecdoteList;
