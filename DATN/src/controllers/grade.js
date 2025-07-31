import GradeRecord from "../models/GradeRecord.js";
import Semester from "../models/Semester.js";
import Subject from "../models/Subject.js";
import { StudentProfile } from "../models/User.js";
import YearlyAverage from "../models/YearlyAverage.js";
import mongoose from "mongoose";
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
      ...(gradingType === "letter"
        ? { averageLetter: average }
        : { average: average }),
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
    const average = calculateSemesterAverage(
      regularAssessments,
      midterm,
      final,
      gradingType
    );
    if (gradingType === "letter") {
      gradeRecord.averageLetter = average;
    } else {
      gradeRecord.average = average;
    }

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

export const calculateYearlyAverageByClass = async (req, res) => {
  const { classId, subjectId, yearId, semester1Id, semester2Id } = req.body;

  try {
    let semester1 = null;
    let semester2 = null;

    // Nếu truyền yearId (tùy chọn -- Cả năm --), tự tìm 2 học kỳ
    if (yearId) {
      const semesters = await Semester.find({ year: yearId }).sort({
        order: 1,
      });
      [semester1, semester2] = semesters;
    } else {
      // Nếu truyền trực tiếp học kỳ
      [semester1, semester2] = await Promise.all([
        Semester.findById(semester1Id),
        Semester.findById(semester2Id),
      ]);
    }

    if (!semester1 || !semester2) {
      return res.status(404).json({ message: "Không tìm thấy học kỳ" });
    }

    const students = await StudentProfile.find({ class: classId });
    const results = [];

    for (const student of students) {
      const [record1, record2] = await Promise.all([
        GradeRecord.findOne({
          student: student._id,
          subject: subjectId,
          semester: semester1._id,
        }).populate("subject"),

        GradeRecord.findOne({
          student: student._id,
          subject: subjectId,
          semester: semester2._id,
        }).populate("subject"),
      ]);

      const gradingType =
        record1?.subject?.gradingType || record2?.subject?.gradingType;

      const avg1 = record1
        ? calculateSemesterAverage(
            record1.regularAssessments,
            record1.midterm,
            record1.final,
            gradingType
          )
        : 0;

      const avg2 = record2
        ? calculateSemesterAverage(
            record2.regularAssessments,
            record2.midterm,
            record2.final,
            gradingType
          )
        : 0;

      const yearlyAverage =
        record1 || record2
          ? +(
              (avg1 + avg2 * 2) /
              (record1 && record2 ? 3 : record1 ? 1 : 2)
            ).toFixed(2)
          : null;

      // Lưu hoặc cập nhật vào YearlyGrade
      await YearlyGrade.findOneAndUpdate(
        {
          student: student._id,
          subject: subjectId,
          class: classId,
          year: yearId,
        },
        {
          student: student._id,
          subject: subjectId,
          class: classId,
          year: yearId,
          semester1: semester1._id,
          semester2: semester2._id,
          semester1Average: avg1,
          semester2Average: avg2,
          yearlyAverage,
        },
        { upsert: true, new: true }
      );

      results.push({
        studentId: student._id,
        name: student.name,
        semester1Average: avg1,
        semester2Average: avg2,
        yearlyAverage,
      });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error("Lỗi khi tính trung bình năm:", error);
    res.status(500).json({
      message: "Lỗi máy chủ",
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};
// export const calculateYearlyAverageByClass = async (req, res) => {
//   const { classId, subjectId, semester1Id, semester2Id } = req.body;

//   try {
//     const [semester1, semester2] = await Promise.all([
//       Semester.findById(semester1Id),
//       Semester.findById(semester2Id),
//     ]);

//     if (!semester1 || !semester2) {
//       return res.status(404).json({ message: "Không tìm thấy học kỳ" });
//     }

//     const students = await StudentProfile.find({ class: classId });
//     const results = [];

//     for (const student of students) {
//       const record1 = await GradeRecord.findOne({
//         student: student._id,
//         subject: subjectId,
//         semester: semester1Id,
//       }).populate("subject");

//       const record2 = await GradeRecord.findOne({
//         student: student._id,
//         subject: subjectId,
//         semester: semester2Id,
//       }).populate("subject");

//       const gradingType =
//         record1?.subject?.gradingType || record2?.subject?.gradingType;

//       const avg1 = record1
//         ? calculateSemesterAverage(
//             record1.regularAssessments,
//             record1.midterm,
//             record1.final,
//             gradingType
//           )
//         : null;

//       const avg2 = record2
//         ? calculateSemesterAverage(
//             record2.regularAssessments,
//             record2.midterm,
//             record2.final,
//             gradingType
//           )
//         : null;

//       // ✅ Chỉ tính khi cả avg1 và avg2 đều khác null
//       const yearlyAverage =
//         avg1 !== null && avg2 !== null
//           ? +((avg1 * 1 + avg2 * 2) / 3).toFixed(2)
//           : null;

//       await YearlyAverage.findOneAndUpdate(
//         {
//           student: student._id,
//           class: classId,
//           subject: subjectId,
//         },
//         {
//           semester1: semester1Id,
//           semester2: semester2Id,
//           semester1Average: avg1,
//           semester2Average: avg2,
//           yearlyAverage,
//           calculatedAt: new Date(),
//         },
//         { upsert: true, new: true }
//       );

//       results.push({
//         studentId: student._id,
//         name: student.name,
//         semester1Average: avg1,
//         semester2Average: avg2,
//         yearlyAverage,
//       });
//     }

//     res.status(200).json({ results });
//   } catch (error) {
//     console.error("Lỗi khi tính trung bình năm:", error);
//     res.status(500).json({
//       message: "Lỗi máy chủ",
//       error: {
//         message: error.message,
//         stack: error.stack,
//       },
//     });
//   }
// };
// Lấy điểm trung bình cả năm
// export const getYearlyAverage = async (req, res) => {
//   try {
//     const { classId, subjectId, studentId } = req.query;

//     const query = {
//       ...(classId && { class: classId }),
//       ...(subjectId && { subject: subjectId }),
//       ...(studentId && { student: studentId }),
//     };

//     const records = await YearlyAverage.find(query).populate(
//       "student subject semester1 semester2 class"
//     );

//     const results = records.map((record) => ({
//       _id: record._id,
//       studentId: record.student._id,
//       name: record.student.name,
//       subjectId: record.subject._id,
//       subjectName: record.subject.name,
//       classId: record.class._id,
//       className: record.class.className,
//       semester1Id: record.semester1._id,
//       semester1Name: record.semester1.name,
//       semester1Average: record.semester1Average,
//       semester2Id: record.semester2._id,
//       semester2Name: record.semester2.name,
//       semester2Average: record.semester2Average,
//       yearlyAverage: record.yearlyAverage,
//       calculatedAt: record.calculatedAt,
//     }));

//     res.json({ message: "Lấy điểm trung bình cả năm thành công", results });
//   } catch (err) {
//     console.error("Lỗi khi lấy điểm trung bình cả năm:", err);
//     res.status(500).json({ message: "Lỗi server: " + err.message });
//   }
// };
export const getYearlyAverage = async (req, res) => {
  try {
    const { classId, subjectId, studentId } = req.query;

    // Xây dựng query với các tham số hợp lệ
    const query = {};
    if (classId && mongoose.isValidObjectId(classId)) query.class = classId;
    if (subjectId && mongoose.isValidObjectId(subjectId))
      query.subject = subjectId;
    if (
      studentId &&
      studentId !== "undefined" &&
      mongoose.isValidObjectId(studentId)
    ) {
      query.student = studentId;
    }

    const records = await YearlyAverage.find(query).populate(
      "student subject semester1 semester2 class"
    );

    // Lọc và ánh xạ kết quả
    const results = records
      .filter(
        (record) =>
          record.student && mongoose.isValidObjectId(record.student._id)
      )
      .map((record) => ({
        _id: record._id,
        studentId: record.student._id,
        name: record.student.name || "Không xác định",
        subjectId: record.subject._id,
        subjectName: record.subject.name || "Không xác định",
        classId: record.class._id,
        className: record.class.className || "Không xác định",
        semester1Id: record.semester1?._id,
        semester1Name: record.semester1?.name || "Không xác định",
        semester1Average: record.semester1Average ?? "-",
        semester2Id: record.semester2?._id,
        semester2Name: record.semester2?.name || "Không xác định",
        semester2Average: record.semester2Average ?? "-",
        yearlyAverage: record.yearlyAverage ?? "-",
        calculatedAt: record.calculatedAt,
      }));

    res.json({ message: "Lấy điểm trung bình cả năm thành công", results });
  } catch (err) {
    console.error("Lỗi khi lấy điểm trung bình cả năm:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
export const deleteYearlyAverage = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await YearlyAverage.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi cần xoá" });
    }

    res
      .status(200)
      .json({ message: "Xoá bản ghi trung bình năm thành công", deleted });
  } catch (error) {
    console.error("Lỗi khi xoá bản ghi:", error);
    res.status(500).json({
      message: "Lỗi máy chủ",
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};
export const updateYearlyAverage = async (req, res) => {
  const { id } = req.params;
  const {
    semester1Average,
    semester2Average,
    yearlyAverage,
    semester1,
    semester2,
  } = req.body;

  try {
    const updated = await YearlyAverage.findByIdAndUpdate(
      id,
      {
        semester1Average,
        semester2Average,
        yearlyAverage,
        semester1,
        semester2,
        calculatedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bản ghi để cập nhật" });
    }

    res.status(200).json({ message: "Cập nhật thành công", updated });
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    res.status(500).json({
      message: "Lỗi máy chủ",
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
};
