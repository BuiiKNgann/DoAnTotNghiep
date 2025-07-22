import express from "express";
import {
  register,
  login,
  updateProfile,
  getProfile,
} from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/get-profile", authenticate, getProfile);
router.put("/profile", upload.single("image"), authenticate, updateProfile);

export default router;
