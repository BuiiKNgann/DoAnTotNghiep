import mongoose from "mongoose";

const GradeRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudentProfile",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherProfile",
    required: false,
  },
  regularAssessments: {
    type: [Number],
    default: [],
  },
  midterm: { type: Number, min: 0, max: 10 },
  final: { type: Number, min: 0, max: 10 },
  average: { type: Number }, // ✅ điểm trung bình học kỳ
  createdAt: { type: Date, default: Date.now },
});

const GradeRecord = mongoose.model("GradeRecord", GradeRecordSchema);
export default GradeRecord;
