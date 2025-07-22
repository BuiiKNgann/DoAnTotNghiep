export function getMaxRegularAssessments(periodsPerYear) {
  if (periodsPerYear <= 35) return 2;
  if (periodsPerYear <= 70) return 3;
  return 4;
}

export function calculateSemesterAverage(regulars = [], midterm, final) {
  const sumTX = regulars.reduce((sum, val) => sum + val, 0);
  const countTX = regulars.length;

  const weightedSum = sumTX + midterm * 2 + final * 3;
  const totalWeight = countTX + 5;

  return +(weightedSum / totalWeight).toFixed(2);
}
