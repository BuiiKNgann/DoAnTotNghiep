import { User, ParentChildren } from "../models/User.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const getAllParents = async (req, res) => {
  try {
    const parents = await User.find({ role: "parent" }).select(
      "_id fullName email dateOfBirth avatarUrl"
    );

    res.json(parents);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phụ huynh" });
  }
};
export const getParentWithChildren = async (req, res) => {
  try {
    const { id } = req.params;

    const parent = await User.findById(id).select("fullName email");
    if (!parent || parent.role !== "parent") {
      return res.status(404).json({ message: "Không tìm thấy phụ huynh" });
    }

    const parentData = await ParentChildren.findOne({ parent: id }).populate({
      path: "children",
      populate: {
        path: "user",
        select: "fullName gender dateOfBirth avatarUrl",
      },
    });

    res.json({
      parent,
      children: parentData?.children || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin phụ huynh" });
  }
};

export const createParent = async (req, res) => {
  try {
    const { fullName, email, password, gender, dateOfBirth } = req.body;
    const avatarFile = req.file;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashed = await bcrypt.hash(password, 10);

    let avatarUrl;
    if (avatarFile) {
      const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
        resource_type: "image",
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    const parent = await User.create({
      fullName,
      email,
      password: hashed,
      gender,
      dateOfBirth,
      role: "parent",
      ...(avatarUrl && { avatarUrl }),
    });

    res.status(201).json({ message: "Tạo phụ huynh thành công", parent });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tạo phụ huynh: " + err.message });
  }
};
export const updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, gender, dateOfBirth } = req.body;
    const avatarFile = req.file;

    const parent = await User.findById(id);
    if (!parent || parent.role !== "parent") {
      return res.status(404).json({ message: "Không tìm thấy phụ huynh" });
    }

    let avatarUrl = parent.avatarUrl;
    if (avatarFile) {
      const uploadResult = await cloudinary.uploader.upload(avatarFile.path, {
        resource_type: "image",
        folder: "avatars",
      });
      avatarUrl = uploadResult.secure_url;
    }

    parent.fullName = fullName || parent.fullName;
    parent.gender = gender || parent.gender;
    parent.dateOfBirth = dateOfBirth || parent.dateOfBirth;
    parent.avatarUrl = avatarUrl;

    await parent.save();

    res.json({ message: "Cập nhật thành công", parent });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi cập nhật: " + err.message });
  }
};
export const getParentById = async (req, res) => {
  try {
    const parent = await User.findById(req.params.id).select(
      "_id fullName email gender dateOfBirth avatarUrl role"
    );

    if (!parent || parent.role !== "parent") {
      return res.status(404).json({ message: "Không tìm thấy phụ huynh" });
    }

    res.json(parent);
  } catch (err) {
    console.error("Lỗi khi lấy phụ huynh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const deleteParent = async (req, res) => {
  try {
    const parent = await User.findById(req.params.id);
    if (!parent || parent.role !== "parent") {
      return res.status(404).json({ message: "Không tìm thấy phụ huynh" });
    }

    // Optional: Xoá mối quan hệ với con (ParentChildren)
    await ParentChildren.deleteOne({ parent: parent._id });

    // Optional: Xoá avatar Cloudinary nếu muốn (nâng cao)

    await parent.deleteOne();

    res.json({ message: "Xoá phụ huynh thành công" });
  } catch (err) {
    console.error("Lỗi khi xoá phụ huynh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
