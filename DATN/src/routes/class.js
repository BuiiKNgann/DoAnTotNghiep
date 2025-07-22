import express from "express";
import {
  createClass,
  deleteClass,
  getAllClasses,
  getClassById,
  updateClass,
} from "../controllers/class.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("admin", "teacher"), createClass); // tạo lớp
router.get(
  "/",
  authenticate,
  authorizeRoles("admin", "teacher"),
  getAllClasses
);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  getClassById
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  updateClass
); // cập nhật lớp
router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teacher"),
  deleteClass
); // xoá lớp

export default router;
