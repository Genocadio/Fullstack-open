import { Patient, Gender, HealthCheckRating } from '../types';

const patients: Patient[] = [
  {
    id: "d2773336-f723-11e9-8f0b-362b9e155667",
    name: "John McClane",
    dateOfBirth: "1986-07-09",
    ssn: "090786-122X",
    gender: Gender.MALE,
    occupation: "New York City Cop",
    entries: [
      {
        id: "1",
        date: "2020-01-01",
        type: "HealthCheck",
        specialist: "Dr. Smith",
        description: "Yearly check-up",
        diagnosisCodes: ["Z57.1", "M24.2", "M51.2"],
        healthCheckRating: HealthCheckRating.Healthy
      },
      {
        id: "2",
        date: "2021-05-10",
        type: "Hospital",
        specialist: "Dr. Adams",
        description: "Treated for severe head injury after accident",
        diagnosisCodes: ["S03.5"],
        discharge: {
          date: "2021-05-15",
          criteria: "Full recovery"
        }
      }
    ]
  },
  {
    id: "d2773598-f723-11e9-8f0b-362b9e155667",
    name: "Martin Riggs",
    dateOfBirth: "1979-01-30",
    ssn: "300179-77A",
    gender: Gender.MALE,
    occupation: "Cop",
    entries: [
      {
        id: "3",
        date: "2021-05-30",
        type: "OccupationalHealthcare",
        specialist: "Dr. Stevens",
        employerName: "NYPD",
        description: "Work injury due to fall",
        diagnosisCodes: ["S62.5", "S03.5"],
        sickLeave: {
          startDate: "2021-05-01",
          endDate: "2021-05-15"
        }
      }
    ]
  },
  {
    id: "d27736ec-f723-11e9-8f0b-362b9e155667",
    name: "Hans Gruber",
    dateOfBirth: "1970-04-25",
    ssn: "250470-555L",
    gender: Gender.OTHER,
    occupation: "Technician",
    entries: [
      {
        id: "4",
        date: "2022-02-14",
        type: "Hospital",
        specialist: "Dr. Brown",
        description: "Hospitalized after a fall from height",
        diagnosisCodes: ["S62.5"],
        discharge: {
          date: "2022-02-28",
          criteria: "Recovered and fit to work"
        }
      }
    ]
  },
  {
    id: "d2773822-f723-11e9-8f0b-362b9e155667",
    name: "Dana Scully",
    dateOfBirth: "1974-01-05",
    ssn: "050174-432N",
    gender: Gender.FEMALE,
    occupation: "Forensic Pathologist",
    entries: [
      {
        id: "5",
        date: "2020-03-15",
        type: "HealthCheck",
        specialist: "Dr. Lee",
        description: "Yearly health check",
        diagnosisCodes: ["Z57.1", "N30.0"],
        healthCheckRating: HealthCheckRating.LowRisk
      }
    ]
  },
  {
    id: "d2773c6e-f723-11e9-8f0b-362b9e155667",
    name: "Matti Luukkainen",
    dateOfBirth: "1971-04-09",
    ssn: "090471-8890",
    gender: Gender.MALE,
    occupation: "Digital Evangelist",
    entries: [
      {
        id: "6",
        date: "2021-10-20",
        type: "OccupationalHealthcare",
        specialist: "Dr. Patel",
        employerName: "Tech Corp",
        description: "Back pain due to long working hours",
        diagnosisCodes: ["M51.2"],
        sickLeave: {
          startDate: "2021-10-21",
          endDate: "2021-10-28"
        }
      },
      {
        id: "7",
        date: "2022-01-10",
        type: "HealthCheck",
        specialist: "Dr. Chang",
        description: "Routine health check",
        diagnosisCodes: ["Z57.1"],
        healthCheckRating: HealthCheckRating.Healthy
      }
    ]
  }
];

export default patients;
