// import { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import axios from "../ultils/axios";
// import { X } from "lucide-react";

// const TeacherAssignmentModal = ({ showModal, closeModal, onSuccess }) => {
//   const [formData, setFormData] = useState({
//     teacher: "",
//     subject: "",
//     semester: "",
//     class: "",
//   });

//   const [teachers, setTeachers] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const config = {
//     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//   };

//   const fetchData = async () => {
//     try {
//       const [teacherRes, subjectRes, semesterRes, classRes] = await Promise.all(
//         [
//           axios.get("/api/teachers", config),
//           axios.get("/api/subjects", config),
//           axios.get("/api/semesters", config),
//           axios.get("/api/classes", config),
//         ]
//       );

//       // DEBUG LOG (bạn có thể xóa sau khi test)
//       console.log("Teachers:", teacherRes.data);
//       console.log("Subjects:", subjectRes.data);
//       console.log("Semesters:", semesterRes.data);
//       console.log("Classes:", classRes.data);

//       setTeachers(Array.isArray(teacherRes.data) ? teacherRes.data : []);
//       setSubjects(
//         Array.isArray(subjectRes.data.subjects) ? subjectRes.data.subjects : []
//       );
//       setSemesters(
//         Array.isArray(semesterRes.data.semesters)
//           ? semesterRes.data.semesters
//           : []
//       );
//       setClasses(Array.isArray(classRes.data) ? classRes.data : []);
//     } catch (err) {
//       alert("Lỗi khi tải dữ liệu dropdown: " + err.message);
//     }
//   };

//   useEffect(() => {
//     if (showModal) fetchData();
//   }, [showModal]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       await axios.post("/api/assignments", formData, config);
//       alert("Phân công thành công!");
//       onSuccess();
//       closeModal();
//     } catch (err) {
//       alert("Lỗi khi phân công giáo viên: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!showModal) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
//       <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold text-gray-800">
//             Phân công giáo viên
//           </h2>
//           <button onClick={closeModal}>
//             <X className="text-gray-500 hover:text-black" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Giáo viên */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">
//               Giáo viên
//             </label>
//             <select
//               name="teacher"
//               value={formData.teacher}
//               onChange={handleChange}
//               className="w-full border p-2 rounded mt-1"
//               required
//             >
//               <option value="">-- Chọn giáo viên --</option>
//               {Array.isArray(teachers) &&
//                 teachers.map((t) => (
//                   <option key={t._id} value={t._id}>
//                     {t.user?.fullName || "Không tên"}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           {/* Môn học */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">Môn học</label>
//             <select
//               name="subject"
//               value={formData.subject}
//               onChange={handleChange}
//               className="w-full border p-2 rounded mt-1"
//               required
//             >
//               <option value="">-- Chọn môn học --</option>
//               {Array.isArray(subjects) &&
//                 subjects.map((s) => (
//                   <option key={s._id} value={s._id}>
//                     {s.name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           {/* Học kỳ */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">Học kỳ</label>
//             <select
//               name="semester"
//               value={formData.semester}
//               onChange={handleChange}
//               className="w-full border p-2 rounded mt-1"
//               required
//             >
//               <option value="">-- Chọn học kỳ --</option>
//               {Array.isArray(semesters) &&
//                 semesters.map((sem) => (
//                   <option key={sem._id} value={sem._id}>
//                     {sem.name}
//                   </option>
//                 ))}
//             </select>
//           </div>

//           {/* Lớp */}
//           <div>
//             <label className="text-sm font-medium text-gray-700">Lớp</label>
//             <select
//               name="class"
//               value={formData.class}
//               onChange={handleChange}
//               className="w-full border p-2 rounded mt-1"
//             >
//               <option value="">-- Không chọn lớp --</option>
//               {Array.isArray(classes) && classes.length > 0 ? (
//                 classes.map((cls) => (
//                   <option key={cls._id} value={cls._id}>
//                     {cls.className} - {cls.academicYear}
//                   </option>
//                 ))
//               ) : (
//                 <option disabled>(Không có lớp nào)</option>
//               )}
//             </select>
//           </div>

//           <div className="flex justify-end pt-4">
//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               disabled={loading}
//             >
//               {loading ? "Đang lưu..." : "Lưu phân công"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TeacherAssignmentModal;

// TeacherAssignmentModal.propTypes = {
//   showModal: PropTypes.bool.isRequired,
//   closeModal: PropTypes.func.isRequired,
//   onSuccess: PropTypes.func.isRequired,
// };
// TeacherAssignmentModal.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import axios from "../ultils/axios";

const TeacherAssignmentModal = ({
  showModal,
  closeModal,
  onSuccess,
  editingAssignment,
}) => {
  const [formData, setFormData] = useState({
    teacher: "",
    subject: "",
    semester: "",
    class: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchData = async () => {
    try {
      const [tRes, sRes, semRes, cRes] = await Promise.all([
        axios.get("/api/teachers", config),
        axios.get("/api/subjects", config),
        axios.get("/api/semesters", config),
        axios.get("/api/classes", config),
      ]);
      // // setTeachers(tRes.data);
      // setTeachers(Array.isArray(tRes.data) ? tRes.data : []);

      // setSubjects(sRes.data.subjects);
      // setSemesters(semRes.data.semesters);
      // //setClasses(cRes.data);
      // setClasses(Array.isArray(cRes.data.classes) ? cRes.data.classes : []);
      setTeachers(Array.isArray(tRes.data.teachers) ? tRes.data.teachers : []);
      setSubjects(Array.isArray(sRes.data.subjects) ? sRes.data.subjects : []);
      setSemesters(
        Array.isArray(semRes.data.semesters) ? semRes.data.semesters : []
      );
      setClasses(Array.isArray(cRes.data.classes) ? cRes.data.classes : []);
    } catch (err) {
      alert("Lỗi khi tải dữ liệu chọn");
    }
  };

  useEffect(() => {
    if (showModal) fetchData();
  }, [showModal]);

  useEffect(() => {
    if (editingAssignment) {
      setFormData({
        teacher: editingAssignment.teacher?._id || "",
        subject: editingAssignment.subject?._id || "",
        semester: editingAssignment.semester?._id || "",
        class: editingAssignment.class?._id || "",
      });
    } else {
      setFormData({ teacher: "", subject: "", semester: "", class: "" });
    }
  }, [editingAssignment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingAssignment) {
        await axios.put(
          `/api/assignments/${editingAssignment._id}`,
          formData,
          config
        );
        alert("Cập nhật phân công thành công");
      } else {
        await axios.post("/api/assignments", formData, config);
        alert("Tạo phân công thành công");
      }
      onSuccess();
    } catch (err) {
      alert("Lỗi khi gửi dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingAssignment ? "Chỉnh sửa phân công" : "Thêm phân công"}
          </h2>
          <button onClick={closeModal}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Giáo viên</label>
            <select
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              className="w-full rounded border p-2"
            >
              <option value="">-- Chọn giáo viên --</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.user?.fullName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Môn học</label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded border p-2"
            >
              <option value="">-- Chọn môn --</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Học kỳ</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full rounded border p-2"
            >
              <option value="">-- Chọn học kỳ --</option>
              {semesters.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Lớp</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full rounded border p-2"
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.className}
                </option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : editingAssignment
                ? "Cập nhật"
                : "Tạo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

TeacherAssignmentModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  onSuccess: PropTypes.func,
  editingAssignment: PropTypes.object,
};

export default TeacherAssignmentModal;
