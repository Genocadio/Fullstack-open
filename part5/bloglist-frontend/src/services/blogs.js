import axios from 'axios'

const baseUrl = 'http://localhost:3001'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(`${baseUrl}/api/blogs`)
  return request.then(response => response.data)
}

const login = async (credentials) => {
  try {
    const response = await axios.post(`${baseUrl}/api/login`, credentials)
    return response.data
  } catch (error) {
    throw new Error('Login failed') // You can customize the error handling as needed
  }
}

const create = async newObj => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(`${baseUrl}/api/blogs`, newObj, config)
  return response.data
}

const update = async (id, updatedObj) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/api/blogs/${id}`, updatedObj, config)
  return response.data
}

const remove = async id => {
  const config = { headers: { Authorization: token } }
  await axios.delete(`${baseUrl}/api/blogs/${id}`, config)
}

const blogService = {
  getAll,
  login,
  setToken,
  create,
  update,
  remove,
}

export default blogService
