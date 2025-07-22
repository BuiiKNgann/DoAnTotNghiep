import GradeRecord from "../models/GradeRecord.js";
import Subject from "../models/Subject.js";
import {
  calculateSemesterAverage,
  getMaxRegularAssessments,
} from "../utils/gradeUtils.js";

// ✅ Tạo điểm học kỳ
export const createGradeRecord = async (req, res) => {
  try {
    const {
      student,
      subject,
      class: classId,
      semester,
      teacher,
      regularAssessments,
      midterm,
      final,
    } = req.body;

    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    const maxTX = getMaxRegularAssessments(subjectDoc.periodsPerYear);

    if (regularAssessments.length > maxTX) {
      return res.status(400).json({
        message: `Môn học này chỉ được phép nhập tối đa ${maxTX} điểm đánh giá thường xuyên.`,
      });
    }

    const average = calculateSemesterAverage(
      regularAssessments,
      midterm,
      final
    );

    const gradeRecord = await GradeRecord.create({
      student,
      subject,
      class: classId,
      semester,
      teacher,
      regularAssessments,
      midterm,
      final,
      average,
    });

    res.status(201).json({ message: "Nhập điểm thành công", gradeRecord });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ Lấy điểm theo học sinh, môn, học kỳ
export const getGradeRecord = async (req, res) => {
  try {
    const { studentId, subjectId, semesterId } = req.query;

    const query = {
      ...(studentId && { student: studentId }),
      ...(subjectId && { subject: subjectId }),
      ...(semesterId && { semester: semesterId }),
    };

    const records = await GradeRecord.find(query).populate(
      "student subject teacher semester class"
    );

    res.json({ message: "Lấy bảng điểm thành công", records });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
//Cập nhật điểm (PUT)
export const updateGradeRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { regularAssessments, midterm, final } = req.body;

    const gradeRecord = await GradeRecord.findById(id).populate("subject");

    if (!gradeRecord) {
      return res.status(404).json({ message: "Không tìm thấy bảng điểm" });
    }

    // Giới hạn điểm TX theo periodsPerYear
    const subject = gradeRecord.subject;
    const periodsPerYear = subject.periodsPerYear;
    const maxTX = getMaxRegularAssessments(periodsPerYear);

    if (regularAssessments.length > maxTX) {
      return res.status(400).json({
        message: `Chỉ cho phép tối đa ${maxTX} điểm đánh giá thường xuyên.`,
      });
    }

    // Cập nhật
    gradeRecord.regularAssessments = regularAssessments;
    gradeRecord.midterm = midterm;
    gradeRecord.final = final;
    gradeRecord.average = calculateSemesterAverage(
      regularAssessments,
      midterm,
      final
    );

    await gradeRecord.save();

    res.json({ message: "Cập nhật bảng điểm thành công", gradeRecord });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
//Xoá điểm (DELETE)
export const deleteGradeRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await GradeRecord.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy bảng điểm" });
    }

    res.json({ message: "Xoá bảng điểm thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
