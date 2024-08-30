import axios from "axios";
import { Patient, PatientFormValues,  EntryWithoutId } from "../types";
import { apiBaseUrl } from "../constants";

// Fetch all patients
const getAll = async (): Promise<Patient[]> => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
  return data;
};

// Create a new patient
const create = async (object: PatientFormValues): Promise<Patient> => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);
  return data;
};

// Fetch a patient by ID
const getById = async (id: string): Promise<Patient> => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

// Fetch an entry by patient ID and entry ID
const getEntryById = async (patientId: string, entryId: string) => {
  const { data } = await axios.get(`${apiBaseUrl}/patients/${patientId}/entries/${entryId}`);
  return data;
};
// Update an entry by user ID and entry ID
const updateEntry = async (userId: string,  entryData: EntryWithoutId) => {
  try {
    const { data } = await axios.post(`${apiBaseUrl}/patients/${userId}/entries`, entryData);
    console.log("Update Response:", data);
    return data;
  } catch (error) {
    console.error("Error updating entry:", error);
    throw error; // Re-throw the error after logging it
  }
};


export default {
  getAll,
  create,
  getById,
  getEntryById,
  updateEntry
};
