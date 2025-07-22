import ConductRecord from "../models/ConductRecord.js";
import Semester from "../models/Semester.js";
import { getAbsentDays } from "../utils/attendanceUtils.js";
import Attendance from "../models/Attendance.js";
export const getAbsentSessionsInConduct = async (req, res) => {
  try {
    const { studentId, semesterId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "Thiếu studentId" });
    }

    const query = { "records.student": studentId };
    if (semesterId) {
      query.semester = semesterId;
    }

    const attendances = await Attendance.find(query);

    let totalAbsentSessions = 0;

    attendances.forEach((attendance) => {
      attendance.records.forEach((record) => {
        if (record.student.toString() === studentId) {
          const { morning, afternoon } = record;

          if (["P", "K"].includes(morning)) totalAbsentSessions++;
          if (["P", "K"].includes(afternoon)) totalAbsentSessions++;
        }
      });
    });

    res.json({
      studentId,
      semesterId: semesterId || null,
      totalAbsentSessions,
      totalAbsentDays: totalAbsentSessions / 2,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server khi tính buổi nghỉ trong conduct",
      error: err.message,
    });
  }
};

// 1. Tạo mới
export const createConductRecord = async (req, res) => {
  try {
    const { student, semester, conduct, note } = req.body;

    const record = new ConductRecord({ student, semester, conduct, note });
    await record.save();

    res.status(201).json(record);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi tạo bản ghi hạnh kiểm", error: err.message });
  }
};

// 2. Lấy danh sách hạnh kiểm
export const getConductRecords = async (req, res) => {
  try {
    const { studentId, semesterId } = req.query;

    const filter = {};
    if (studentId) filter.student = studentId;
    if (semesterId) filter.semester = semesterId;

    const records = await ConductRecord.find(filter)
      .populate("student", "studentCode fullName")
      .populate("semester", "name");

    res.json(records);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách hạnh kiểm", error: err.message });
  }
};

// 3. Tính hạnh kiểm cả năm + kiểm tra số buổi nghỉ
export const getFinalConduct = async (req, res) => {
  try {
    const { studentId, yearId } = req.query;

    // Tìm 2 học kỳ thuộc năm đó
    const semesters = await Semester.find({ academicYear: yearId }).sort({
      name: 1,
    });

    if (semesters.length < 2) {
      return res
        .status(400)
        .json({ message: "Chưa đủ 2 học kỳ trong năm học này" });
    }

    // Lấy hạnh kiểm 2 học kỳ
    const records = await ConductRecord.find({
      student: studentId,
      semester: { $in: semesters.map((s) => s._id) },
    });

    if (records.length < 2) {
      return res
        .status(400)
        .json({ message: "Chưa đủ dữ liệu 2 học kỳ để tính cả năm" });
    }

    // Tính tổng số buổi nghỉ cả năm
    let totalAbsents = 0;
    for (const semester of semesters) {
      const count = await getAbsentDays(studentId, semester._id);
      totalAbsents += count;
    }

    // Nếu nghỉ > 45 buổi thì đánh giá lại
    if (totalAbsents > 45) {
      return res.json({
        finalConduct: "Yếu",
        reason: "Nghỉ quá 45 buổi",
        absentCount: totalAbsents,
        ratings: records.map((r) => r.conduct),
      });
    }

    // Quy tắc xếp loại cả năm
    const ratings = records.map((r) => r.conduct);
    const priority = { Tốt: 4, Khá: 3, "Trung bình": 2, Yếu: 1 };
    const avg =
      ratings.reduce((sum, r) => sum + priority[r], 0) / ratings.length;

    let finalConduct;
    if (avg >= 3.5) finalConduct = "Tốt";
    else if (avg >= 2.5) finalConduct = "Khá";
    else if (avg >= 1.5) finalConduct = "Trung bình";
    else finalConduct = "Yếu";

    res.json({
      finalConduct,
      ratings,
      absentCount: totalAbsents,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi tính hạnh kiểm cả năm", error: err.message });
  }
};
// 4. Cập nhật bản ghi hạnh kiểm
export const updateConductRecord = async (req, res) => {
  try {
    const { id } = req.params; // id của bản ghi hạnh kiểm
    const { conduct, note } = req.body;

    const updated = await ConductRecord.findByIdAndUpdate(
      id,
      { conduct, note },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy bản ghi" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Lỗi khi cập nhật hạnh kiểm",
      error: err.message,
    });
  }
};
