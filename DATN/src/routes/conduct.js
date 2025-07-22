import express from "express";
import {
  createConductRecord,
  getAbsentSessionsInConduct,
  getConductRecords,
  getFinalConduct,
  updateConductRecord,
} from "../controllers/conduct";

const router = express.Router();

router.post("/", createConductRecord);
router.get("/", getConductRecords);
router.get("/final", getFinalConduct);
router.get("/absent-sessions", getAbsentSessionsInConduct);
router.put("/:id", updateConductRecord);
export default router;
