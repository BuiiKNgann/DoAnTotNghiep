import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../ultils/axios";

const ATTENDANCE_OPTIONS = ["HD", "P", "K"];

const AttendanceForm = ({ classId, semesterId }) => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [records, setRecords] = useState([]);

  // Load danh sách học sinh
  useEffect(() => {
    if (classId) {
      axios
        .get(`/api/attendance/students/${classId}`)
        .then((res) => {
          setStudents(res.data.students);
        })
        .catch((err) => {
          console.error(err);
          alert(err.response?.data?.message || "Lỗi tải danh sách học sinh");
        });
    }
  }, [classId]);

  // Load dữ liệu điểm danh khi chọn ngày
  useEffect(() => {
    if (!date || !classId || !semesterId || students.length === 0) return;

    axios
      .get("/api/attendance/records", {
        params: {
          classId,
          semesterId,
          date,
        },
      })
      .then((res) => {
        const existingRecords = res.data.attendance?.records || [];

        const mapped = students.map((s) => {
          const found = existingRecords.find(
            (r) =>
              r.student === s.studentId || r.student === s.studentId.toString()
          );
          return {
            student: s.studentId,
            morning: found?.morning || "HD",
            afternoon: found?.afternoon || "HD",
          };
        });

        setRecords(mapped);
      })
      .catch((err) => {
        console.error("Lỗi lấy dữ liệu điểm danh theo ngày:", err);
        setRecords(
          students.map((s) => ({
            student: s.studentId,
            morning: "HD",
            afternoon: "HD",
          }))
        );
      });
  }, [date, classId, semesterId, students]);

  const handleChangeStatus = (index, session, value) => {
    const updated = [...records];
    updated[index][session] = value;
    setRecords(updated);
  };

  const handleSubmit = async () => {
    if (!date) {
      alert("Vui lòng chọn ngày");
      return;
    }

    try {
      await axios.post("/api/attendance", {
        classId,
        semester: semesterId,
        date,
        records,
      });
      alert("Lưu điểm danh thành công");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi lưu điểm danh");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label>Ngày điểm danh:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-2 py-1 ml-2"
        />
      </div>

      <div className="mb-4 p-3 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">
          Ghi chú các trạng thái điểm danh:
        </h3>
        <div className="flex gap-4 text-sm flex-wrap">
          <div>
            <span className="font-medium text-blue-600">HD:</span> Hiện diện
          </div>
          <div>
            <span className="font-medium text-blue-600">P:</span> Nghỉ có phép
          </div>
          <div>
            <span className="font-medium text-blue-600">K:</span> Nghỉ không
            phép
          </div>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Mã HS</th>
            <th className="border px-2 py-1">Họ tên</th>
            <th className="border px-2 py-1">Buổi sáng</th>
            <th className="border px-2 py-1">Buổi chiều</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, index) => (
            <tr key={s.studentId}>
              <td className="border px-2 py-1">{index + 1}</td>
              <td className="border px-2 py-1">{s.studentCode}</td>
              <td className="border px-2 py-1">{s.fullName}</td>
              <td className="border px-2 py-1">
                <select
                  value={records[index]?.morning}
                  onChange={(e) =>
                    handleChangeStatus(index, "morning", e.target.value)
                  }
                  className="border"
                >
                  {ATTENDANCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
              <td className="border px-2 py-1">
                <select
                  value={records[index]?.afternoon}
                  onChange={(e) =>
                    handleChangeStatus(index, "afternoon", e.target.value)
                  }
                  className="border"
                >
                  {ATTENDANCE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Lưu điểm danh
      </button>
    </div>
  );
};

AttendanceForm.propTypes = {
  classId: PropTypes.string.isRequired,
  semesterId: PropTypes.string.isRequired,
};

export default AttendanceForm;
