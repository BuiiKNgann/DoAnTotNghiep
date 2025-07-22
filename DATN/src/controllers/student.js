import { User, StudentProfile, ParentChildren } from "../models/User.js";
import TeacherAssignment from "../models/TeacherAssignment.js";

import Class from "../models/Class";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const createStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      gender,
      dateOfBirth,
      studentCode,
      grade,
      academicYear,
      classId,
      parentId,
    } = req.body;

    const avatarFile = req.file;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Upload ảnh lên Cloudinary nếu có
    let avatarUrl = null;
    if (avatarFile) {
      const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
        resource_type: "image",
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      gender,
      dateOfBirth,
      avatarUrl,
      role: "student",
    });

    const savedUser = await newUser.save();

    // Tạo hồ sơ học sinh
    // const newStudentProfile = new StudentProfile({
    //   user: savedUser._id,
    //   studentCode,
    //   grade,
    //   academicYear,
    //   class: classId || null,
    //   parent: parentId || null,
    // });
    let nextCode = "01";
    if (classId) {
      const studentsInClass = await StudentProfile.find({
        class: classId,
      }).countDocuments();
      nextCode = (studentsInClass + 1).toString().padStart(2, "0");
    }

    const newStudentProfile = new StudentProfile({
      user: savedUser._id,
      studentCode: nextCode,
      grade,
      academicYear,
      class: classId || null,
      parent: parentId || null,
    });

    const savedStudentProfile = await newStudentProfile.save();

    // Thêm học sinh vào lớp nếu có classId
    if (classId) {
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { students: savedStudentProfile._id },
      });
    }
    // Thêm học sinh vào danh sách con của phụ huynh
    if (parentId) {
      await ParentChildren.findOneAndUpdate(
        { parent: parentId },
        { $addToSet: { children: savedStudentProfile._id } },
        { upsert: true, new: true }
      );
    }
    return res.status(201).json({
      message: "Tạo học sinh thành công",
      student: savedStudentProfile,
    });
  } catch (err) {
    console.error("Lỗi khi tạo học sinh:", err);
    return res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
//Get danh sách học sinh
export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find()
      .populate("user", "-password")
      .populate("parent", "fullName email")
      .populate("class", "className grade academicYear");

    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách học sinh" });
  }
};

//Get chi tiết học sinh
export const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await StudentProfile.findById(id)
      .populate("user", "-password")
      .populate("parent", "fullName email")
      .populate("class", "className grade academicYear");

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy học sinh" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
//Cập nhật học sinh
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    gender,
    dateOfBirth,
    studentCode,
    grade,
    academicYear,
    classId,
    parentId,
  } = req.body;
  const avatarFile = req.file;

  try {
    const studentProfile = await StudentProfile.findById(id);
    if (!studentProfile) {
      return res.status(404).json({ message: "Không tìm thấy học sinh" });
    }

    const user = await User.findById(studentProfile.user);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy tài khoản người dùng" });
    }

    // Upload avatar nếu có
    let avatarUrl = user.avatarUrl;
    if (avatarFile) {
      const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    // Cập nhật thông tin user
    user.fullName = fullName || user.fullName;
    user.gender = gender || user.gender;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.avatarUrl = avatarUrl;
    await user.save();

    // Cập nhật StudentProfile
    studentProfile.studentCode = studentCode || studentProfile.studentCode;
    studentProfile.grade = grade || studentProfile.grade;
    studentProfile.academicYear = academicYear || studentProfile.academicYear;
    studentProfile.class = classId || studentProfile.class;
    studentProfile.parent = parentId || studentProfile.parent;
    await studentProfile.save();

    // Đồng bộ lớp học
    if (classId) {
      await Class.findByIdAndUpdate(classId, {
        $addToSet: { students: studentProfile._id },
      });
    }

    // Đồng bộ phụ huynh
    if (parentId) {
      await ParentChildren.findOneAndUpdate(
        { parent: parentId },
        { $addToSet: { children: studentProfile._id } },
        { upsert: true }
      );
    }

    res.json({
      message: "Cập nhật học sinh thành công",
      student: studentProfile,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const studentProfile = await StudentProfile.findById(id);
    if (!studentProfile) {
      return res.status(404).json({ message: "Không tìm thấy học sinh" });
    }

    // Xoá khỏi lớp học
    if (studentProfile.class) {
      await Class.findByIdAndUpdate(studentProfile.class, {
        $pull: { students: studentProfile._id },
      });
    }

    // Xoá khỏi danh sách con của phụ huynh
    if (studentProfile.parent) {
      await ParentChildren.findOneAndUpdate(
        { parent: studentProfile.parent },
        { $pull: { children: studentProfile._id } }
      );
    }

    // Xoá tài khoản user
    await User.findByIdAndDelete(studentProfile.user);

    // Xoá hồ sơ
    await StudentProfile.findByIdAndDelete(id);

    res.json({ message: "Xoá học sinh thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
export const getStudentsByClassSubjectSemester = async (req, res) => {
  console.log("classId:", req.query.classId);
  console.log("subjectId:", req.query.subjectId);
  console.log("semesterId:", req.query.semesterId);

  const { classId, subjectId, semesterId } = req.query;

  if (!classId || !subjectId || !semesterId) {
    return res
      .status(400)
      .json({ message: "Thiếu classId, subjectId hoặc semesterId" });
  }

  try {
    // 1. Kiểm tra xem lớp đó có được phân công môn học đó trong học kỳ đó không
    const assignment = await TeacherAssignment.findOne({
      class: classId,
      subject: subjectId,
      semester: semesterId,
    });

    if (!assignment) {
      return res.status(404).json({
        message: "Không tìm thấy phân công môn học cho lớp và học kỳ đã chọn.",
      });
    }

    // 2. Tìm tất cả học sinh trong lớp
    const studentsInClass = await StudentProfile.find({
      class: classId,
    }).populate("user");

    return res.json(studentsInClass);
  } catch (err) {
    console.error("Lỗi khi lọc học sinh theo lớp, môn và học kỳ:", err);
    return res.status(500).json({ message: "Lỗi server khi lọc học sinh." });
  }
};
export const getStudentsByClassAndSemester = async (req, res) => {
  const { classId, semesterId } = req.query;

  if (!classId || !semesterId) {
    return res.status(400).json({ message: "Thiếu classId hoặc semesterId" });
  }

  try {
    const students = await StudentProfile.find({ class: classId }).populate(
      "user",
      "-password"
    );

    return res.json(students);
  } catch (err) {
    console.error("Lỗi khi lọc học sinh theo lớp và học kỳ:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
