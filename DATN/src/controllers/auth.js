import { ParentChildren, StudentProfile, User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validate/user.js";
import Class from "../models/Class.js";

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES = process.env.TOKEN_EXPIRES || "1d";

// Đăng ký
export const register = async (req, res) => {
  try {
    // Validate dữ liệu đầu vào
    const { error, value } = registerSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { fullName, email, password, role, gender, dateOfBirth } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      gender,
      dateOfBirth,
    });

    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((d) => d.message);
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRES || "1d" }
    );

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Lấy hồ sơ cá nhân

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId).select(
      "fullName email gender dateOfBirth avatarUrl role"
    );

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    let studentProfile = null;

    if (user.role === "student") {
      const rawStudent = await StudentProfile.findOne({ user: userId })
        .populate({
          path: "class",
          populate: {
            path: "homeroomTeacher",
            select: "fullName email avatarUrl",
          },
        })
        .populate({
          path: "user",
          select: "fullName email avatarUrl",
        })
        .populate({
          path: "parent",

          select: "fullName email avatarUrl",
        });

      studentProfile = rawStudent ? rawStudent.toObject() : null;
    }

    return res.json({
      message: "Lấy thông tin thành công",
      user,
      studentProfile,
    });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// Cập nhật hồ sơ cá nhân
export const updateProfile = async (req, res) => {
  const userId = req.user.userId;

  const { error, value } = updateProfileSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors });
  }

  const {
    fullName,
    gender,
    dateOfBirth,
    studentCode,
    grade,
    academicYear,
    classId,
    childrenIds,
    parentUserId,
  } = value;
  const avatarFile = req.file;

  try {
    let avatarUrl;

    if (avatarFile) {
      const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
        resource_type: "image",
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName,
        gender,
        dateOfBirth,
        ...(avatarUrl && { avatarUrl }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Nếu là học sinh: cập nhật StudentProfile + thêm vào lớp
    if (updatedUser.role === "student") {
      const studentProfile = await StudentProfile.findOneAndUpdate(
        { user: userId },
        {
          studentCode,
          grade,
          academicYear,
          class: classId,
          parent: parentUserId,
        },
        { upsert: true, new: true }
      );

      // Đồng bộ vào lớp học nếu classId tồn tại
      if (classId && studentProfile) {
        await Class.findByIdAndUpdate(classId, {
          $addToSet: { students: studentProfile._id },
        });
      }
    }

    // Nếu là phụ huynh: cập nhật danh sách con
    if (updatedUser.role === "parent") {
      await ParentChildren.findOneAndUpdate(
        { parent: userId },
        { children: childrenIds },
        { upsert: true }
      );
    }

    return res.json({
      message: "Cập nhật thành công",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ error: "Lỗi server: " + err.message });
  }
};
