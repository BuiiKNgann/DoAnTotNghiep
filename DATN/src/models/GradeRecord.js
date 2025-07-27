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
    type: [mongoose.Schema.Types.Mixed], // Hỗ trợ cả số và chữ
    default: [],
  },
  midterm: { type: mongoose.Schema.Types.Mixed }, // Hỗ trợ cả số và chữ
  final: { type: mongoose.Schema.Types.Mixed }, // Hỗ trợ cả số và chữ
  average: { type: Number }, // Điểm trung bình là số (cho môn số)
  averageLetter: { type: String }, // Điểm trung bình là chữ (cho môn chữ)
  createdAt: { type: Date, default: Date.now },
});

const GradeRecord = mongoose.model("GradeRecord", GradeRecordSchema);
export default GradeRecord;
