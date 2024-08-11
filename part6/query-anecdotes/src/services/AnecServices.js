import axios from "axios";

const baseurl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
    const response = await axios.get(baseurl)
    return response.data
}

const createNew = async (content) => {
    try {
      const resp = await axios.post(baseurl, content);
      return resp.data;
    } catch (error) {
      console.error('Error creating new anecdote:', error);
      throw error; // Rethrow the error to handle it where the function is called
    }
  };

const updateVote = async (id, updatedAnecdote) => {
  try {
    const response = await axios.put(`${baseurl}/${id}`, updatedAnecdote);
    return response.data;
  } catch (error) {
    console.error('Error updating vote:', error);
    throw error;
  }
};

export default { getAll, createNew, updateVote}