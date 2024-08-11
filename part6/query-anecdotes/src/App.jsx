import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient, QueryCache } from '@tanstack/react-query'
import AnecServices from './services/AnecServices'
import {useContext } from 'react'
import NotificationContext from './NotiContext'


const App = () => {
  const queryClient = useQueryClient();
  const {notification, dispatch} = useContext(NotificationContext)

  const { data, error, isLoading, isError, status } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: AnecServices.getAll,
  });

  const voteMutation = useMutation({
    mutationFn: (updatedAnecdote) => AnecServices.updateVote(updatedAnecdote.id, updatedAnecdote),
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes']);
      
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote =>
        anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      ));
      dispatch({ type: 'SET_NOTIFICATION', payload: `Voted on '${updatedAnecdote.content}'` });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    },
  });
  
  const handleVote = (anecdote) => {
    const updatedAnecdote = { 
      ...anecdote, 
      votes: anecdote.votes + 1 
    };
    voteMutation.mutate(updatedAnecdote);
  };

  // Log specific properties
  console.log('Status:', status);
  console.log('Data:', data);
  console.log('Error:', error);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }
  let anecdotes = []
  if (data.length > 0) {
    anecdotes = data
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
    
  )
}

export default App
