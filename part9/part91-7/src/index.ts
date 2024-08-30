import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';
const app = express();
const port = 3003;

app.use(express.json());
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const height = Number(req.query.height);
    const weight = Number(req.query.weight);

    if (isNaN(height) || isNaN(weight) || !height || !weight) {
        return res.status(400).json({ error: 'malformatted parameters' });
    }

    const bmiCat = calculateBmi(height, weight);
    return res.json({
        weight,
        height,
        bmi: bmiCat
    });
    
});
interface ExerciseRequestBody {
    daily_exercises: number[];
    target: number;
  }
app.post('/exercises', (req, res) => {
    const { daily_exercises, target } = req.body as ExerciseRequestBody;
    if(!daily_exercises || target === undefined) {
        return res.status(400).json({error: 'parameters missing'});
    }
    if(!Array.isArray(daily_exercises) || !daily_exercises.every(n => typeof n === 'number') || typeof target !== 'number') {
        return res.status(400).json({ error: 'malformated parameters'});

    }
    const result = calculateExercises(daily_exercises, target);
    return res.json(result);
});



app.listen(port, ()=> {
    console.log(`Server running on port ${port}`);
});