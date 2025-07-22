import express from "express";
import {
  createOrUpdateTimetable,
  deleteTimetable,
  getTimetable,
  updateTimetable,
} from "../controllers/timetable";

const router = express.Router();

router.get("/", getTimetable);
router.post("/", createOrUpdateTimetable);
router.delete("/", deleteTimetable);
router.put("/", updateTimetable);

export default router;
