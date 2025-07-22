import express from "express";
import {
  addChildrenToParent,
  getChildrenOfParent,
  removeChildFromParent,
} from "../controllers/parentChildren.js";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/:parentId/children",
  authenticate,
  authorizeRoles("admin", "parent", "teach"),
  addChildrenToParent
);
router.get(
  "/:parentId/children",
  authenticate,
  authorizeRoles("admin", "parent", "teach"),
  getChildrenOfParent
);
router.delete(
  "/:parentId/children/:childId",
  authenticate,
  authorizeRoles("admin", "parent", "teach"),
  removeChildFromParent
);

export default router;
