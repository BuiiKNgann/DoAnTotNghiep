import mongoose from "mongoose";

const TeacherAssignmentSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TeacherProfile",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true,
  },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // optional
});

const TeacherAssignment = mongoose.model(
  "TeacherAssignment",
  TeacherAssignmentSchema
);
export default TeacherAssignment;
