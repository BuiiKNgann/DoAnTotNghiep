import express from "express";
import {
  createTeacher,
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
} from "../controllers/teacher";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  upload.single("image"),
  createTeacher
);
router.get("/", authenticate, authorizeRoles("admin"), getAllTeachers);
router.get("/:id", authenticate, authorizeRoles("admin"), getTeacherById);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  upload.single("image"),
  updateTeacher
);
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  upload.single("image"),
  deleteTeacher
);

export default router;
