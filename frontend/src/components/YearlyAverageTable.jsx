// import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
// import axios from "../ultils/axios";

// const YearlyAverageTable = ({
//   students,
//   subjectId,
//   semester1Id,
//   semester2Id,
//   classId,
// }) => {
//   const [yearlyAverages, setYearlyAverages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchYearlyAverages();
//   }, [students, subjectId, semester1Id, semester2Id]);

//   const fetchYearlyAverages = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/grades/yearly-average", {
//         params: { classId, subjectId, studentId: undefined },
//       });
//       setYearlyAverages(res.data.results);
//     } catch (err) {
//       console.error("Lỗi khi tải điểm trung bình cả năm:", err);
//       alert(
//         "❌ Lỗi khi tải điểm: " + (err.response?.data.message || err.message)
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>⏳ Đang tải điểm trung bình cả năm...</p>;

//   return (
//     <div className="overflow-auto border rounded shadow mt-4">
//       <table className="min-w-full text-sm text-center">
//         <thead className="bg-gray-100 text-gray-700">
//           <tr>
//             <th className="border px-2 py-1 text-left">Học sinh</th>
//             <th className="border px-2 py-1">TB Học kỳ 1</th>
//             <th className="border px-2 py-1">TB Học kỳ 2</th>
//             <th className="border px-2 py-1">TB Cả năm</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => {
//             const record =
//               yearlyAverages.find((avg) => avg.studentId === student._id) || {};
//             return (
//               <tr key={student._id}>
//                 <td className="border px-2 py-1 text-left">
//                   {student.user?.fullName}
//                 </td>
//                 <td className="border px-2 py-1">
//                   {record.semester1Average !== null
//                     ? record.semester1Average
//                     : "-"}
//                 </td>
//                 <td className="border px-2 py-1">
//                   {record.semester2Average !== null
//                     ? record.semester2Average
//                     : "-"}
//                 </td>
//                 <td className="border px-2 py-1">
//                   {record.yearlyAverage !== null ? record.yearlyAverage : "-"}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// YearlyAverageTable.propTypes = {
//   students: PropTypes.array.isRequired,
//   subjectId: PropTypes.string.isRequired,
//   semester1Id: PropTypes.string.isRequired,
//   semester2Id: PropTypes.string.isRequired,
//   classId: PropTypes.string.isRequired,
// };

// export default YearlyAverageTable;
// import PropTypes from "prop-types";
// import { useEffect, useState } from "react";
// import axios from "../ultils/axios";

// const YearlyAverageTable = ({
//   students,
//   subjectId,
//   semester1Id,
//   semester2Id,
//   classId,
// }) => {
//   const [yearlyAverages, setYearlyAverages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchYearlyAverages();
//   }, [students, subjectId, semester1Id, semester2Id]);

//   const fetchYearlyAverages = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await axios.get("/api/grades/yearly-average", {
//         params: { classId, subjectId }, // Loại bỏ studentId
//       });
//       console.log("Yearly averages:", res.data.results); // Debug
//       console.log("Students:", students); // Debug
//       setYearlyAverages(res.data.results);
//     } catch (err) {
//       console.error("Lỗi khi tải điểm trung bình cả năm:", err);
//       setError(
//         err.response?.data.message || "Không thể tải điểm trung bình cả năm"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>⏳ Đang tải điểm trung bình cả năm...</p>;
//   if (error) return <p className="text-red-500">❌ {error}</p>;

//   return (
//     <div className="overflow-auto border rounded shadow mt-4">
//       <table className="min-w-full text-sm text-center">
//         <thead className="bg-gray-100 text-gray-700">
//           <tr>
//             <th className="border px-2 py-1 text-left">Học sinh</th>
//             <th className="border px-2 py-1">TB Học kỳ 1</th>
//             <th className="border px-2 py-1">TB Học kỳ 2</th>
//             <th className="border px-2 py-1">TB Cả năm</th>
//           </tr>
//         </thead>
//         <tbody>
//           {students.map((student) => {
//             const record =
//               yearlyAverages.find((avg) => avg.studentId === student._id) || {};
//             return (
//               <tr key={student._id}>
//                 <td className="border px-2 py-1 text-left">
//                   {student.user?.fullName || "Không xác định"}
//                 </td>
//                 <td className="border px-2 py-1">
//                   {record.semester1Average ?? "-"}
//                 </td>
//                 <td className="border px-2 py-1">
//                   {record.semester2Average ?? "-"}
//                 </td>
//                 <td className="border px-2 py-1">
//                   {record.yearlyAverage ?? "-"}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// YearlyAverageTable.propTypes = {
//   students: PropTypes.array.isRequired,
//   subjectId: PropTypes.string.isRequired,
//   semester1Id: PropTypes.string.isRequired,
//   semester2Id: PropTypes.string.isRequired,
//   classId: PropTypes.string.isRequired,
// };

// export default YearlyAverageTable;
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import axios from "../ultils/axios";

const YearlyAverageTable = ({
  students,
  subjectId,
  semester1Id,
  semester2Id,
  classId,
}) => {
  const [yearlyAverages, setYearlyAverages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (classId && subjectId) {
      fetchYearlyAverages();
    }
  }, [classId, subjectId, semester1Id, semester2Id]);

  const fetchYearlyAverages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/grades/yearly-average", {
        params: { classId, subjectId },
      });
      console.log("Yearly averages:", res.data.results);
      console.log("Students:", students);
      setYearlyAverages(res.data.results);
    } catch (err) {
      console.error("Lỗi khi tải điểm trung bình cả năm:", err);
      setError(
        err.response?.data.message || "Không thể tải điểm trung bình cả năm"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>⏳ Đang tải điểm trung bình cả năm...</p>;
  if (error) return <p className="text-red-500">❌ {error}</p>;
  if (!students.length) return <p>Không có học sinh trong lớp.</p>;
  if (!yearlyAverages.length)
    return <p>Không có dữ liệu điểm trung bình cả năm.</p>;

  return (
    <div className="overflow-auto border rounded shadow mt-4">
      <table className="min-w-full text-sm text-center">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="border px-2 py-1 text-left">Học sinh</th>
            <th className="border px-2 py-1">TB Học kỳ 1</th>
            <th className="border px-2 py-1">TB Học kỳ 2</th>
            <th className="border px-2 py-1">TB Cả năm</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            const record =
              yearlyAverages.find((avg) => avg.studentId === student._id) || {};
            return (
              <tr key={student._id}>
                <td className="border px-2 py-1 text-left">
                  {student.user?.fullName || "Không xác định"}
                </td>
                <td className="border px-2 py-1">
                  {record.semester1Average ?? "-"}
                </td>
                <td className="border px-2 py-1">
                  {record.semester2Average ?? "-"}
                </td>
                <td className="border px-2 py-1">
                  {record.yearlyAverage ?? "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

YearlyAverageTable.propTypes = {
  students: PropTypes.array.isRequired,
  subjectId: PropTypes.string.isRequired,
  semester1Id: PropTypes.string.isRequired,
  semester2Id: PropTypes.string.isRequired,
  classId: PropTypes.string.isRequired,
};

export default YearlyAverageTable;
