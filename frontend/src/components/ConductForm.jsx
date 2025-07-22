import { useEffect, useState } from "react";
import axios from "../ultils/axios";
import PropTypes from "prop-types";
const ConductForm = ({ selectedClass, selectedSemester, onBack }) => {
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [conductMap, setConductMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedClass || !selectedSemester) return;

    setLoading(true);
    axios
      .get("/api/student/filter-by-class-semester", {
        params: {
          classId: selectedClass,
          semesterId: selectedSemester,
        },
      })
      .then((res) => {
        setStudents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy học sinh:", err);
        setLoading(false);
      });
  }, [selectedClass, selectedSemester]);

  useEffect(() => {
    if (!selectedClass || !selectedSemester) return;

    axios
      .get("/api/attendance/count-by-student", {
        params: {
          classId: selectedClass,
          semesterId: selectedSemester,
        },
      })
      .then((res) => {
        const map = {};
        res.data?.forEach((record) => {
          map[record.student._id] = record.totalAbsents;
        });
        setAttendanceMap(map);
      })
      .catch((err) => console.error("Lỗi khi lấy điểm danh:", err));

    axios
      .get("/api/conduct", {
        params: {
          classId: selectedClass,
          semesterId: selectedSemester,
        },
      })
      .then((res) => {
        const map = {};
        res.data?.forEach((record) => {
          map[record.student._id] = record.rating;
        });
        setConductMap(map);
      })
      .catch((err) => console.error("Lỗi khi lấy hạnh kiểm:", err));
  }, [selectedClass, selectedSemester]);

  const handleConductChange = (studentId, value) => {
    setConductMap((prev) => ({
      ...prev,
      [studentId]: value,
    }));
  };

  const handleSave = () => {
    const data = students.map((student) => ({
      student: student._id,
      class: selectedClass,
      semester: selectedSemester,
      rating: conductMap[student._id] || "Tốt",
    }));

    axios
      .post("/api/conduct/bulk-update", data)
      .then(() => {
        alert("Lưu thành công!");
      })
      .catch((err) => {
        console.error("Lỗi khi lưu hạnh kiểm:", err);
        alert("Lưu thất bại.");
      });
  };

  if (loading) return <p>Đang tải dữ liệu học sinh...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Quản lý hạnh kiểm</h2>
      <table className="table-auto w-full border border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">STT</th>
            <th className="border px-4 py-2">Họ và tên</th>
            <th className="border px-4 py-2">Số buổi nghỉ</th>
            <th className="border px-4 py-2">Hạnh kiểm</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student._id} className="text-center">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{student.fullName}</td>
              <td className="border px-4 py-2">
                {attendanceMap[student._id] || 0}
              </td>
              <td className="border px-4 py-2">
                <select
                  value={conductMap[student._id] || ""}
                  onChange={(e) =>
                    handleConductChange(student._id, e.target.value)
                  }
                  className="border p-1"
                >
                  <option value="">-- Chọn --</option>
                  <option value="Tốt">Tốt</option>
                  <option value="Khá">Khá</option>
                  <option value="Trung bình">Trung bình</option>
                  <option value="Yếu">Yếu</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Quay lại
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Lưu
        </button>
      </div>
    </div>
  );
};

export default ConductForm;
ConductForm.propTypes = {
  selectedClass: PropTypes.string.isRequired,
  selectedSemester: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
};
