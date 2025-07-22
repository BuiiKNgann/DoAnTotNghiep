// models/TeacherProfile.js
import mongoose from "mongoose";

const TeacherProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  teacherCode: String,
  // subject: String,
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  department: String,
  phone: String,
});

export const TeacherProfile = mongoose.model(
  "TeacherProfile",
  TeacherProfileSchema
);
