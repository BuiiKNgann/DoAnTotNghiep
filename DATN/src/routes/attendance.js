import express from "express";
import {
  createAttendance,
  getAbsentSessionsByStudent,
  getAttendanceByClassAndDate,
  getStudentsForAttendance,
} from "../controllers/attendance";

const router = express.Router();
router.get("/records", getAttendanceByClassAndDate);
router.get("/students/:classId", getStudentsForAttendance);
router.post("/", createAttendance);
router.get("/absent-sessions", getAbsentSessionsByStudent);
export default router;
