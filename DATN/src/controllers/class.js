// controllers/class.js
import Class from "../models/Class.js";
import { StudentProfile } from "../models/User.js";
import { TeacherProfile } from "../models/TeacherProfile.js";
import TeacherAssignment from "../models/TeacherAssignment.js";
import { User } from "../models/User.js";

// ✅ Tạo lớp học
export const createClass = async (req, res) => {
  try {
    const { className, grade, academicYear, homeroomTeacher, students } =
      req.body;
    const newClass = await Class.create({
      className,
      grade,
      academicYear,
      homeroomTeacher,
      students,
    });
    res.status(201).json({ message: "Tạo lớp thành công", class: newClass });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ Lấy tất cả các lớp
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate({
      path: "homeroomTeacher",
      populate: { path: "user" },
    });
    res.json({ classes });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ Lấy chi tiết một lớp theo ID (bao gồm học sinh và GVCN)
export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate({ path: "homeroomTeacher", populate: { path: "user" } })
      .populate({ path: "students", populate: { path: "user" } });

    if (!classData) {
      return res.status(404).json({ message: "Không tìm thấy lớp" });
    }

    res.json({ class: classData });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ Lấy danh sách giáo viên bộ môn của lớp
export const getSubjectTeachersByClass = async (req, res) => {
  try {
    const assignments = await TeacherAssignment.find({ class: req.params.id })
      .populate({ path: "teacher", populate: { path: "user" } })
      .populate("subject")
      .populate("semester");

    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ Cập nhật lớp học
export const updateClass = async (req, res) => {
  try {
    const { className, grade, academicYear, homeroomTeacher, students } =
      req.body;
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        className,
        grade,
        academicYear,
        homeroomTeacher,
        students,
      },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Không tìm thấy lớp" });
    }

    res.json({ message: "Cập nhật lớp thành công", class: updatedClass });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ Xoá lớp học
export const deleteClass = async (req, res) => {
  try {
    const deletedClass = await Class.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: "Không tìm thấy lớp" });
    }
    res.json({ message: "Xoá lớp thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
