import axios from "axios";
//Module to handle axios server communication

const ph_url = "http://localhost:3001/api/persons";

//Function got https GET
const getphoneNumbers = () => {
  const request = axios.get(ph_url);
  console.log(request);
  return request.then((response) => response.data)
  .catch(error => {
    throw error;
    });
};

//Function for https Post to add new number
const AddPhone = (person) => {
  const request = axios.post(ph_url, person);
  return request.then((response) => response.data)
  .catch(error => {
    console.log("error", error);
    throw error;
    });
  };

//Funtion for http delete
const DeletePhone = (id) => {
  const request = axios.delete(`${ph_url}/${id}`);
  return request.then((response) => response.data)
  .catch(error => {
    throw error;
    });
  };

//Function for http put method
const UpdatePhone = (id, phone) => {
  const request = axios.put(`${ph_url}/${id}`, phone);
  return request.then((response) => response.data)
  .catch(error => {
    throw error;
    });
  };



  export default {getAll: getphoneNumbers,
                  Add: AddPhone,
                Delete: DeletePhone,
              update: UpdatePhone,}