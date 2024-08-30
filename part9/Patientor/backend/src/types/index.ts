// Diagnose type
export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

// BaseEntry interface
export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

// HealthCheckRating enum
export enum HealthCheckRating {
  Healthy = 1,
  LowRisk = 2,
  HighRisk = 3,
  CriticalRisk = 4
}

// SickLeave interface
export interface SickLeave {
  startDate: string;
  endDate: string;
}

// HealthCheckEntry interface
export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

// OccupationalHealthcareEntry interface
export interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: SickLeave;
}

// Discharge interface
export interface Discharge {
  date: string;
  criteria: string;
}

// HospitalEntry interface
export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}

// Entry type union
export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

// Patient interface
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

// Gender enum
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER= "other"
}

// NonSensitivePatientEntry type
export type NonSensitivePatientEntry = Omit<Patient, 'ssn' | 'entries'>;

// NewPatientEntry type
export type NewPatientEntry = Omit<Patient, 'id'>;

// UnionOmit type for special omit
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;


export type EntryWithoutId = UnionOmit<Entry, 'id'>;
export type PatientWithoutSsn = Omit<Patient, 'ssn'>;