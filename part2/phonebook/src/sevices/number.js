import axios from "axios";
//Module to handle axios server communication

const ph_url = "http://localhost:3001/persons";

//Function got https GET
const getphoneNumbers = () => {
  const request = axios.get(ph_url);
  console.log(request);
  return request.then((response) => response.data)};

//Function for https Post to add new number
const AddPhone = (person) => {
  const request = axios.post(ph_url, person);
  return request.then((response) => response.data)};

//Funtion for http delete
const DeletePhone = (id) => {
  const request = axios.delete(`${ph_url}/${id}`);
  return request.then((response) => response.data)};

//Function for http put method
const UpdatePhone = (id, phone) => {
  const request = axios.put(`${ph_url}/${id}`, phone);
  return request.then((response) => response.data)};



  export default {getAll: getphoneNumbers,
                  Add: AddPhone,
                Delete: DeletePhone,
              update: UpdatePhone,}