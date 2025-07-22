import { useEffect, useState } from "react";
import axios from "../ultils/axios";

const ConductPage = () => {
  const [classes, setClasses] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [students, setStudents] = useState([]);
  const [conducts, setConducts] = useState({});
  const [absents, setAbsents] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // 👈 trạng thái đang lưu

  const conductOptions = ["Tốt", "Khá", "Trung bình", "Yếu"];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes");
        setClasses(res.data.classes);
      } catch (err) {
        console.error("Lỗi lấy lớp:", err);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await axios.get("/api/semesters");
        setSemesters(res.data.semesters || []);
      } catch (err) {
        console.error("Lỗi lấy học kỳ:", err);
      }
    };
    fetchSemesters();
  }, []);

  useEffect(() => {
    if (!selectedClass || !selectedSemester) return;

    setLoading(true);
    axios
      .get(
        `/api/student/filter-by-class-semester?classId=${selectedClass}&semesterId=${selectedSemester}`
      )
      .then((res) => {
        setStudents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi lấy danh sách học sinh:", err);
        setLoading(false);
      });
  }, [selectedClass, selectedSemester]);

  useEffect(() => {
    if (!selectedSemester || !students.length) return;

    const fetchConductAndAbsent = async () => {
      const conductMap = {};
      const absentMap = {};

      for (const student of students) {
        const studentId = student._id;

        try {
          const conductRes = await axios.get(
            `/api/conduct?studentId=${studentId}&semesterId=${selectedSemester}`
          );
          if (conductRes.data?.length > 0) {
            conductMap[studentId] = conductRes.data[0];
          }

          const absentRes = await axios.get(
            `/api/conduct/absent-sessions?studentId=${studentId}&semesterId=${selectedSemester}`
          );
          absentMap[studentId] = absentRes.data;
        } catch (error) {
          console.error("Lỗi khi lấy hạnh kiểm hoặc nghỉ học:", error);
        }
      }

      setConducts(conductMap);
      setAbsents(absentMap);
    };

    fetchConductAndAbsent();
  }, [selectedSemester, students]);

  //   const autoSaveConduct = async (studentId, updatedData) => {
  //     const conductRecord = conducts[studentId];
  //     if (!conductRecord?._id) return;

  //     try {
  //       const updated = {
  //         ...conductRecord,
  //         ...updatedData,
  //       };

  //       await axios.put(`/api/conduct/${conductRecord._id}`, updated);

  //       setConducts((prev) => ({
  //         ...prev,
  //         [studentId]: updated,
  //       }));
  //     } catch (err) {
  //       console.error("Lỗi cập nhật hạnh kiểm:", err);
  //     }
  //   };
  const autoSaveConduct = async (studentId, updatedData) => {
    const conductRecord = conducts[studentId] || {};

    try {
      let updated;

      if (conductRecord._id) {
        // Đã có -> cập nhật
        updated = { ...conductRecord, ...updatedData };
        await axios.put(`/api/conduct/${conductRecord._id}`, updated);
      } else {
        // Chưa có -> tạo mới
        const payload = {
          student: studentId,
          semester: selectedSemester,
          conduct: updatedData.conduct || conductRecord.conduct || "",
          note: updatedData.note || conductRecord.note || "",
        };
        const res = await axios.post(`/api/conduct`, payload);
        updated = res.data;
      }

      // Cập nhật state
      setConducts((prev) => ({
        ...prev,
        [studentId]: updated,
      }));
    } catch (err) {
      console.error("Lỗi khi lưu hạnh kiểm:", err);
    }
  };

  const handleConductChange = (studentId, value) => {
    setConducts((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        conduct: value,
      },
    }));
    autoSaveConduct(studentId, { conduct: value });
  };

  const handleNoteChange = (studentId, value) => {
    setConducts((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        note: value,
      },
    }));
    autoSaveConduct(studentId, { note: value });
  };

  // ✅ Lưu tất cả hạnh kiểm
  //   const handleSaveAll = async () => {
  //     setSaving(true);
  //     try {
  //       const updates = Object.values(conducts).filter((c) => c._id); // Chỉ lấy những bản ghi có _id
  //       await Promise.all(
  //         updates.map((record) => axios.put(`/api/conduct/${record._id}`, record))
  //       );
  //       alert("Đã lưu tất cả thành công!");
  //     } catch (err) {
  //       console.error("Lỗi khi lưu tất cả:", err);
  //       alert("Có lỗi khi lưu. Vui lòng thử lại.");
  //     }
  //     setSaving(false);
  //   };
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const requests = Object.entries(conducts).map(([studentId, record]) => {
        if (record._id) {
          return axios.put(`/api/conduct/${record._id}`, record);
        } else {
          const payload = {
            student: studentId,
            semester: selectedSemester,
            conduct: record.conduct || "",
            note: record.note || "",
          };
          return axios.post(`/api/conduct`, payload);
        }
      });

      await Promise.all(requests);
      alert("Đã lưu tất cả thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu tất cả:", err);
      alert("Có lỗi khi lưu. Vui lòng thử lại.");
    }
    setSaving(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Đánh giá hạnh kiểm</h2>

      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedClass}
          onChange={(e) => {
            setSelectedClass(e.target.value);
            setStudents([]);
            setConducts({});
            setAbsents({});
          }}
        >
          <option value="">-- Chọn lớp --</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={selectedSemester}
          onChange={(e) => {
            setSelectedSemester(e.target.value);
            setConducts({});
            setAbsents({});
          }}
          disabled={!selectedClass}
        >
          <option value="">-- Chọn học kỳ --</option>
          {semesters.map((sem) => (
            <option key={sem._id} value={sem._id}>
              {sem.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Đang tải danh sách học sinh...</p>
      ) : (
        <>
          <table className="min-w-full border mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Họ tên</th>
                <th className="border px-4 py-2">Mã học sinh</th>
                <th className="border px-4 py-2">Hạnh kiểm</th>
                <th className="border px-4 py-2">Ghi chú</th>
                <th className="border px-4 py-2">Số buổi nghỉ</th>
                <th className="border px-4 py-2">Số ngày nghỉ</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu) => {
                const conduct = conducts[stu._id];
                const absent = absents[stu._id];

                return (
                  <tr key={stu._id}>
                    <td className="border px-4 py-2">
                      {stu.user?.fullName || "Chưa có"}
                    </td>
                    <td className="border px-4 py-2">{stu.studentCode}</td>

                    <td className="border px-4 py-2">
                      <select
                        value={conduct?.conduct || ""}
                        onChange={(e) =>
                          handleConductChange(stu._id, e.target.value)
                        }
                        className="border p-1 rounded"
                      >
                        <option value="">-- Chọn --</option>
                        {conductOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        className="border p-1 rounded w-full"
                        value={conduct?.note || ""}
                        onChange={(e) =>
                          handleNoteChange(stu._id, e.target.value)
                        }
                      />
                    </td>

                    <td className="border px-4 py-2">
                      {absent?.totalAbsentSessions || 0}
                    </td>
                    <td className="border px-4 py-2">
                      {absent?.totalAbsentDays || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ✅ Nút lưu tất cả */}
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saving ? "Đang lưu..." : "💾 Lưu tất cả"}
          </button>
        </>
      )}
    </div>
  );
};

export default ConductPage;
