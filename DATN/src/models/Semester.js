// models/Semester.js
import mongoose from "mongoose";

const SemesterSchema = new mongoose.Schema({
  name: { type: String, required: true }, // "Học kỳ 1", "Học kỳ 2"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Semester = mongoose.model("Semester", SemesterSchema);

export default Semester;
