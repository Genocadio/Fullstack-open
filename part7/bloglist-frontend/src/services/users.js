// services/users.js
import axios from 'axios'
const baseUrl = 'http://localhost:3001' // Adjust the URL as per your backend

const getAll = async () => {
  const response = await axios.get(`${baseUrl}/api/users`)
  return response.data
}

export default { getAll }
