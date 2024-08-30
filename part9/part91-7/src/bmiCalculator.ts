import { getArgs } from "./getArgs";

export function calculateBmi(height: number, weight: number): string {
  const bmi = weight / Math.pow(height / 100, 2);
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal range';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
}

if (require.main === module) {
  try {
    const [height, weightOrRest] = getArgs();
  
    if (typeof weightOrRest === 'number') {
      const weight = weightOrRest;
      const bmiCategory = calculateBmi(height, weight);
      console.log(`Height: ${height}, Weight: ${weight}, BMI: ${bmiCategory}`);
    } else {
      console.error("Error: Invalid arguments provided.");
    }
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}
