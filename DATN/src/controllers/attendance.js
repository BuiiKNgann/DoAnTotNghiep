import Attendance from "../models/Attendance.js";
import Class from "../models/Class.js";
import { StudentProfile } from "../models/User.js";

export const getAttendanceByClassAndDate = async (req, res) => {
  try {
    const { classId, semesterId, date } = req.query;

    if (!classId || !semesterId || !date) {
      return res.status(400).json({ message: "Thiếu dữ liệu truy vấn" });
    }

    // Chuyển date sang đúng khoảng thời gian trong ngày
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Tìm theo khoảng thời gian trong ngày
    const attendance = await Attendance.findOne({
      class: classId,
      semester: semesterId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    res.json({ attendance });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const getAbsentSessionsByStudent = async (req, res) => {
  try {
    const { studentId, semesterId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "Thiếu studentId" });
    }

    // Tạo query lọc theo student và có thể theo semester
    const query = { "records.student": studentId };
    if (semesterId) {
      query.semester = semesterId;
    }

    // Tìm tất cả bản ghi điểm danh có liên quan đến học sinh
    const attendances = await Attendance.find(query);

    let totalAbsentSessions = 0;

    attendances.forEach((attendance) => {
      attendance.records.forEach((record) => {
        if (record.student.toString() === studentId) {
          const { morning, afternoon } = record;

          // Nếu buổi sáng là 'P' hoặc 'K' thì cộng 1 buổi nghỉ
          if (["P", "K"].includes(morning)) totalAbsentSessions++;

          // Nếu buổi chiều là 'P' hoặc 'K' thì cộng 1 buổi nghỉ
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
      message: "Lỗi server khi tính buổi nghỉ",
      error: err.message,
    });
  }
};

export const getStudentsForAttendance = async (req, res) => {
  try {
    const { classId } = req.params;

    // Kiểm tra lớp có tồn tại không
    const classDoc = await Class.findById(classId);
    if (!classDoc) {
      return res.status(404).json({
        message: "Không tìm thấy lớp học",
      });
    }

    // Lấy danh sách học sinh thuộc lớp
    const students = await StudentProfile.find({
      class: classId,
      status: "active",
    }).populate("user");

    const result = students.map((student) => ({
      studentId: student._id,
      studentCode: student.studentCode,
      fullName: student.user?.fullName || "",
    }));

    res.json({
      message: "Lấy danh sách học sinh thành công",
      students: result,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server: " + err.message,
    });
  }
};

export const createAttendance = async (req, res) => {
  try {
    const { classId, semester, date, records } = req.body;

    if (!classId || !semester || !date || !records) {
      return res.status(400).json({
        message:
          "Thiếu dữ liệu. Vui lòng gửi đầy đủ classId, semester, date và records.",
      });
    }

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        message: "Danh sách records không hợp lệ.",
      });
    }

    // Kiểm tra format từng record
    for (let record of records) {
      if (
        !record.student ||
        !["HD", "P", "K"].includes(record.morning) ||
        !["HD", "P", "K"].includes(record.afternoon)
      ) {
        return res.status(400).json({
          message: "Dữ liệu điểm danh không hợp lệ. Vui lòng kiểm tra record.",
        });
      }
    }

    // Xóa nếu đã tồn tại điểm danh cùng ngày, lớp, học kỳ → Xóa cũ
    await Attendance.deleteOne({
      class: classId,
      semester,
      date: new Date(date),
    });

    // Tạo mới
    const attendance = await Attendance.create({
      class: classId,
      semester,
      date,
      records,
    });

    res.status(201).json({
      message: "Điểm danh thành công",
      attendance,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
