import express from 'express';
import cors from 'cors';
import diagonosisRoutes from './routes/diagonoses';
import patientsRoutes from './routes/patients';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


app.use('/api/diagnoses', diagonosisRoutes);
app.use('/api/patients', patientsRoutes);
app.get('/api/ping', ( _req, resp) => {
    resp.json({message: 'pong'});
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
