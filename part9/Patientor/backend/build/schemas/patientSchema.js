"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientSchema = void 0;
const zod_1 = require("zod");
const index_1 = require("../types/index");
exports.patientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required and must be a string.'),
    dateOfBirth: zod_1.z.string().min(1, 'Date of birth is required and must be a string.'),
    ssn: zod_1.z.string().min(1, 'SSN is required and must be a string.'),
    gender: zod_1.z.enum([index_1.Gender.MALE, index_1.Gender.FEMALE, index_1.Gender.OTHER]),
    occupation: zod_1.z.string().min(1, 'Occupation must be a string.')
});
