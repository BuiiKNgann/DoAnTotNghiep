// models/Timetable.js
import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema({
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
  dayOfWeek: {
    type: String,
    enum: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"],
    required: true,
  },
  periods: [
    {
      period: Number, // tiết số
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      },
      teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TeacherProfile",
        required: true,
      },
    },
  ],
});

const Timetable = mongoose.model("Timetable", TimetableSchema);

export default Timetable;
