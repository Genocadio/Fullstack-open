import { getArgs } from "./getArgs";
type Result = {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
    };


export function calculateExercises(hours: number[], target: number): Result {
  const periodLength = hours.length;
  const trainingDays = hours.filter(h => h > 0).length;
  const average = hours.reduce((a, b) => a + b, 0) / periodLength;
  const targetReached = average >= target;
  const rating = average < target ? 1 : average === target ? 2 : 3;
  const ratingDescription = rating === 1 ? 'not too bad but could be better' : rating === 2 ? 'good job!' : 'excellent job!';
  return {
    periodLength,
    trainingDays,
    success: targetReached,
    rating,
    ratingDescription,
    target,
    average
  };
}

if (require.main === module) {
  try {
    const [target, hours] = getArgs();
    if (typeof(hours) === 'number') {
        throw new Error('No training data provided');
    }
    const result = calculateExercises(hours, target);
    console.log(result);
} catch (error) {
    console.error(`Error: ${(error as Error).message}`);
}}