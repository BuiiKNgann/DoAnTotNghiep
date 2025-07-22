// models/ConductRecord.js
import mongoose from "mongoose";

const ConductRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    conduct: {
      type: String,
      enum: ["Tốt", "Khá", "Trung bình", "Yếu"],
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const ConductRecord = mongoose.model("ConductRecord", ConductRecordSchema);

export default ConductRecord;
