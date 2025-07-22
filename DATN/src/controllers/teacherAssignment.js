import TeacherAssignment from "../models/TeacherAssignment.js";

// Lấy tất cả giáo viên giảng dạy của một lớp
export const getAssignmentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const assignments = await TeacherAssignment.find({ class: classId })
      .populate({
        path: "teacher",
        populate: { path: "user", model: "User" },
      })
      .populate("subject")
      .populate("semester")
      .populate("class");

    res.json({ teachers: assignments });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy giáo viên lớp: " + err.message });
  }
};

// ✅ CREATE
export const createAssignment = async (req, res) => {
  try {
    const { teacher, subject, semester, class: classId } = req.body;
    const assignment = await TeacherAssignment.create({
      teacher,
      subject,
      semester,
      class: classId,
    });
    res.status(201).json({ message: "Phân công thành công", assignment });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo phân công: " + err.message });
  }
};

// ✅ READ ALL
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await TeacherAssignment.find()
      .populate({
        path: "teacher",
        populate: { path: "user", model: "User" },
      })
      .populate("subject")
      .populate("semester")
      .populate("class");
    res.json({ assignments });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách: " + err.message });
  }
};

// ✅ READ ONE
export const getAssignmentById = async (req, res) => {
  try {
    const assignment = await TeacherAssignment.findById(req.params.id)
      .populate("teacher")
      .populate("subject")
      .populate("semester")
      .populate("class");
    if (!assignment)
      return res.status(404).json({ message: "Không tìm thấy phân công" });
    res.json({ assignment });
  } catch (err) {
    res.status(500).json({ message: "Lỗi: " + err.message });
  }
};

// ✅ UPDATE
export const updateAssignment = async (req, res) => {
  try {
    const updated = await TeacherAssignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy phân công" });
    res.json({ message: "Cập nhật thành công", assignment: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật: " + err.message });
  }
};

// ✅ DELETE
export const deleteAssignment = async (req, res) => {
  try {
    const deleted = await TeacherAssignment.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy phân công" });
    res.json({ message: "Xoá phân công thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xoá: " + err.message });
  }
};
