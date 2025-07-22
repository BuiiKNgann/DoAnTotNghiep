import { TeacherProfile } from "../models/TeacherProfile.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// // Tạo giáo viên
// export const createTeacher = async (req, res) => {
//   try {
//     const {
//       fullName,
//       email,
//       password,
//       gender,
//       dateOfBirth,
//       teacherCode,
//       subject,
//       department,
//       phone,
//     } = req.body;

//     const avatarFile = req.file;

//     // Kiểm tra email trùng
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email đã tồn tại" });
//     }

//     // Upload avatar nếu có
//     let avatarUrl = null;
//     if (avatarFile) {
//       const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
//         folder: "avatars",
//       });
//       avatarUrl = uploadResult.secure_url;
//     }

//     // Tạo user
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//       gender,
//       dateOfBirth,
//       avatarUrl,
//       role: "teacher",
//     });
//     const savedUser = await newUser.save();

//     // Tạo hồ sơ giáo viên
//     const teacher = await TeacherProfile.create({
//       user: savedUser._id,
//       teacherCode,
//       subject,
//       department,
//       phone,
//     });

//     res.status(201).json({ message: "Tạo giáo viên thành công", teacher });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi tạo giáo viên: " + err.message });
//   }
// };

// // ✅ Lấy tất cả giáo viên
// // export const getAllTeachers = async (req, res) => {
// //   try {
// //     const teachers = await TeacherProfile.find().populate("user");
// //     res.json({ teachers });
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ message: "Lỗi lấy danh sách giáo viên: " + err.message });
// //   }
// // };
// // controllers/teacher.js
// export const getAllTeachers = async (req, res) => {
//   try {
//     const { subjectId } = req.query;

//     let filter = {};
//     if (subjectId) {
//       filter.subjects = subjectId;
//     }

//     const teachers = await TeacherProfile.find(filter).populate("user");
//     res.json({ teachers });
//   } catch (error) {
//     console.error("Lỗi khi lấy giáo viên:", error);
//     res.status(500).json({ message: "Lỗi khi lấy danh sách giáo viên" });
//   }
// };

// // ✅ Lấy 1 giáo viên theo ID
// export const getTeacherById = async (req, res) => {
//   try {
//     const teacher = await TeacherProfile.findById(req.params.id).populate(
//       "user"
//     );
//     if (!teacher)
//       return res.status(404).json({ message: "Không tìm thấy giáo viên" });
//     res.json(teacher);
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi: " + err.message });
//   }
// };

// // ✅ Cập nhật thông tin giáo viên
// export const updateTeacher = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       fullName,
//       gender,
//       dateOfBirth,
//       teacherCode,
//       subject,
//       department,
//       phone,
//     } = req.body;
//     const avatarFile = req.file;

//     const teacher = await TeacherProfile.findById(id);
//     if (!teacher) {
//       return res.status(404).json({ message: "Không tìm thấy giáo viên" });
//     }

//     const user = await User.findById(teacher.user);
//     if (!user) {
//       return res
//         .status(404)
//         .json({ message: "Không tìm thấy người dùng giáo viên" });
//     }

//     // Upload avatar nếu có
//     let avatarUrl = user.avatarUrl;
//     if (avatarFile) {
//       const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
//         folder: "avatars",
//       });
//       avatarUrl = uploadResult.secure_url;
//     }

//     // Cập nhật user
//     user.fullName = fullName || user.fullName;
//     user.gender = gender || user.gender;
//     user.dateOfBirth = dateOfBirth || user.dateOfBirth;
//     user.avatarUrl = avatarUrl;
//     await user.save();

//     // Cập nhật teacher profile
//     teacher.teacherCode = teacherCode || teacher.teacherCode;
//     teacher.subject = subject || teacher.subject;
//     teacher.department = department || teacher.department;
//     teacher.phone = phone || teacher.phone;
//     await teacher.save();

//     res.json({ message: "Cập nhật giáo viên thành công", teacher });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi cập nhật giáo viên: " + err.message });
//   }
// };

// // ✅ Xoá giáo viên
// export const deleteTeacher = async (req, res) => {
//   try {
//     const profile = await TeacherProfile.findById(req.params.id);
//     if (!profile)
//       return res.status(404).json({ message: "Không tìm thấy giáo viên" });

//     // Xoá User kèm theo
//     await User.findByIdAndDelete(profile.user);
//     await profile.deleteOne();

//     res.json({ message: "Đã xoá giáo viên thành công" });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi xoá: " + err.message });
//   }
// };
export const createTeacher = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      gender,
      dateOfBirth,
      teacherCode,
      subjects,
      department,
      phone,
    } = req.body;

    const avatarFile = req.file;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    let avatarUrl = null;
    if (avatarFile) {
      const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
      avatarUrl,
      role: "teacher",
    });
    const savedUser = await newUser.save();

    const teacher = await TeacherProfile.create({
      user: savedUser._id,
      teacherCode,
      subjects,
      department,
      phone,
    });

    res.status(201).json({ message: "Tạo giáo viên thành công", teacher });
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo giáo viên: " + err.message });
  }
};
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullName,
      gender,
      dateOfBirth,
      teacherCode,
      subjects,
      department,
      phone,
    } = req.body;
    const avatarFile = req.file;

    const teacher = await TeacherProfile.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: "Không tìm thấy giáo viên" });
    }

    const user = await User.findById(teacher.user);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng giáo viên" });
    }

    let avatarUrl = user.avatarUrl;
    if (avatarFile) {
      const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    // Cập nhật user
    user.fullName = fullName || user.fullName;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.avatarUrl = avatarUrl;
    await user.save();

    // Cập nhật teacher profile
    teacher.teacherCode = teacherCode || teacher.teacherCode;
    teacher.subjects = subjects || teacher.subjects; // ✅ cập nhật mảng
    teacher.department = department || teacher.department;
    teacher.phone = phone || teacher.phone;
    await teacher.save();

    res.json({ message: "Cập nhật giáo viên thành công", teacher });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật giáo viên: " + err.message });
  }
};
export const getAllTeachers = async (req, res) => {
  try {
    const { subjectId } = req.query;

    const filter = subjectId ? { subjects: subjectId } : {};

    const teachers = await TeacherProfile.find(filter)
      .populate("user")
      .populate("subjects");
    res.json({ teachers });
  } catch (error) {
    console.error("Lỗi khi lấy giáo viên:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách giáo viên" });
  }
};
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await TeacherProfile.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Không tìm thấy giáo viên" });
    }

    // Xoá user liên kết nếu có
    if (teacher.user) {
      await User.findByIdAndDelete(teacher.user);
    }

    // Xoá teacher profile
    await TeacherProfile.findByIdAndDelete(req.params.id);

    res.json({ message: "Đã xoá giáo viên thành công" });
  } catch (err) {
    console.error("Lỗi xoá giáo viên:", err);
    res.status(500).json({ message: "Lỗi xoá giáo viên: " + err.message });
  }
};
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await TeacherProfile.findById(req.params.id)
      .populate("user")
      .populate("subjects"); // populate tất cả các môn học mà giáo viên dạy

    if (!teacher) {
      return res.status(404).json({ message: "Không tìm thấy giáo viên" });
    }

    res.json(teacher);
  } catch (err) {
    console.error("Lỗi khi lấy giáo viên:", err);
    res.status(500).json({ message: "Lỗi: " + err.message });
  }
};
