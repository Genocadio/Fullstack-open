// services/diagnosis.ts
import axios from "axios";
import { Diagnosis } from "../types";
import { apiBaseUrl } from "../constants";

const getAll = async (): Promise<Diagnosis[]> => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`); // Correct endpoint for diagnoses
  return data;
};

// Note: `create` and `getById` are not typically used for diagnoses, but if needed, implement them as well.
// For example:
// const create = async (object: Diagnosis): Promise<Diagnosis> => {
//   const { data } = await axios.post<Diagnosis>(`${apiBaseUrl}/diagnoses`, object);
//   return data;
// };

// const getById = async (id: string): Promise<Diagnosis> => {
//   const { data } = await axios.get<Diagnosis>(`${apiBaseUrl}/diagnoses/${id}`);
//   return data;
// };

export default {
  getAll,
  // create,
  // getById
};
