import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "../ultils/axios";

const GradeEntryTable = ({
  students,
  subjectId,
  semesterId,
  classId,
  teacherId,
  maxTX,
  gradingType,
}) => {
  const [gradeRecords, setGradeRecords] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchGradeRecords();
  }, [students, subjectId, semesterId]);

  const fetchGradeRecords = async () => {
    setLoading(true);
    try {
      const promises = students.map((student) =>
        axios.get("/api/grades", {
          params: { studentId: student._id, subjectId, semesterId },
        })
      );
      const results = await Promise.all(promises);
      const newRecords = {};
      results.forEach((res, idx) => {
        const studentId = students[idx]._id;
        newRecords[studentId] = res.data.records[0] || {
          student: studentId,
          subject: subjectId,
          semester: semesterId,
          class: classId,
          teacher: teacherId,
          regularAssessments: Array(maxTX).fill(""),
          midterm: "",
          final: "",
          average: "",
          averageLetter: "",
        };
      });
      setGradeRecords(newRecords);
    } catch (err) {
      console.error("Lỗi khi tải điểm:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (studentId, field, value, index = null) => {
    setGradeRecords((prev) => {
      const updated = { ...prev };
      const record = { ...updated[studentId] };
      if (field === "regularAssessments") {
        const arr = [...(record.regularAssessments || Array(maxTX).fill(""))];
        arr[index] = gradingType === "letter" ? value : parseFloat(value) || "";
        record.regularAssessments = arr;
      } else {
        record[field] =
          gradingType === "letter" ? value : parseFloat(value) || "";
      }
      updated[studentId] = record;
      return updated;
    });
  };

  const handleSave = async (studentId) => {
    const record = gradeRecords[studentId];
    setSavingId(studentId);

    try {
      // Kiểm tra định dạng dữ liệu trước khi gửi
      const isValidGrade = (grade) => {
        if (gradingType === "letter") {
          return ["Đ", "F", ""].includes(grade);
        }
        return grade === "" || (!isNaN(grade) && grade >= 0 && grade <= 10);
      };

      if (!record.regularAssessments.every(isValidGrade)) {
        alert("Điểm thường xuyên không hợp lệ!");
        return;
      }
      if (!isValidGrade(record.midterm)) {
        alert("Điểm giữa kỳ không hợp lệ!");
        return;
      }
      if (!isValidGrade(record.final)) {
        alert("Điểm cuối kỳ không hợp lệ!");
        return;
      }

      const payload = {
        student: studentId,
        subject: record.subject,
        semester: record.semester,
        class: record.class,
        regularAssessments: record.regularAssessments,
        midterm: record.midterm,
        final: record.final,
      };

      if (teacherId) payload.teacher = teacherId;

      let res;
      if (record._id) {
        res = await axios.put(`/api/grades/${record._id}`, payload);
        alert("✅ Cập nhật thành công");
      } else {
        res = await axios.post("/api/grades", payload);
        alert("✅ Nhập điểm thành công");
      }

      setGradeRecords((prev) => ({
        ...prev,
        [studentId]: res.data.gradeRecord,
      }));
    } catch (err) {
      console.error("Lỗi khi lưu điểm:", err);
      alert("❌ Lưu thất bại: " + (err.response?.data.message || err.message));
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <p>⏳ Đang tải điểm...</p>;

  return (
    <div className="overflow-auto border rounded shadow mt-4">
      <table className="min-w-full text-sm text-center">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-2 py-1 text-left">Học sinh</th>
            {Array.from({ length: maxTX }).map((_, idx) => (
              <th key={idx} className="border px-2 py-1">{`TX${idx + 1}`}</th>
            ))}
            <th className="border px-2 py-1">Giữa kỳ</th>
            <th className="border px-2 py-1">Cuối kỳ</th>
            <th className="border px-2 py-1">TB</th>
            <th className="border px-2 py-1">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const record = gradeRecords[student._id] || {};
            const tx = record.regularAssessments || Array(maxTX).fill("");

            return (
              <tr key={student._id}>
                <td className="border px-2 py-1 text-left">
                  {student.user?.fullName}
                </td>
                {Array.from({ length: maxTX }).map((_, i) => (
                  <td key={i} className="border px-2 py-1">
                    {gradingType === "letter" ? (
                      <select
                        value={tx[i] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            student._id,
                            "regularAssessments",
                            e.target.value,
                            i
                          )
                        }
                        className="w-full px-1 py-0.5 border rounded text-center"
                      >
                        <option value="">--</option>
                        <option value="Đ">Đ</option>
                        <option value="F">F</option>
                      </select>
                    ) : (
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={tx[i] || ""}
                        onChange={(e) =>
                          handleInputChange(
                            student._id,
                            "regularAssessments",
                            e.target.value,
                            i
                          )
                        }
                        className="w-full px-1 py-0.5 border rounded text-center"
                      />
                    )}
                  </td>
                ))}
                <td className="border px-2 py-1">
                  {gradingType === "letter" ? (
                    <select
                      value={record.midterm || ""}
                      onChange={(e) =>
                        handleInputChange(
                          student._id,
                          "midterm",
                          e.target.value
                        )
                      }
                      className="w-full px-1 py-0.5 border rounded text-center"
                    >
                      <option value="">--</option>
                      <option value="Đ">Đ</option>
                      <option value="F">F</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={record.midterm || ""}
                      onChange={(e) =>
                        handleInputChange(
                          student._id,
                          "midterm",
                          e.target.value
                        )
                      }
                      className="w-full px-1 py-0.5 border rounded text-center"
                    />
                  )}
                </td>
                <td className="border px-2 py-1">
                  {gradingType === "letter" ? (
                    <select
                      value={record.final || ""}
                      onChange={(e) =>
                        handleInputChange(student._id, "final", e.target.value)
                      }
                      className="w-full px-1 py-0.5 border rounded text-center"
                    >
                      <option value="">--</option>
                      <option value="Đ">Đ</option>
                      <option value="F">F</option>
                    </select>
                  ) : (
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={record.final || ""}
                      onChange={(e) =>
                        handleInputChange(student._id, "final", e.target.value)
                      }
                      className="w-full px-1 py-0.5 border rounded text-center"
                    />
                  )}
                </td>
                <td className="border px-2 py-1">
                  {gradingType === "letter"
                    ? record.averageLetter ?? "-"
                    : record.average ?? "-"}
                </td>
                <td className="border px-2 py-1">
                  <button
                    onClick={() => handleSave(student._id)}
                    disabled={savingId === student._id}
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    {savingId === student._id ? "Đang lưu..." : "Lưu"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

GradeEntryTable.propTypes = {
  students: PropTypes.array.isRequired,
  subjectId: PropTypes.string.isRequired,
  semesterId: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
  teacherId: PropTypes.string,
  maxTX: PropTypes.number.isRequired,
  gradingType: PropTypes.oneOf(["numerical", "letter"]).isRequired,
};

export default GradeEntryTable;
