import { useEffect, useState } from "react";
import axios from "../ultils/axios";
import PropTypes from "prop-types";

const TimetableForm = ({ onSubmit, loading, semesterOptions }) => {
  const [formData, setFormData] = useState({
    dayOfWeek: "Thứ 2",
    period: 1,
    classId: "",
    subjectId: "",
    teacherId: "",
    semester: "",
  });

  const [classOptions, setClassOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]);

  // Load lớp & môn khi khởi tạo
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cls, sub] = await Promise.all([
          axios.get("/api/classes"),
          axios.get("/api/subjects"),
        ]);
        setClassOptions(cls.data.classes || []);
        setSubjectOptions(sub.data.subjects || []);
      } catch (err) {
        console.error("Lỗi khi tải lớp hoặc môn học:", err);
      }
    };

    fetchInitialData();
  }, []);

  // Load giáo viên theo môn học
  useEffect(() => {
    const fetchTeachersBySubject = async () => {
      if (!formData.subjectId) {
        setTeacherOptions([]);
        return;
      }

      try {
        const res = await axios.get(
          `/api/teachers?subjectId=${formData.subjectId}`
        );
        setTeacherOptions(res.data.teachers || []);
      } catch (err) {
        console.error("Lỗi khi tải giáo viên theo môn:", err);
      }
    };

    fetchTeachersBySubject();
  }, [formData.subjectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "subjectId" ? { teacherId: "" } : {}), // reset teacherId khi đổi môn
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 rounded shadow-md"
    >
      {/* LỚP */}
      <div>
        <label className="block text-sm font-medium">Lớp</label>
        <select
          name="classId"
          value={formData.classId}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="">-- Chọn lớp --</option>
          {classOptions.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}
            </option>
          ))}
        </select>
      </div>

      {/* HỌC KỲ */}
      <div>
        <label className="block text-sm font-medium">Học kỳ</label>
        <select
          name="semester"
          value={formData.semester}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="">-- Chọn học kỳ --</option>
          {semesterOptions.map((sem) => (
            <option key={sem._id} value={sem._id}>
              {sem.name}
            </option>
          ))}
        </select>
      </div>

      {/* THỨ */}
      <div>
        <label className="block text-sm font-medium">Thứ</label>
        <select
          name="dayOfWeek"
          value={formData.dayOfWeek}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
        >
          {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* TIẾT */}
      <div>
        <label className="block text-sm font-medium">Tiết</label>
        <input
          type="number"
          name="period"
          value={formData.period}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded"
          min={1}
          max={10}
        />
      </div>

      {/* MÔN */}
      <div>
        <label className="block text-sm font-medium">Môn học</label>
        <select
          name="subjectId"
          value={formData.subjectId}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="">-- Chọn môn học --</option>
          {subjectOptions.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* GIÁO VIÊN */}
      <div>
        <label className="block text-sm font-medium">Giáo viên</label>
        <select
          name="teacherId"
          value={formData.teacherId}
          onChange={handleChange}
          required
          className="w-full mt-1 p-2 border rounded"
        >
          <option value="">-- Chọn giáo viên --</option>
          {teacherOptions.map((teacher) => (
            <option key={teacher._id} value={teacher._id}>
              {teacher.user?.fullName || "Không tên"}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Đang xử lý..." : "Lưu thời khóa biểu"}
      </button>
    </form>
  );
};

TimetableForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  semesterOptions: PropTypes.array.isRequired,
};

export default TimetableForm;
