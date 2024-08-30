import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Divider, Paper, Button } from '@mui/material';
import axios from 'axios';
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { Patient, Diagnosis, EntryWithoutId, Entry } from "../types";
import patientService from "../services/patients";
import diagnosisService from "../services/diagonoses";
import EntryDetail from "./EntryDetail";
import AddEntryForm from "./AddEntry";

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [visible, setVisible] = useState<boolean>(false); // Initially hidden

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (id) {
          const fetchedPatient = await patientService.getById(id);
          setPatient(fetchedPatient);
        } else {
          setError("Invalid patient ID");
        }
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          setError(e.response?.data || "An error occurred");
        } else {
          setError("Unknown error");
        }
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const fetchedDiagnoses = await diagnosisService.getAll();
        setDiagnoses(fetchedDiagnoses);
      } catch (e: unknown) {
        console.error(e);
      }
    };

    fetchPatient();
    fetchDiagnoses();
  }, [id]);

  const handleFormAction = async (action: "submit" | "cancel", data?: EntryWithoutId) => {
    if (action === "submit" && id && data) {
      console.log("New form submitted", data);
      try {
        // Add the new entry to the patient's entries
        const newEntry = await patientService.updateEntry(id, data);
        console.log('New entry added:', newEntry);

        // Update the patient's entries state
        setPatient(prevPatient => {
          if (prevPatient) {
            return {
              ...prevPatient,
              entries: [...prevPatient.entries, newEntry as Entry]
            };
          }
          return prevPatient;
        });
      } catch (error) {
        console.error("Failed to add entry:", error);
      }
    }
    // Hide the form after submission or cancellation
    setVisible(false);
  };

  if (error) return <div>Error: {error}</div>;
  if (!patient) return <div>Loading...</div>;

  const renderGenderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      case "other":
      default:
        return <TransgenderIcon />;
    }
  };

  return (
    <Paper style={{ padding: '1em' }}>
      <Typography variant="h4">{patient.name}</Typography>
      <Divider style={{ margin: '0.5em 0' }} />
      <Typography>Date of Birth: {patient.dateOfBirth}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Gender: {renderGenderIcon(patient.gender)}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>

      <Typography variant="h5" style={{ marginTop: '1em' }}>Entries</Typography>
      {patient.entries.length === 0 ? (
        <Typography>No entries</Typography>
      ) : (
        patient.entries.map(entry => (
          <div key={entry.id} style={{ marginBottom: '1em' }}>
            <EntryDetail entry={entry} diagnoses={diagnoses} />
          </div>
        ))
      )}
      {!visible && (<Button
        variant="contained"
        color="primary"
        style={{ marginTop: '1em' }}
        onClick={() => setVisible(!visible)} // Toggle visibility
      >
        {visible ? "Cancel Entry" : "Add Entry"}
      </Button>)}
      {visible && (
        <AddEntryForm
          onSubmit={(data) => handleFormAction("submit", data)}
          onCancel={() => handleFormAction("cancel")}
        />
      )}
    </Paper>
  );
};

export default PatientDetailPage;
