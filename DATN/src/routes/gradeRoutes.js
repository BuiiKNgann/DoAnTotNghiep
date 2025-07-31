// routes/gradeRoutes.js
import express from "express";
import {
  calculateYearlyAverageByClass,
  createGradeRecord,
  deleteGradeRecord,
  deleteYearlyAverage,
  getGradeRecord,
  getYearlyAverage,
  updateGradeRecord,
  updateYearlyAverage,
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

router.post("/yearly-average", calculateYearlyAverageByClass);
router.get("/yearly-average", getYearlyAverage);
router.put(
  "/yearly-average/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  updateYearlyAverage
);
router.delete(
  "/yearly-average/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  deleteYearlyAverage
);
export default router;
