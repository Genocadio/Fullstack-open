import AnecServices from "../services/AnecServices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react";
import NotificationContext from "../NotiContext";

const AnecdoteForm = () => {
  const { dispatch } = useContext(NotificationContext);
  const queryClient = useQueryClient()
  const newMut = useMutation({ 
    mutationFn: AnecServices.createNew,
    onSuccess: (newan) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueriesData(['anecdotes'], anecdotes.concat(newan))
    },
    onError: (error) => {
      dispatch({ type: 'SET_NOTIFICATION', payload: `${error.response.data.error}` });
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' });
      }, 5000);
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newMut.mutate({content: content,
      votes: 0
    })
    console.log('new anecdote')
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
