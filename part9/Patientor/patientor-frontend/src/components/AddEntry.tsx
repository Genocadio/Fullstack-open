import React, { useState, useEffect } from 'react';
import { EntryWithoutId, HealthCheckEntry, OccupationalHealthcareEntry, HospitalEntry, Diagnosis } from "../types";
import diagonoses from '../services/diagonoses';
import { TextField, Select, MenuItem, Button, Grid, Box, Typography, CircularProgress, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

// Define an enum for entry types
enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital"
}

interface AddEntryFormProps {
  onSubmit: (data: EntryWithoutId) => void;
  onCancel: () => void;
}

// Create a union type for the form state
type FormState = Omit<HealthCheckEntry, 'id'> | Omit<OccupationalHealthcareEntry, 'id'> | Omit<HospitalEntry, 'id'>;

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onSubmit, onCancel }) => {
  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);
  const [entry, setEntry] = useState<FormState>({
    date: '',
    type: EntryType.HealthCheck,
    specialist: '',
    description: '',
    healthCheckRating: 0,
    employerName: '',
    sickLeave: {
      startDate: '',
      endDate: ''
    },
    discharge: {
      date: '',
      criteria: ''
    },
    diagnosisCodes: [] // Initialize the diagnosisCodes field
  } as FormState);

  const [diagnosisOptions, setDiagnosisOptions] = useState<Diagnosis[]>([]); // Options for diagnosis codes
  const [selectedDiagnosisCode, setSelectedDiagnosisCode] = useState<string>(''); // Selected diagnosis code
  const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching diagnoses
  const [error, setError] = useState<string | null>(null); // Error state for fetching diagnoses

  // Fetch diagnoses options when component mounts
  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const diagnoses = await diagonoses.getAll();
        setDiagnosisOptions(diagnoses);
      } catch (err) {
        setError('Failed to load diagnoses.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnoses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEntry(prevEntry => ({
      ...prevEntry,
      [name]: name === 'healthCheckRating' ? Number(value) : value
    }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, nestedField: string) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;
    const [outerKey, innerKey] = nestedField.split('.');

    setEntry(prevEntry => {
      const outerEntry = prevEntry[outerKey as keyof FormState];

      if (typeof outerEntry === 'object' && outerEntry !== null && !Array.isArray(outerEntry)) {
        const updatedOuterEntry = {
          ...(outerEntry as Record<string, unknown>),
          [innerKey]: value
        };

        return {
          ...prevEntry,
          [outerKey]: updatedOuterEntry
        };
      } else {
        return {
          ...prevEntry,
          [outerKey]: {
            [innerKey]: value
          }
        };
      }
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<EntryType>) => {
    const newType = e.target.value as EntryType;

    setEntryType(newType);

    setEntry(prevEntry => {
      switch (newType) {
        case EntryType.HealthCheck:
          return {
            date: prevEntry.date || '',
            type: newType,
            specialist: prevEntry.specialist || '',
            description: prevEntry.description || '',
            healthCheckRating: 'healthCheckRating' in prevEntry ? (prevEntry as HealthCheckEntry).healthCheckRating : 0,
            diagnosisCodes: prevEntry.diagnosisCodes || [] // Ensure diagnosisCodes is preserved
          } as HealthCheckEntry;

        case EntryType.OccupationalHealthcare:
          return {
            date: prevEntry.date || '',
            type: newType,
            specialist: prevEntry.specialist || '',
            description: prevEntry.description || '',
            employerName: 'employerName' in prevEntry ? (prevEntry as OccupationalHealthcareEntry).employerName : '',
            sickLeave: 'sickLeave' in prevEntry ? (prevEntry as OccupationalHealthcareEntry).sickLeave : { startDate: '', endDate: '' },
            diagnosisCodes: prevEntry.diagnosisCodes || [] // Ensure diagnosisCodes is preserved
          } as OccupationalHealthcareEntry;

        case EntryType.Hospital:
          return {
            date: prevEntry.date || '',
            type: newType,
            specialist: prevEntry.specialist || '',
            description: prevEntry.description || '',
            discharge: 'discharge' in prevEntry ? (prevEntry as HospitalEntry).discharge : { date: '', criteria: '' },
            diagnosisCodes: prevEntry.diagnosisCodes || [] // Ensure diagnosisCodes is preserved
          } as HospitalEntry;

        default:
          return prevEntry;
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(entry as EntryWithoutId); // Cast entry to EntryWithoutId
  };

  const handleDiagnosisChange = (e: SelectChangeEvent<string>) => {
    const newDiagnosisCode = e.target.value;
    setSelectedDiagnosisCode(newDiagnosisCode);

    setEntry(prevEntry => ({
      ...prevEntry,
      diagnosisCodes: [...(prevEntry.diagnosisCodes || []), newDiagnosisCode]
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={(entry as HealthCheckEntry).date || (entry as OccupationalHealthcareEntry).date || (entry as HospitalEntry).date || ''}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={entryType}
              onChange={handleSelectChange}
              label="Type"
            >
              <MenuItem value={EntryType.HealthCheck}>Health Check</MenuItem>
              <MenuItem value={EntryType.OccupationalHealthcare}>Occupational Healthcare</MenuItem>
              <MenuItem value={EntryType.Hospital}>Hospital</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Specialist"
            name="specialist"
            value={(entry as HealthCheckEntry).specialist || (entry as OccupationalHealthcareEntry).specialist || (entry as HospitalEntry).specialist || ''}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={(entry as HealthCheckEntry).description || (entry as OccupationalHealthcareEntry).description || (entry as HospitalEntry).description || ''}
            onChange={handleChange}
            required
          />
        </Grid>
        {entryType === EntryType.HealthCheck && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Health Check Rating"
              name="healthCheckRating"
              type="number"
              InputProps={{ inputProps: { min: 0, max: 4 } }}
              value={(entry as HealthCheckEntry).healthCheckRating || ''}
              onChange={handleChange}
              required
            />
          </Grid>
        )}
        {entryType === EntryType.OccupationalHealthcare && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Employer Name"
                name="employerName"
                value={(entry as OccupationalHealthcareEntry).employerName || ''}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Sick Leave Start Date"
                name="sickLeave.startDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={(entry as OccupationalHealthcareEntry).sickLeave?.startDate || ''}
                onChange={(e) => handleNestedChange(e as React.ChangeEvent<HTMLInputElement>, 'sickLeave.startDate')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Sick Leave End Date"
                name="sickLeave.endDate"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={(entry as OccupationalHealthcareEntry).sickLeave?.endDate || ''}
                onChange={(e) => handleNestedChange(e as React.ChangeEvent<HTMLInputElement>, 'sickLeave.endDate')}
              />
            </Grid>
          </>
        )}
        {entryType === EntryType.Hospital && (
          <>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discharge Date"
                name="discharge.date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={(entry as HospitalEntry).discharge?.date || ''}
                onChange={(e) => handleNestedChange(e as React.ChangeEvent<HTMLInputElement>, 'discharge.date')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Discharge Criteria"
                name="discharge.criteria"
                value={(entry as HospitalEntry).discharge?.criteria || ''}
                onChange={(e) => handleNestedChange(e as React.ChangeEvent<HTMLInputElement>, 'discharge.criteria')}
                required
              />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Diagnosis Codes</InputLabel>
            <Select
              value={selectedDiagnosisCode}
              onChange={handleDiagnosisChange}
              label="Diagnosis Codes"
            >
              {loading && <CircularProgress />}
              {error && <Typography color="error">{error}</Typography>}
              {!loading && !error && diagnosisOptions.map(diagnosis => (
                <MenuItem key={diagnosis.code} value={diagnosis.code}>
                  {diagnosis.code} - {diagnosis.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddEntryForm;
