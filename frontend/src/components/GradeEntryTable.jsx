// import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
// import axios from "../ultils/axios";

// const GradeEntryTable = ({
//   students,
//   subjectId,
//   semesterId,
//   classId,
//   teacherId,
// }) => {
//   const [gradeRecords, setGradeRecords] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [savingId, setSavingId] = useState(null);

//   useEffect(() => {
//     fetchGradeRecords();
//   }, [students, subjectId, semesterId]);

//   const fetchGradeRecords = async () => {
//     setLoading(true);
//     try {
//       const promises = students.map((student) =>
//         axios.get("/api/grades", {
//           params: { studentId: student._id, subjectId, semesterId },
//         })
//       );
//       const results = await Promise.all(promises);
//       const newRecords = {};
//       results.forEach((res, idx) => {
//         const studentId = students[idx]._id;
//         newRecords[studentId] = res.data.records[0] || {
//           student: studentId,
//           subject: subjectId,
//           semester: semesterId,
//           class: classId, // ✅ từ props
//           teacher: teacherId, // ✅ từ props
//           regularAssessments: [],
//           midterm: "",
//           final: "",
//           average: "",
//         };
//       });
//       setGradeRecords(newRecords);
//     } catch (err) {
//       console.error("Lỗi khi tải điểm:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (studentId, field, value, index = null) => {
//     setGradeRecords((prev) => {
//       const updated = { ...prev };
//       const record = { ...updated[studentId] };
//       if (field === "regularAssessments") {
//         const arr = [...(record.regularAssessments || [])];
//         arr[index] = parseFloat(value);
//         record.regularAssessments = arr;
//       } else {
//         record[field] = parseFloat(value);
//       }
//       updated[studentId] = record;
//       return updated;
//     });
//   };

//   // const handleSave = async (studentId) => {
//   //   const record = gradeRecords[studentId];
//   //   setSavingId(studentId);

//   //   try {
//   //     if (record._id) {
//   //       const res = await axios.put(/api/grades/${record._id}, {
//   //         regularAssessments: record.regularAssessments,
//   //         midterm: record.midterm,
//   //         final: record.final,
//   //       });
//   //       setGradeRecords((prev) => ({
//   //         ...prev,
//   //         [studentId]: res.data.gradeRecord,
//   //       }));
//   //     } else {
//   //       const res = await axios.post("/api/grades", {
//   //         student: studentId,
//   //         subject: record.subject,
//   //         semester: record.semester,
//   //         class: students.find((s) => s._id === studentId)?.class?._id,
//   //         teacher: record.teacher || "",
//   //         regularAssessments: record.regularAssessments,
//   //         midterm: record.midterm,
//   //         final: record.final,
//   //       });
//   //       setGradeRecords((prev) => ({
//   //         ...prev,
//   //         [studentId]: res.data.gradeRecord,
//   //       }));
//   //     }
//   //     alert("✅ Lưu thành công!");
//   //   } catch (err) {
//   //     console.error("Lỗi khi lưu điểm:", err);
//   //     alert("❌ Lưu thất bại");
//   //   } finally {
//   //     setSavingId(null);
//   //   }
//   // };
//   // const handleSave = async (studentId) => {
//   //   const record = gradeRecords[studentId];
//   //   setSavingId(studentId);

//   //   try {
//   //     const payload = {
//   //       student: studentId,
//   //       subject: record.subject,
//   //       semester: record.semester,
//   //       class: record.class || students.find((s) => s._id === studentId)?.class,
//   //       regularAssessments: record.regularAssessments,
//   //       midterm: record.midterm,
//   //       final: record.final,
//   //     };

//   //     if (teacherId) {
//   //       payload.teacher = teacherId;
//   //     }

//   //     let res;
//   //     if (record._id) {
//   //       res = await axios.put(/api/grades/${record._id}, payload);
//   //       alert("✅ Cập nhật thành công");
//   //     } else {
//   //       res = await axios.post("/api/grades", payload);
//   //       alert("✅ Nhập điểm thành công");
//   //     }

//   //     setGradeRecords((prev) => ({
//   //       ...prev,
//   //       [studentId]: res.data.gradeRecord,
//   //     }));
//   //   } catch (err) {
//   //     console.error("Lỗi khi lưu điểm:", err);
//   //     alert("❌ Lưu thất bại");
//   //   } finally {
//   //     setSavingId(null);
//   //   }
//   // };
//   const handleSave = async (studentId) => {
//     const record = gradeRecords[studentId];
//     setSavingId(studentId);

//     try {
//       const payload = {
//         student: studentId,
//         subject: record.subject,
//         semester: record.semester,
//         class:
//           record.class || students.find((s) => s._id === studentId)?.class?._id,
//         regularAssessments: record.regularAssessments,
//         midterm: record.midterm,
//         final: record.final,
//       };

//       const res = record._id
//         ? await axios.put(`/api/grades/${record._id}`, payload)
//         : await axios.post("/api/grades", payload);

//       alert("✅ Lưu thành công");
//       setGradeRecords((prev) => ({
//         ...prev,
//         [studentId]: res.data.gradeRecord,
//       }));
//     } catch (err) {
//       console.error("Lỗi khi lưu điểm:", err);
//       alert("❌ Lưu thất bại");
//     } finally {
//       setSavingId(null);
//     }
//   };
//   if (loading) return <p>⏳ Đang tải điểm...</p>;

//   return (
//     <div className="overflow-auto border rounded shadow mt-4">
//       <table className="min-w-full text-sm text-center">
//         <thead className="bg-gray-100 text-gray-700">
//           <tr>
//             <th className="border px-2 py-1 text-left">Học sinh</th>
//             <th className="border px-2 py-1">TX1</th>
//             <th className="border px-2 py-1">TX2</th>
//             <th className="border px-2 py-1">TX3</th>
//             <th className="border px-2 py-1">Giữa kỳ</th>
//             <th className="border px-2 py-1">Cuối kỳ</th>
//             <th className="border px-2 py-1">TB</th>
//             <th className="border px-2 py-1">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => {
//             const record = gradeRecords[student._id] || {};
//             const tx = record.regularAssessments || [];

//             return (
//               <tr key={student._id}>
//                 <td className="border px-2 py-1 text-left">
//                   {student.user?.fullName}
//                 </td>
//                 {[0, 1, 2].map((i) => (
//                   <td key={i} className="border px-2 py-1">
//                     <input
//                       type="number"
//                       min="0"
//                       max="10"
//                       value={tx[i] || ""}
//                       onChange={(e) =>
//                         handleInputChange(
//                           student._id,
//                           "regularAssessments",
//                           e.target.value,
//                           i
//                         )
//                       }
//                       className="w-full px-1 py-0.5 border rounded text-center"
//                     />
//                   </td>
//                 ))}
//                 <td className="border px-2 py-1">
//                   <input
//                     type="number"
//                     min="0"
//                     max="10"
//                     value={record.midterm || ""}
//                     onChange={(e) =>
//                       handleInputChange(student._id, "midterm", e.target.value)
//                     }
//                     className="w-full px-1 py-0.5 border rounded text-center"
//                   />
//                 </td>
//                 <td className="border px-2 py-1">
//                   <input
//                     type="number"
//                     min="0"
//                     max="10"
//                     value={record.final || ""}
//                     onChange={(e) =>
//                       handleInputChange(student._id, "final", e.target.value)
//                     }
//                     className="w-full px-1 py-0.5 border rounded text-center"
//                   />
//                 </td>
//                 <td className="border px-2 py-1">{record.average ?? "-"}</td>
//                 <td className="border px-2 py-1">
//                   <button
//                     onClick={() => handleSave(student._id)}
//                     disabled={savingId === student._id}
//                     className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
//                   >
//                     {savingId === student._id ? "Đang lưu..." : "Lưu"}
//                   </button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// GradeEntryTable.propTypes = {
//   students: PropTypes.array.isRequired,
//   subjectId: PropTypes.string.isRequired,
//   semesterId: PropTypes.string.isRequired,
//   classId: PropTypes.string.isRequired, // ✅ thêm
//   teacherId: PropTypes.string,
// };

// export default GradeEntryTable;
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
          regularAssessments: [],
          midterm: "",
          final: "",
          average: "",
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
        const arr = [...(record.regularAssessments || [])];
        arr[index] = parseFloat(value);
        record.regularAssessments = arr;
      } else {
        record[field] = parseFloat(value);
      }
      updated[studentId] = record;
      return updated;
    });
  };

  const handleSave = async (studentId) => {
    const record = gradeRecords[studentId];
    setSavingId(studentId);

    try {
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
      alert("❌ Lưu thất bại");
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
            const tx = record.regularAssessments || [];

            return (
              <tr key={student._id}>
                <td className="border px-2 py-1 text-left">
                  {student.user?.fullName}
                </td>
                {Array.from({ length: maxTX }).map((_, i) => (
                  <td key={i} className="border px-2 py-1">
                    <input
                      type="number"
                      min="0"
                      max="10"
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
                  </td>
                ))}
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={record.midterm || ""}
                    onChange={(e) =>
                      handleInputChange(student._id, "midterm", e.target.value)
                    }
                    className="w-full px-1 py-0.5 border rounded text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={record.final || ""}
                    onChange={(e) =>
                      handleInputChange(student._id, "final", e.target.value)
                    }
                    className="w-full px-1 py-0.5 border rounded text-center"
                  />
                </td>
                <td className="border px-2 py-1">{record.average ?? "-"}</td>
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
};

export default GradeEntryTable;
