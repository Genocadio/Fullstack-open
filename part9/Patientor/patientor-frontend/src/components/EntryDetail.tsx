import React from 'react';
import { Typography, Divider } from '@mui/material';
import { Entry as EntryType, Diagnosis } from '../types';
import {
  LocalHospital as HospitalIcon,
  Work as OccupationalHealthcareIcon,
  MedicalServices as HealthCheckIcon
} from '@mui/icons-material';

interface EntryDetailProps {
  entry: EntryType;
  diagnoses: Diagnosis[];
}

const EntryDetail: React.FC<EntryDetailProps> = ({ entry, diagnoses }) => {
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
    <div>
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
    </div>
  );
};

export default EntryDetail;
