import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectCloudinary from "./config/cloudinary.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import classRoutes from "./routes/class.js";
import parentChildrenRoutes from "./routes/parentChildren.js";
import semesterRoutes from "./routes/semester.js";
import subjectRoutes from "./routes/subject.js";
//import semesterConductRoutes from "./routes/semesterConduct.js";
import studentRoutes from "./routes/student.js";
import parentRoutes from "./routes/parent.js";
import teacherRoutes from "./routes/teacher.js";
import teacherAssignmentRoutes from "./routes/teacherAssignment.js";
import timetableRoutes from "./routes/timetable.js";
import gradeRoutes from "./routes/gradeRoutes.js";
import attendanceRoutes from "./routes/attendance.js";
import conductRoutes from "./routes/conduct.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectCloudinary();
app.use(express.json());
//app.use(cors());
// Route chính
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/parents", parentChildrenRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/conduct", conductRoutes);

app.use("/api/grades", gradeRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/assignments", teacherAssignmentRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/attendance", attendanceRoutes);

mongoose
  .connect("mongodb://localhost:27017/datn")
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server chạy tại http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
