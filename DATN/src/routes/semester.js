// routes/semester.js
import express from "express";
import {
  createSemester,
  deleteSemester,
  getAllSemesters,
  getSemesterById,
  updateSemester,
} from "../controllers/semester";
import { authenticate, authorizeRoles } from "../middleware/auth";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "teacher"),
  createSemester
);
router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "teacher"),
  getAllSemesters
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  getSemesterById
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  updateSemester
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  deleteSemester
);

export default router;
