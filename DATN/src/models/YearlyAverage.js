import mongoose from "mongoose";

const YearlyAverageSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentProfile",
    required: true,
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  semester1: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  semester2: { type: mongoose.Schema.Types.ObjectId, ref: "Semester" },
  semester1Average: { type: Number },
  semester2Average: { type: Number },
  yearlyAverage: { type: Number },
  calculatedAt: { type: Date, default: Date.now },
});

const YearlyAverage = mongoose.model("YearlyAverage", YearlyAverageSchema);
export default YearlyAverage;
