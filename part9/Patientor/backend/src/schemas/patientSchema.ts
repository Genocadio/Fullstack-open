import { z } from 'zod';
import { Gender } from '../types/index'; 


export const patientSchema = z.object({
  name: z.string().min(1, 'Name is required and must be a string.'),
  dateOfBirth: z.string().min(1, 'Date of birth is required and must be a string.'),
  ssn: z.string().min(1, 'SSN is required and must be a string.'),
  gender: z.enum([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
  occupation: z.string().min(1, 'Occupation must be a string.')
});
