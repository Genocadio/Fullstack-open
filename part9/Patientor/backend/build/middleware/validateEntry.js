"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNewEntry = exports.toNewPatientEntry = void 0;
const index_1 = require("../types/index");
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
const isString = (text) => {
    return typeof text === 'string' || text instanceof String;
};
const isNumber = (text) => {
    return typeof text === 'number' || text instanceof Number;
};
const isGender = (param) => {
    return Object.values(index_1.Gender).map(v => v.toString()).includes(param);
};
const parseName = (name) => {
    if (!name || !isString(name)) {
        throw new Error('Incorrect or missing name');
    }
    return name;
};
const parseDescription = (description) => {
    if (!description || !isString(description)) {
        throw new Error('Missing info in description field');
    }
    return description;
};
const parseSpecialist = (specialist) => {
    if (!specialist || !isString(specialist)) {
        throw new Error('Missing info in specialist field');
    }
    return specialist;
};
const parseCriteria = (dischargeCriteria) => {
    if (!dischargeCriteria || !isString(dischargeCriteria)) {
        throw new Error('Missing info in criteria field');
    }
    return dischargeCriteria;
};
const parseDate = (date) => {
    if (!date || !isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};
const parseGender = (gender) => {
    if (!gender || !isString(gender) || !isGender(gender)) {
        throw new Error('Incorrect or missing gender: ' + gender);
    }
    return gender;
};
const parseSSN = (ssn) => {
    if (!ssn || !isString(ssn)) {
        throw new Error('Incorrect or missing ssn');
    }
    return ssn;
};
const parseOccupation = (occupation) => {
    if (!occupation || !isString(occupation)) {
        throw new Error('Incorrect or missing occupation');
    }
    return occupation;
};
const parseEntries = (entries) => {
    if (!Array.isArray(entries)) {
        throw new Error("Incorrect or missing entries");
    }
    // Assert that each entry in the array is of type Entry
    entries.forEach((entry) => {
        if (!isEntry(entry)) {
            throw new Error("Invalid entry");
        }
    });
    return entries;
};
const parseDiagnosisCodes = (object) => {
    if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
        // we will just trust the data to be in correct form
        return [];
    }
    return object.diagnosisCodes;
};
const isHealthCheck = (param) => {
    return Object.values(index_1.HealthCheckRating).map(v => v).includes(param);
};
const parseHealthCheck = (healthCheckRating) => {
    if (!healthCheckRating || !isNumber(healthCheckRating) || !isHealthCheck(healthCheckRating)) {
        throw new Error(`Incorrect Health Rating: ${healthCheckRating}, should be in the range 1 - 4`);
    }
    return healthCheckRating;
};
const parseDischarge = (discharge) => {
    if (!discharge || typeof discharge !== 'object'
        || !("date" in discharge) || !("criteria" in discharge)) {
        throw new Error('Incorrect or missing data');
    }
    const newDischarge = {
        date: parseDate(discharge.date),
        criteria: parseCriteria(discharge.criteria)
    };
    return newDischarge;
};
const parseSickLeave = (sickLeave) => {
    if (!sickLeave || typeof sickLeave !== 'object'
        || !("startDate" in sickLeave) || !("endDate" in sickLeave)) {
        throw new Error('Incorrect or missing data');
    }
    const newSickLeave = {
        startDate: parseDate(sickLeave.startDate),
        endDate: parseDate(sickLeave.endDate),
    };
    return newSickLeave;
};
const isEntry = (entry) => {
    if (!entry || typeof entry !== 'object' || !("type" in entry)) {
        throw new Error('Incorrect or missing data');
    }
    if (!('description' in entry && 'date' in entry
        && 'specialist' in entry)) {
        throw new Error('Incorrect or missing data');
    }
    return ((entry.type === "Hospital" ||
        entry.type === "OccupationalHealthcare" ||
        entry.type === "HealthCheck"));
};
const toNewPatientEntry = (object) => {
    if (!object || typeof object !== 'object') {
        throw new Error('Incorrect or missing data');
    }
    if ('name' in object
        && 'dateOfBirth' in object
        && 'ssn' in object
        && 'gender' in object
        && 'occupation' in object
        && 'entries' in object) {
        const newEntry = {
            name: parseName(object.name),
            dateOfBirth: parseDate(object.dateOfBirth),
            ssn: parseSSN(object.ssn),
            gender: parseGender(object.gender),
            occupation: parseOccupation(object.occupation),
            entries: parseEntries(object.entries),
        };
        return newEntry;
    }
    throw new Error('Incorrect data: some fields are missing');
};
exports.toNewPatientEntry = toNewPatientEntry;
const toNewEntry = (object) => {
    if (!object || typeof object !== 'object' || !("type" in object)) {
        throw new Error('Incorrect or missing data');
    }
    if (!('description' in object && 'date' in object
        && 'specialist' in object)) {
        throw new Error('Incorrect or missing data');
    }
    switch (object.type) {
        case "Hospital":
            if ('discharge' in object) {
                const newEntry = {
                    type: object.type,
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist),
                    discharge: parseDischarge(object.discharge),
                    diagnosisCodes: parseDiagnosisCodes(object)
                };
                return newEntry;
            }
            else {
                throw new Error('Incorrect or missing data');
            }
        case "OccupationalHealthcare":
            if ('sickLeave' in object && 'employerName' in object) {
                const newEntry = {
                    type: object.type,
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist),
                    sickLeave: parseSickLeave(object.sickLeave),
                    employerName: parseName(object.employerName),
                    diagnosisCodes: parseDiagnosisCodes(object)
                };
                return newEntry;
            }
            else {
                throw new Error('Incorrect or missing data');
            }
        case "HealthCheck":
            if ('healthCheckRating' in object) {
                const newEntry = {
                    type: object.type,
                    description: parseDescription(object.description),
                    date: parseDate(object.date),
                    specialist: parseSpecialist(object.specialist),
                    healthCheckRating: parseHealthCheck(object.healthCheckRating),
                    diagnosisCodes: parseDiagnosisCodes(object)
                };
                return newEntry;
            }
            else {
                throw new Error('Incorrect or missing data');
            }
        default:
            throw new Error("Invalid entry type");
    }
};
exports.toNewEntry = toNewEntry;
