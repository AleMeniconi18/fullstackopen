import axios from "axios";
const baseUrl = "http://localhost:3001/persons";

const getAll = async () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const uploadPerson = async (body) => {
  const request = axios.post(baseUrl, body);
  const response = await request;
  return response.data;
};

const deletePerson = async (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, uploadPerson, deletePerson };
