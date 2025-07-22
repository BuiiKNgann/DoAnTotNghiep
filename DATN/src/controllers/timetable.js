import Timetable from "../models/Timetable.js";

export const getTimetable = async (req, res) => {
  const { classId, semesterId } = req.query;

  try {
    const timetable = await Timetable.find({
      class: classId,
      semester: semesterId,
    })
      .populate("class")
      .populate("semester")
      .populate("periods.subject")
      .populate("periods.teacher");

    res.json(timetable);
  } catch (err) {
    console.error("Error fetching timetable:", err);
    res.status(500).json({ error: "Lỗi khi lấy thời khóa biểu" });
  }
};

// export const createOrUpdateTimetable = async (req, res) => {
//   const { classId, semesterId, dayOfWeek, periods } = req.body;

//   try {
//     let timetable = await Timetable.findOne({
//       class: classId,
//       semester: semesterId,
//       dayOfWeek,
//     });

//     if (timetable) {
//       timetable.periods = periods;
//       await timetable.save();
//       return res.json({
//         message: "Cập nhật thời khóa biểu thành công",
//         data: timetable,
//       });
//     }

//     timetable = new Timetable({
//       class: classId,
//       semester: semesterId,
//       dayOfWeek,
//       periods,
//     });
//     await timetable.save();

//     res
//       .status(201)
//       .json({ message: "Tạo thời khóa biểu mới thành công", data: timetable });
//   } catch (err) {
//     console.error("Error creating/updating timetable:", err);
//     res.status(500).json({ error: "Lỗi khi tạo hoặc cập nhật thời khóa biểu" });
//   }
// };
// Xóa thời khóa biểu theo classId + semesterId
export const createOrUpdateTimetable = async (req, res) => {
  const { classId, semesterId, dayOfWeek, periods } = req.body;

  console.log("Nhận payload:", req.body);

  try {
    let timetable = await Timetable.findOne({
      class: classId,
      semester: semesterId,
      dayOfWeek,
    });

    if (timetable) {
      timetable.periods = periods;
      await timetable.save();
      return res.json({
        message: "Cập nhật thời khóa biểu thành công",
        data: timetable,
      });
    }

    timetable = new Timetable({
      class: classId,
      semester: semesterId,
      dayOfWeek,
      periods,
    });

    await timetable.save();

    res
      .status(201)
      .json({ message: "Tạo thời khóa biểu mới thành công", data: timetable });
  } catch (err) {
    console.error("❌ Error creating/updating timetable:", err);
    res.status(500).json({ error: "Lỗi khi tạo hoặc cập nhật thời khóa biểu" });
  }
};

export const deleteTimetable = async (req, res) => {
  try {
    const { classId, semesterId } = req.query;

    if (!classId || !semesterId)
      return res.status(400).json({ message: "Thiếu classId hoặc semesterId" });

    const deleted = await Timetable.findOneAndDelete({
      class: classId,
      semester: semesterId,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thời khóa biểu để xoá" });
    }

    res.json({ message: "Xóa thời khóa biểu thành công", data: deleted });
  } catch (error) {
    console.error("Lỗi xoá thời khóa biểu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
// Cập nhật thời khóa biểu (thay đổi các periods)
export const updateTimetable = async (req, res) => {
  try {
    const { classId, semesterId, periods } = req.body;

    if (!classId || !semesterId)
      return res.status(400).json({ message: "Thiếu classId hoặc semesterId" });

    const updated = await Timetable.findOneAndUpdate(
      { class: classId, semester: semesterId },
      { periods },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thời khóa biểu để cập nhật" });
    }

    res.json({ message: "Cập nhật thời khóa biểu thành công", data: updated });
  } catch (error) {
    console.error("Lỗi cập nhật thời khóa biểu:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
