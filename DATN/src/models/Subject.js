// models/Subject.js
import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  isRequired: { type: Boolean, default: true }, // Môn bắt buộc hay tự chọn
  gradingType: {
    type: String,
    enum: ["numerical", "letter"],
    default: "numerical",
    required: true,
  }, // Loại điểm: số (numerical) hoặc chữ (letter)
  semesters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Semester" }], // liên kết nhiều học kỳ
  periodsPerYear: { type: Number, required: true },
});

const Subject = mongoose.model("Subject", SubjectSchema);

export default Subject;
