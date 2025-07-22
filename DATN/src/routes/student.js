import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js"; // middleware xác thực admin
import {
  createStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
  getStudentsByClassAndSemester,
  getStudentsByClassSubjectSemester,
  updateStudent,
} from "../controllers/student.js";
import upload from "../middleware/multer.js";

const router = express.Router();
router.get(
  "/filter-by-condition",
  authenticate,
  authorizeRoles("admin", "teacher"),
  getStudentsByClassSubjectSemester
);
router.get(
  "/filter-by-class-semester",
  authenticate,
  authorizeRoles("admin", "teacher"),
  getStudentsByClassAndSemester
);
router.post(
  "/create",
  authenticate,
  authorizeRoles("admin", "teacher"),
  upload.single("image"),
  createStudent
);
router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "teacher"),
  getAllStudents
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  getStudentById
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  upload.single("image"),
  updateStudent
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  deleteStudent
);

export default router;
