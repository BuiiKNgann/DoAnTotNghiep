import express from "express";

import { authenticate, authorizeRoles } from "../middleware/auth.js";
import {
  createAssignment,
  deleteAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByClass,
  updateAssignment,
} from "../controllers/teacherAssignment.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("admin"), createAssignment);
router.get("/", authenticate, authorizeRoles("admin"), getAllAssignments);
router.get("/:id", authenticate, authorizeRoles("admin"), getAssignmentById);
router.put("/:id", authenticate, authorizeRoles("admin"), updateAssignment);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteAssignment);
router.get(
  "/by-class/:classId",
  authenticate,
  authorizeRoles("admin"),
  getAssignmentsByClass
);

export default router;
