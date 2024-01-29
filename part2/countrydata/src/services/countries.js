import axios from "axios"

//Api for getting all countries
const base_url = "https://studies.cs.helsinki.fi/restcountries/api/all"

const getAll = () => {  
  const request = axios.get(base_url)
  return request.then(response => response.data)
}

export default { getAll: getAll }
