// import { useEffect, useState } from "react";
// import axios from "../ultils/axios.js";
// import GradeEntryTable from "../components/GradeEntryTable.jsx";
// import { useAuth } from "../context/AuthContext.jsx";
// const GradeManagement = () => {
//   const [classes, setClasses] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [semesters, setSemesters] = useState([]);

//   const [selectedClass, setSelectedClass] = useState("");
//   const [selectedSubject, setSelectedSubject] = useState("");
//   const [selectedSemester, setSelectedSemester] = useState("");
//   const { user } = useAuth();
//   const teacherId = user?.role === "teacher" ? user._id : null;
//   useEffect(() => {
//     fetchDropdownData();
//   }, []);

//   useEffect(() => {
//     if (selectedClass && selectedSubject && selectedSemester) {
//       fetchStudentsByCondition();
//     }
//   }, [selectedClass, selectedSubject, selectedSemester]);

//   const fetchDropdownData = async () => {
//     try {
//       const [classesRes, subjectsRes, semestersRes] = await Promise.all([
//         axios.get("/api/classes"),
//         axios.get("/api/subjects"),
//         axios.get("/api/semesters"),
//       ]);
//       setClasses(classesRes.data.classes);
//       setSubjects(subjectsRes.data.subjects);
//       setSemesters(semestersRes.data.semesters);
//     } catch (err) {
//       console.error("Lỗi khi tải dropdown:", err);
//     }
//   };

//   // const fetchStudentsByCondition = async () => {
//   //   try {
//   //     const res = await axios.get("/api/student/by-class-subject-semester", {
//   //       params: {
//   //         classId: selectedClass,
//   //         subjectId: selectedSubject,
//   //         semesterId: selectedSemester,
//   //       },
//   //     });
//   //     setStudents(res.data);
//   //   } catch (err) {
//   //     console.error("Lỗi khi tải học sinh:", err);
//   //   }
//   // };
//   const fetchStudentsByCondition = async () => {
//     try {
//       console.log("🔍 Gửi request với:", {
//         classId: selectedClass,
//         subjectId: selectedSubject,
//         semesterId: selectedSemester,
//       });

//       const res = await axios.get("/api/student/filter-by-condition", {
//         params: {
//           classId: selectedClass,
//           subjectId: selectedSubject,
//           semesterId: selectedSemester,
//         },
//       });
//       setStudents(res.data);
//     } catch (err) {
//       console.error(
//         "❌ Lỗi khi tải học sinh:",
//         err.response?.data || err.message
//       );
//     }
//   };
//   return (
//     <div className="p-6 space-y-6">
//       <h2 className="text-2xl font-semibold text-gray-700">
//         🎓 Nhập / Sửa điểm học kỳ
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-1 text-gray-600">
//             Lớp học
//           </label>
//           <select
//             className="w-full border rounded px-3 py-2 bg-white"
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//           >
//             <option value="">-- Chọn lớp --</option>
//             {classes.map((cls) => (
//               <option key={cls._id} value={cls._id}>
//                 {cls.className}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1 text-gray-600">
//             Môn học
//           </label>
//           <select
//             className="w-full border rounded px-3 py-2 bg-white"
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//           >
//             <option value="">-- Chọn môn học --</option>
//             {subjects.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1 text-gray-600">
//             Học kỳ
//           </label>
//           <select
//             className="w-full border rounded px-3 py-2 bg-white"
//             value={selectedSemester}
//             onChange={(e) => setSelectedSemester(e.target.value)}
//           >
//             <option value="">-- Chọn học kỳ --</option>
//             {semesters.map((s) => (
//               <option key={s._id} value={s._id}>
//                 {s.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {selectedClass && selectedSubject && selectedSemester && (
//         <GradeEntryTable
//           students={students}
//           subjectId={selectedSubject}
//           semesterId={selectedSemester}
//           classId={selectedClass}
//           teacherId={teacherId}
//         />
//       )}
//     </div>
//   );
// };

// export default GradeManagement;
import { useEffect, useState } from "react";
import axios from "../ultils/axios.js";
import GradeEntryTable from "../components/GradeEntryTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const GradeManagement = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState(null);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const { user } = useAuth();
  const teacherId = user?.role === "teacher" ? user._id : null;

  const getMaxRegularAssessments = (periodsPerYear) => {
    if (periodsPerYear <= 35) return 2;
    if (periodsPerYear <= 70) return 3;
    return 4;
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedSubject && selectedSemester) {
      fetchStudentsByCondition();
    }
  }, [selectedClass, selectedSubject, selectedSemester]);

  const fetchDropdownData = async () => {
    try {
      const [classesRes, subjectsRes, semestersRes] = await Promise.all([
        axios.get("/api/classes"),
        axios.get("/api/subjects"),
        axios.get("/api/semesters"),
      ]);
      setClasses(classesRes.data.classes);
      setSubjects(subjectsRes.data.subjects);
      setSemesters(semestersRes.data.semesters);
    } catch (err) {
      console.error("Lỗi khi tải dropdown:", err);
    }
  };

  const fetchStudentsByCondition = async () => {
    try {
      const res = await axios.get("/api/student/filter-by-condition", {
        params: {
          classId: selectedClass,
          subjectId: selectedSubject,
          semesterId: selectedSemester,
        },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(
        "❌ Lỗi khi tải học sinh:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700">
        🎓 Nhập / Sửa điểm học kỳ
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Lớp học
          </label>
          <select
            className="w-full border rounded px-3 py-2 bg-white"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">-- Chọn lớp --</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Môn học
          </label>
          <select
            className="w-full border rounded px-3 py-2 bg-white"
            value={selectedSubject}
            onChange={(e) => {
              const subjectId = e.target.value;
              setSelectedSubject(subjectId);
              const subject = subjects.find((s) => s._id === subjectId);
              setSelectedSubjectDetails(subject || null);
            }}
          >
            <option value="">-- Chọn môn học --</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Học kỳ
          </label>
          <select
            className="w-full border rounded px-3 py-2 bg-white"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">-- Chọn học kỳ --</option>
            {semesters.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedClass && selectedSubject && selectedSemester && (
        <GradeEntryTable
          students={students}
          subjectId={selectedSubject}
          semesterId={selectedSemester}
          classId={selectedClass}
          teacherId={teacherId}
          maxTX={
            selectedSubjectDetails
              ? getMaxRegularAssessments(selectedSubjectDetails.periodsPerYear)
              : 3
          }
        />
      )}
    </div>
  );
};

export default GradeManagement;
