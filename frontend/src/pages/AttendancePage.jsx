import { useState, useEffect } from "react";
import axios from "../ultils/axios.js";
import AttendanceForm from "../components/AttendanceForm";

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  useEffect(() => {
    axios
      .get("/api/classes")
      .then((res) => {
        setClasses(res.data.classes || []);
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Lỗi tải danh sách lớp");
      });

    axios
      .get("/api/semesters")
      .then((res) => {
        setSemesters(res.data.semesters || []);
      })
      .catch((err) => {
        console.error(err);
        alert(err.response?.data?.message || "Lỗi tải danh sách học kỳ");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Điểm danh học sinh</h1>

      <div className="mb-4 flex gap-4">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">-- Chọn lớp --</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}
            </option>
          ))}
        </select>

        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">-- Chọn học kỳ --</option>
          {semesters.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {selectedClass && selectedSemester && (
        <AttendanceForm classId={selectedClass} semesterId={selectedSemester} />
      )}
    </div>
  );
};

export default AttendancePage;
