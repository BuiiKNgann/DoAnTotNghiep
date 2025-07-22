import mongoose from "mongoose";

// User
const UserSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "teacher", "parent", "student"] },
  gender: { type: String, enum: ["male", "female", "other"] },
  dateOfBirth: Date,
  avatarUrl: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

// StudentProfile
const StudentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentCode: String,
  grade: String,
  academicYear: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const StudentProfile = mongoose.model("StudentProfile", StudentProfileSchema);

// ParentChildren
const ParentChildrenSchema = new mongoose.Schema({
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "StudentProfile" }],
});

const ParentChildren = mongoose.model("ParentChildren", ParentChildrenSchema);

export { User, StudentProfile, ParentChildren };
