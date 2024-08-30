import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Typography, Divider, Paper } from "@mui/material";
import { Diagnosis } from "../types";
import diagnosisService from "../services/diagonoses";
import { Entry as EntryType } from "../types";
import {
  LocalHospital as HospitalIcon,
  Work as OccupationalHealthcareIcon,
  MedicalServices as HealthCheckIcon
} from "@mui/icons-material";

const EntryDetailPage = () => {
  const { patientId, entryId } = useParams<{ patientId: string; entryId: string }>();
  const [entry, setEntry] = useState<EntryType | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!patientId || !entryId) {
      setError("Invalid parameters");
      return;
    }

    const fetchEntry = async () => {
      try {
        // Fetch entry details using both patientId and entryId
        const response = await fetch(`http://localhost:3001/api/patients/${patientId}/entries/${entryId}`);
        const fetchedEntry = await response.json();
        setEntry(fetchedEntry);
      } catch (e) {
        setError("Failed to fetch entry details");
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const fetchedDiagnoses = await diagnosisService.getAll();
        setDiagnoses(fetchedDiagnoses);
      } catch (e) {
        setError("Failed to fetch diagnoses");
      }
    };

    fetchEntry();
    fetchDiagnoses();
  }, [patientId, entryId]);

  if (error) return <div>Error: {error}</div>;
  if (!entry) return <div>Loading...</div>;

  const getDiagnosesNames = (codes: string[]): string[] => {
    return codes.map(code => {
      const diagnosis = diagnoses.find(d => d.code === code);
      return diagnosis ? diagnosis.name : "Unknown diagnosis";
    });
  };

  const renderEntryTypeIcon = (type: string) => {
    switch (type) {
      case "Hospital":
        return <HospitalIcon />;
      case "OccupationalHealthcare":
        return <OccupationalHealthcareIcon />;
      case "HealthCheck":
        return <HealthCheckIcon />;
      default:
        return null;
    }
  };

  return (
    <Paper style={{ padding: '1em' }}>
      <Typography variant="h5">{renderEntryTypeIcon(entry.type)} {entry.date}</Typography>
      <Typography variant="h6">Type: {entry.type}</Typography>
      <Typography variant="body1">Specialist: {entry.specialist}</Typography>
      <Typography variant="body1">Description: {entry.description}</Typography>
      <Typography variant="body1">Diagnoses: {getDiagnosesNames(entry.diagnosisCodes || []).join(', ')}</Typography>
      {entry.type === "Hospital" && (
        <>
          <Typography variant="body1">Discharge Date: {entry.discharge?.date}</Typography>
          <Typography variant="body1">Discharge Criteria: {entry.discharge?.criteria}</Typography>
        </>
      )}
      {entry.type === "OccupationalHealthcare" && (
        <Typography variant="body1">Employer: {entry.employerName}</Typography>
      )}
      <Divider style={{ margin: '0.5em 0' }} />
    </Paper>
  );
};

export default EntryDetailPage;
