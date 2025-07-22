import express from "express";
import {
  createParent,
  deleteParent,
  getAllParents,
  getParentById,
  getParentWithChildren,
  updateParent,
} from "../controllers/parent.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/", authenticate, authorizeRoles("admin", "teach"), getAllParents);
router.get(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teach"),
  getParentWithChildren
);
router.post(
  "/create",
  authenticate,
  authorizeRoles("admin", "teach"),
  upload.single("image"),
  createParent
);
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin", "teach"),
  upload.single("image"),
  updateParent
);
router.get(
  "/view/:id",
  authenticate,
  authorizeRoles("admin", "teach"),
  getParentById
);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteParent);
export default router;
