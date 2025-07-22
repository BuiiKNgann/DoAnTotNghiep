// controllers/semester.js
import Semester from "../models/Semester.js";

export const createSemester = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const semester = await Semester.create({ name, startDate, endDate });
    res.status(201).json({ message: "Tạo học kỳ thành công", semester });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const getAllSemesters = async (req, res) => {
  try {
    const semesters = await Semester.find().sort({ startDate: 1 });
    res.json({ semesters });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const getSemesterById = async (req, res) => {
  try {
    const semester = await Semester.findById(req.params.id);
    if (!semester)
      return res.status(404).json({ message: "Không tìm thấy học kỳ" });
    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const updateSemester = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const semester = await Semester.findByIdAndUpdate(
      req.params.id,
      { name, startDate, endDate },
      { new: true }
    );
    if (!semester)
      return res.status(404).json({ message: "Không tìm thấy học kỳ" });
    res.json({ message: "Cập nhật học kỳ thành công", semester });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const deleteSemester = async (req, res) => {
  try {
    const semester = await Semester.findByIdAndDelete(req.params.id);
    if (!semester)
      return res.status(404).json({ message: "Không tìm thấy học kỳ" });
    res.json({ message: "Xóa học kỳ thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
