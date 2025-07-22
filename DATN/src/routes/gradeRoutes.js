// routes/gradeRoutes.js
import express from "express";
import {
  createGradeRecord,
  deleteGradeRecord,
  getGradeRecord,
  updateGradeRecord,
} from "../controllers/grade.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "teacher"),

  createGradeRecord
); // Tạo điểm
router.get("/", getGradeRecord); // Lấy điểm
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  updateGradeRecord
); // ✅ cập nhật điểm
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  deleteGradeRecord
); // ✅ xoá điểm

export default router;
