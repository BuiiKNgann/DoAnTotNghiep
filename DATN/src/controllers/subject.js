// import Subject from "../models/Subject.js";

// // ✅ CREATE Subject

// export const createSubject = async (req, res) => {
//   try {
//     const { name, code, isRequired, semesters, periodsPerYear } = req.body;

//     if (!periodsPerYear || isNaN(periodsPerYear) || periodsPerYear <= 0) {
//       return res.status(400).json({ message: "Vui lòng nhập số tiết hợp lệ" });
//     }

//     const newSubject = await Subject.create({
//       name,
//       code,
//       isRequired,
//       semesters,
//       periodsPerYear,
//     });

//     res
//       .status(201)
//       .json({ message: "Tạo môn học thành công", subject: newSubject });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server: " + err.message });
//   }
// };

// // ✅ READ - Get all Subjects
// export const getSubjects = async (req, res) => {
//   try {
//     const subjects = await Subject.find().populate("semesters");
//     res.json({ message: "Lấy danh sách môn học thành công", subjects });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server: " + err.message });
//   }
// };

// // ✅ READ - Get single Subject
// export const getSubjectById = async (req, res) => {
//   try {
//     const subject = await Subject.findById(req.params.id).populate("semesters");
//     if (!subject)
//       return res.status(404).json({ message: "Không tìm thấy môn học" });

//     res.json({ message: "Lấy môn học thành công", subject });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server: " + err.message });
//   }
// };

// // ✅ UPDATE Subject
// // export const updateSubject = async (req, res) => {
// //   try {
// //     const { name, code, isRequired, semesters } = req.body;

// //     const updated = await Subject.findByIdAndUpdate(
// //       req.params.id,
// //       { name, code, isRequired, semesters },
// //       { new: true }
// //     );

// //     if (!updated)
// //       return res.status(404).json({ message: "Không tìm thấy môn học" });

// //     res.json({ message: "Cập nhật môn học thành công", subject: updated });
// //   } catch (err) {
// //     res.status(500).json({ message: "Lỗi server: " + err.message });
// //   }
// // };
// export const updateSubject = async (req, res) => {
//   try {
//     const { name, code, isRequired, semesters, periodsPerYear } = req.body;

//     if (!periodsPerYear || isNaN(periodsPerYear) || periodsPerYear <= 0) {
//       return res.status(400).json({ message: "Vui lòng nhập số tiết hợp lệ" });
//     }

//     const updated = await Subject.findByIdAndUpdate(
//       req.params.id,
//       { name, code, isRequired, semesters, periodsPerYear },
//       { new: true }
//     );

//     if (!updated)
//       return res.status(404).json({ message: "Không tìm thấy môn học" });

//     res.json({ message: "Cập nhật môn học thành công", subject: updated });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server: " + err.message });
//   }
// };

// // ✅ DELETE Subject
// export const deleteSubject = async (req, res) => {
//   try {
//     const deleted = await Subject.findByIdAndDelete(req.params.id);
//     if (!deleted)
//       return res.status(404).json({ message: "Không tìm thấy môn học" });

//     res.json({ message: "Xóa môn học thành công" });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server: " + err.message });
//   }
// };

import Subject from "../models/Subject.js";

// ✅ CREATE Subject
export const createSubject = async (req, res) => {
  try {
    const { name, code, isRequired, semesters, periodsPerYear, gradingType } =
      req.body;

    // Kiểm tra periodsPerYear
    if (!periodsPerYear || isNaN(periodsPerYear) || periodsPerYear <= 0) {
      return res.status(400).json({ message: "Vui lòng nhập số tiết hợp lệ" });
    }

    // Kiểm tra gradingType
    if (!["numerical", "letter"].includes(gradingType)) {
      return res
        .status(400)
        .json({ message: "gradingType phải là 'numerical' hoặc 'letter'" });
    }

    const newSubject = await Subject.create({
      name,
      code,
      isRequired,
      semesters,
      periodsPerYear,
      gradingType,
    });

    res
      .status(201)
      .json({ message: "Tạo môn học thành công", subject: newSubject });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ READ - Get all Subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("semesters");
    res.json({ message: "Lấy danh sách môn học thành công", subjects });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ READ - Get single Subject
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("semesters");
    if (!subject)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    res.json({ message: "Lấy môn học thành công", subject });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ UPDATE Subject
export const updateSubject = async (req, res) => {
  try {
    const { name, code, isRequired, semesters, periodsPerYear, gradingType } =
      req.body;

    // Kiểm tra periodsPerYear
    if (!periodsPerYear || isNaN(periodsPerYear) || periodsPerYear <= 0) {
      return res.status(400).json({ message: "Vui lòng nhập số tiết hợp lệ" });
    }

    // Kiểm tra gradingType
    if (!["numerical", "letter"].includes(gradingType)) {
      return res
        .status(400)
        .json({ message: "gradingType phải là 'numerical' hoặc 'letter'" });
    }

    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, code, isRequired, semesters, periodsPerYear, gradingType },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    res.json({ message: "Cập nhật môn học thành công", subject: updated });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// ✅ DELETE Subject
export const deleteSubject = async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    res.json({ message: "Xóa môn học thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
