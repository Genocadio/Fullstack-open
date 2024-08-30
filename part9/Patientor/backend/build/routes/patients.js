"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const patientsData_1 = __importDefault(require("../data/patientsData")); // Import the data
const validatePatient_1 = require("../middleware/validatePatient"); // Import validation middleware
const validateEntry_1 = require("../middleware/validateEntry"); // Import toNewEntry
const router = (0, express_1.Router)();
// GET endpoint to fetch all patients excluding `ssn`
router.get('/', (_req, res) => {
    const patientsWithoutSsn = patientsData_1.default.map((_a) => {
        var { ssn: _ssn } = _a, rest = __rest(_a, ["ssn"]);
        return rest;
    });
    res.json(patientsWithoutSsn);
});
// POST endpoint to add a new patient
router.post('/', validatePatient_1.validatePatient, (req, res) => {
    // Extract validated data with explicit type assertion
    const { name, dateOfBirth, ssn, gender, occupation } = req.body;
    // Create new patient object
    const newPatient = {
        id: (0, uuid_1.v1)(),
        name,
        dateOfBirth,
        ssn,
        gender,
        occupation,
        entries: [],
    };
    // Add new patient to the data
    patientsData_1.default.push(newPatient);
    // Respond with the newly created patient
    return res.status(201).json(newPatient);
});
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const patient = patientsData_1.default.find(p => p.id === id);
    if (patient) {
        res.json(patient);
    }
    else {
        res.status(404).send({ error: "Patient not found" });
    }
});
router.get('/:id/entries/:entryid', (req, res) => {
    const { id, entryid } = req.params;
    const patient = patientsData_1.default.find(p => p.id === id);
    if (patient) {
        const entry = patient.entries.find(e => e.id === entryid);
        if (entry) {
            res.json(entry);
        }
        else {
            res.status(404).send({ error: "Entry not found" });
        }
    }
    else {
        res.status(404).send({ error: "Patient not found" });
    }
});
const addEntry = (patientId, entry) => {
    const newId = (0, uuid_1.v1)();
    const newEntry = Object.assign({ id: newId }, entry);
    const idx = patientsData_1.default.findIndex((patient) => patientId === patient.id);
    if (idx === -1) {
        throw Error("Patient not found");
    }
    else {
        patientsData_1.default[idx].entries.push(newEntry);
        return newEntry;
    }
};
router.post('/:id/entries', (req, res) => {
    try {
        const newEntry = (0, validateEntry_1.toNewEntry)(req.body);
        const addedEntry = addEntry(req.params.id, newEntry);
        return res.json(addedEntry);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        else {
            return res.status(400).json({ error: "Unknown error occurred" });
        }
    }
});
exports.default = router;
