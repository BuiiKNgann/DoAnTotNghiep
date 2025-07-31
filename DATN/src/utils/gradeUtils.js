export function getMaxRegularAssessments(periodsPerYear) {
  if (periodsPerYear <= 35) return 2;
  if (periodsPerYear <= 70) return 3;
  return 4;
}

export function calculateSemesterAverage(
  regulars = [],
  midterm,
  final,
  gradingType
) {
  if (gradingType === "letter") {
    // Với môn chữ, lấy điểm final làm trung bình
    return final || "F"; // Mặc định là "F" nếu không có điểm
  }

  // Với môn số
  const sumTX = regulars.reduce((sum, val) => sum + val, 0);
  const countTX = regulars.length;

  const weightedSum = sumTX + midterm * 2 + final * 3;
  const totalWeight = countTX + 5;

  return +(weightedSum / totalWeight).toFixed(2);
}

export function mapLetterGradeToScore(letter) {
  switch (letter) {
    case "Đ":
    case "P":
      return 10; // Hoàn thành tốt
    case "CĐ":
    case "F":
      return 0; // Không đạt
    default:
      return null; // Không hợp lệ
  }
}

export function validateGrade(grade, gradingType) {
  if (gradingType === "letter") {
    return ["Đ", "P", "CĐ", "F"].includes(grade);
  }
  return typeof grade === "number" && grade >= 0 && grade <= 10;
}
