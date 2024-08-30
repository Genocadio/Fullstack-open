import { Router, Request, Response } from 'express';
import { PatientWithoutSsn, Patient, EntryWithoutId, Entry } from '../types';
import { v1 as uuid } from 'uuid';
import data from '../data/patientsData';  // Import the data
import { validatePatient } from '../middleware/validatePatient';  // Import validation middleware
import { toNewEntry } from '../middleware/validateEntry';  // Import toNewEntry

const router = Router();

// GET endpoint to fetch all patients excluding `ssn`
router.get('/', (_req: Request, res: Response) => {
  const patientsWithoutSsn: PatientWithoutSsn[] = data.map(({ ssn: _ssn, ...rest }) => rest);
  res.json(patientsWithoutSsn);
});

// POST endpoint to add a new patient
router.post('/', validatePatient, (req: Request, res: Response) => {
  // Extract validated data with explicit type assertion
  const { name, dateOfBirth, ssn, gender, occupation } = req.body as Patient;

  // Create new patient object
  const newPatient: Patient = {
    id: uuid(),
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
    entries: [],
  };

  // Add new patient to the data
  data.push(newPatient);

  // Respond with the newly created patient
  return res.status(201).json(newPatient);
});

router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const patient = data.find(p => p.id === id);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});

router.get('/:id/entries/:entryid', (req: Request, res: Response) => {
  const { id, entryid } = req.params;
  const patient = data.find(p => p.id === id);

  if (patient) {
    const entry = patient.entries.find(e => e.id === entryid);

    if (entry) {
      res.json(entry);
    } else {
      res.status(404).send({ error: "Entry not found" });
    }
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});


const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const newId: string = uuid();
  const newEntry = {
      id: newId,
      ...entry
  };
  const idx: number = data.findIndex((patient) => patientId === patient.id);
  if (idx === -1) {
      throw Error("Patient not found");
  }
  else {
      data[idx].entries.push(newEntry);
      return newEntry;
  }
};
router.post('/:id/entries', (req, res) => {
  try {
      const newEntry = toNewEntry(req.body);
      const addedEntry = addEntry(req.params.id, newEntry);

      return res.json(addedEntry);
  }
  catch (error: unknown) {
      if (error instanceof Error) {
          return res.status(400).json({ error: error.message });
      } else {
          return res.status(400).json({ error: "Unknown error occurred" });
      }
  }
});

export default router;
