import { useEffect, useState } from "react";
import axios from "../ultils/axios";
import TimetableForm from "../components/TimetableForm";

const TimetableManagement = () => {
  const [timetable, setTimetable] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState("");

  const fetchTimetable = async () => {
    if (!selectedClassId || !selectedSemesterId) return;

    try {
      const res = await axios.get(
        `/api/timetable?classId=${selectedClassId}&semesterId=${selectedSemesterId}`
      );
      setTimetable(res.data); // mỗi ngày là 1 object có periods
    } catch (err) {
      console.error("Lỗi khi tải thời khóa biểu:", err);
    }
  };

  const fetchOptions = async () => {
    try {
      const [cls, sem] = await Promise.all([
        axios.get("/api/classes"),
        axios.get("/api/semesters"),
      ]);
      setClassOptions(cls.data.classes || []);
      setSemesterOptions(sem.data.semesters || []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu lớp và học kỳ:", err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        classId: formData.classId,
        semesterId: formData.semester,
        dayOfWeek: formData.dayOfWeek,
        periods: [
          {
            period: formData.period,
            subject: formData.subjectId,
            teacher: formData.teacherId,
          },
        ],
      };

      await axios.post("/api/timetable", payload);
      alert("Tạo thời khóa biểu thành công!");
      fetchTimetable();
    } catch (err) {
      console.error("Lỗi khi tạo thời khóa biểu:", err);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Tạo thất bại!"
      );
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [selectedClassId, selectedSemesterId]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Xếp thời khóa biểu</h1>

      <TimetableForm
        onSubmit={handleSubmit}
        semesterOptions={semesterOptions}
      />

      <div className="flex gap-4 mt-8 mb-4">
        <select
          className="border p-2 rounded"
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <option value="">-- Chọn lớp --</option>
          {classOptions.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedSemesterId}
          onChange={(e) => setSelectedSemesterId(e.target.value)}
        >
          <option value="">-- Chọn học kỳ --</option>
          {semesterOptions.map((sem) => (
            <option key={sem._id} value={sem._id}>
              {sem.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Thời khóa biểu</h2>
        <div className="overflow-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-100">Thứ / Tiết</th>
                {[...Array(10).keys()].map((i) => (
                  <th key={i} className="border p-2">
                    Tiết {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map(
                (day) => {
                  const row = timetable.find((tt) => tt.dayOfWeek === day);
                  const periods = row?.periods || [];

                  return (
                    <tr key={day}>
                      <td className="border p-2 bg-gray-50 font-medium">
                        {day}
                      </td>
                      {[...Array(10).keys()].map((i) => {
                        const periodData = periods.find(
                          (p) => p.period === i + 1
                        );
                        return (
                          <td key={i} className="border p-2 text-center">
                            {periodData ? (
                              <>
                                <div className="font-medium">
                                  {periodData.subject?.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {periodData.teacher?.user?.fullName}
                                </div>
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetableManagement;
