import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StudentProfile",
          required: true,
        },
        morning: {
          type: String,
          enum: ["HD", "P", "K"],
          required: true,
        },
        afternoon: {
          type: String,
          enum: ["HD", "P", "K"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
