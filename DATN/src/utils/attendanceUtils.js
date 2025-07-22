import Attendance from "../models/Attendance.js";

export const getAbsentDays = async (studentId, semesterId) => {
  const attendances = await Attendance.find({ semester: semesterId });

  let totalAbsents = 0;

  attendances.forEach((att) => {
    const record = att.records.find(
      (r) => r.student.toString() === studentId.toString()
    );
    if (record) {
      if (record.morning === "P") totalAbsents += 1;
      else if (record.morning === "K") totalAbsents += 0.5;

      if (record.afternoon === "P") totalAbsents += 1;
      else if (record.afternoon === "K") totalAbsents += 0.5;
    }
  });

  return totalAbsents;
};
