import { Request, Response, NextFunction } from 'express';
import {  ZodError } from 'zod';  // Import Zod
import { patientSchema } from '../schemas/patientSchema';

// Middleware for validating patient data
export const validatePatient = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body against the Zod schema
    patientSchema.parse(req.body);
    return next();  // Proceed to the next middleware/route handler
  } catch (error) {
    if (error instanceof ZodError) {  // Correctly check for ZodError
      // Handle Zod validation errors
      return res.status(400).json({ 
        error: error.errors.map(e => e.message).join(', ') 
      });
    }

    // Handle unexpected errors
    return res.status(500).json({ error: 'Internal server error' });
  }
};
