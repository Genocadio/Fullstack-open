"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatient = void 0;
const zod_1 = require("zod"); // Import Zod
const patientSchema_1 = require("../schemas/patientSchema");
// Middleware for validating patient data
const validatePatient = (req, res, next) => {
    try {
        // Validate request body against the Zod schema
        patientSchema_1.patientSchema.parse(req.body);
        return next(); // Proceed to the next middleware/route handler
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) { // Correctly check for ZodError
            // Handle Zod validation errors
            return res.status(400).json({
                error: error.errors.map(e => e.message).join(', ')
            });
        }
        // Handle unexpected errors
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.validatePatient = validatePatient;
