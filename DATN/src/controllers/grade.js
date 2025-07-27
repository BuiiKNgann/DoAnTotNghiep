import GradeRecord from "../models/GradeRecord.js";
import Subject from "../models/Subject.js";
import {
  calculateSemesterAverage,
  getMaxRegularAssessments,
  validateGrade,
} from "../utils/gradeUtils.js";

// Tạo điểm học kỳ
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

    const { gradingType, periodsPerYear } = subjectDoc;
    const maxTX = getMaxRegularAssessments(periodsPerYear);

    // Kiểm tra số lượng điểm thường xuyên
    if (regularAssessments.length > maxTX) {
      return res.status(400).json({
        message: `Môn học này chỉ được phép nhập tối đa ${maxTX} điểm đánh giá thường xuyên.`,
      });
    }

    // Kiểm tra định dạng điểm
    if (
      !regularAssessments.every((grade) => validateGrade(grade, gradingType))
    ) {
      return res.status(400).json({
        message: `Điểm đánh giá thường xuyên không hợp lệ cho môn ${
          gradingType === "letter" ? "chữ" : "số"
        }.`,
      });
    }

    if (!validateGrade(midterm, gradingType)) {
      return res.status(400).json({
        message: `Điểm giữa kỳ không hợp lệ cho môn ${
          gradingType === "letter" ? "chữ" : "số"
        }.`,
      });
    }

    if (!validateGrade(final, gradingType)) {
      return res.status(400).json({
        message: `Điểm cuối kỳ không hợp lệ cho môn ${
          gradingType === "letter" ? "chữ" : "số"
        }.`,
      });
    }

    const average = calculateSemesterAverage(
      regularAssessments,
      midterm,
      final,
      gradingType
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

// Lấy điểm theo học sinh, môn, học kỳ
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

// Cập nhật điểm (PUT)
export const updateGradeRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { regularAssessments, midterm, final } = req.body;

    const gradeRecord = await GradeRecord.findById(id).populate("subject");

    if (!gradeRecord) {
      return res.status(404).json({ message: "Không tìm thấy bảng điểm" });
    }

    const { gradingType, periodsPerYear } = gradeRecord.subject;
    const maxTX = getMaxRegularAssessments(periodsPerYear);

    // Kiểm tra số lượng điểm thường xuyên
    if (regularAssessments.length > maxTX) {
      return res.status(400).json({
        message: `Chỉ cho phép tối đa ${maxTX} điểm đánh giá thường xuyên.`,
      });
    }

    // Kiểm tra định dạng điểm
    if (
      !regularAssessments.every((grade) => validateGrade(grade, gradingType))
    ) {
      return res.status(400).json({
        message: `Điểm đánh giá thường xuyên không hợp lệ cho môn ${
          gradingType === "letter" ? "chữ" : "số"
        }.`,
      });
    }

    if (!validateGrade(midterm, gradingType)) {
      return res.status(400).json({
        message: `Điểm giữa kỳ không hợp lệ cho môn ${
          gradingType === "letter" ? "chữ" : "số"
        }.`,
      });
    }

    if (!validateGrade(final, gradingType)) {
      return res.status(400).json({
        message: `Điểm cuối kỳ không hợp lệ cho môn ${
          gradingType === "letter" ? "chữ" : "số"
        }.`,
      });
    }

    // Cập nhật
    gradeRecord.regularAssessments = regularAssessments;
    gradeRecord.midterm = midterm;
    gradeRecord.final = final;
    gradeRecord.average = calculateSemesterAverage(
      regularAssessments,
      midterm,
      final,
      gradingType
    );

    await gradeRecord.save();

    res.json({ message: "Cập nhật bảng điểm thành công", gradeRecord });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// Xoá điểm (DELETE)
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
