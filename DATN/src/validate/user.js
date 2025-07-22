import Joi from "joi";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

// Schema kiểm tra dữ liệu
export const registerSchema = Joi.object({
  fullName: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Họ tên không được để trống",
    "string.min": "Họ tên quá ngắn",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "email không được để trống",
    "any.required": "email là bắt buộc",
    "string.email": "Email không đúng định dạng",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu phải ít nhất 6 ký tự",
    "string.empty": "Mật khẩu là bắt buộc",
  }),
  role: Joi.string()
    .valid("admin", "teacher", "parent", "student")
    .required()
    .messages({
      "any.only": "Vai trò không hợp lệ",
    }),
  gender: Joi.string().valid("male", "female", "other").required(),
  dateOfBirth: Joi.date().less("now").required().messages({
    "date.less": "Ngày sinh phải là quá khứ",
  }),
});
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "string.empty": "Email là bắt buộc",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Mật khẩu phải ít nhất 6 ký tự",
    "string.empty": "Mật khẩu là bắt buộc",
  }),
});

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().min(3).max(100),
  gender: Joi.string().valid("male", "female", "other").optional(),
  dateOfBirth: Joi.date().optional(),

  //Các field liên quan đến học sinh
  studentCode: Joi.string().optional(),
  grade: Joi.string().optional(),
  academicYear: Joi.string().optional(),
  classId: Joi.string().optional(),

  //phụ huynh có thể thêm danh sách con
  childrenIds: Joi.array().items(Joi.string()).optional(),
  parentUserId: Joi.string().optional(),
});
