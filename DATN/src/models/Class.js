// models/Class.js
import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    homeroomTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherProfile",
      default: null, // Có thể chưa phân công
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudentProfile",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Class = mongoose.model("Class", ClassSchema);

export default Class;
