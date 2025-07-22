import { ParentChildren, StudentProfile, User } from "../models/User.js";

export const addChildrenToParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { childIds } = req.body; // mảng studentProfile._id

    // 1. Kiểm tra phụ huynh hợp lệ
    const parent = await User.findById(parentId);
    if (!parent || parent.role !== "parent") {
      return res.status(404).json({ message: "Không tìm thấy phụ huynh" });
    }

    // 2. Kiểm tra học sinh đã thuộc về phụ huynh khác chưa
    const existingRelations = await ParentChildren.find({
      children: { $in: childIds },
    });

    const conflictedIds = new Set();

    for (const relation of existingRelations) {
      if (relation.parent.toString() !== parentId) {
        for (const child of relation.children) {
          if (childIds.includes(child.toString())) {
            conflictedIds.add(child.toString());
          }
        }
      }
    }

    // 3. Nếu có học sinh đã gán cho phụ huynh khác → báo lỗi đơn giản
    if (conflictedIds.size > 0) {
      return res.status(400).json({
        message: "Học sinh đã có phụ huynh khác",
      });
    }

    // 4. Thêm học sinh vào danh sách con của phụ huynh
    let relation = await ParentChildren.findOne({ parent: parentId });

    if (!relation) {
      relation = await ParentChildren.create({
        parent: parentId,
        children: childIds,
      });
    } else {
      relation.children.push(...childIds);
      relation.children = [
        ...new Set(relation.children.map((id) => id.toString())),
      ];
      await relation.save();
    }

    res.json({ message: "Thêm con thành công", relation });
  } catch (err) {
    console.error("❌ Lỗi khi thêm con:", err);
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const getChildrenOfParent = async (req, res) => {
  try {
    const { parentId } = req.params;

    const relation = await ParentChildren.findOne({
      parent: parentId,
    }).populate({
      path: "children",
      populate: [
        { path: "user", select: "fullName gender dateOfBirth" },
        { path: "class", select: "className grade academicYear" },
      ],
    });

    if (!relation) {
      return res.json({ message: "Phụ huynh chưa có con nào", children: [] });
    }

    res.json({
      message: "Lấy danh sách con thành công",
      children: relation.children,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

export const removeChildFromParent = async (req, res) => {
  try {
    const { parentId, childId } = req.params;

    const relation = await ParentChildren.findOne({ parent: parentId });
    if (!relation) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy quan hệ phụ huynh - con" });
    }

    relation.children = relation.children.filter(
      (id) => id.toString() !== childId
    );
    await relation.save();

    res.json({ message: "Xóa con khỏi phụ huynh thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};
