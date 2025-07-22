import express from "express";
import { authenticate, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.get("/dashboard", authenticate, authorizeRoles("admin"), (req, res) => {
  res.send("Chào Admin!");
});

export default router;
