// // import { useEffect, useState } from "react";
// // import { Plus, Edit, Trash2, Eye } from "lucide-react";
// // import axios from "../ultils/axios.js";
// // import StudentFormModal from "../components/StudentFormModal";
// // import StudentViewModal from "../components/StudentViewModal";

// // const StudentManagement = () => {
// //   const [students, setStudents] = useState([]);
// //   const [formData, setFormData] = useState({
// //     fullName: "",
// //     email: "",
// //     password: "",
// //     gender: "male",
// //     dateOfBirth: "",
// //     studentCode: "",
// //     grade: "",
// //     academicYear: "",
// //     classId: "",
// //     parentId: "",
// //     image: null,
// //   });
// //   const [editingStudentId, setEditingStudentId] = useState(null);
// //   const [showModal, setShowModal] = useState(false);
// //   const [viewStudent, setViewStudent] = useState(null);
// //   const [showViewModal, setShowViewModal] = useState(false);
// //   const [loading, setLoading] = useState(false);
// //   const [classOptions, setClassOptions] = useState([]);
// //   const [parentOptions, setParentOptions] = useState([]);

// //   const fetchStudents = async () => {
// //     try {
// //       setLoading(true);
// //       const res = await axios.get("/api/student", config());
// //       setStudents(res.data);
// //     } catch (error) {
// //       console.error("Error fetching students:", error);
// //       alert("Có lỗi khi tải danh sách học sinh");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchClasses = async () => {
// //     try {
// //       const res = await axios.get("/api/classes", config());
// //       // setClassOptions(res.data);
// //       setClassOptions(res.data.classes);
// //     } catch (err) {
// //       console.error("Lỗi khi tải lớp:", err);
// //     }
// //   };

// //   const fetchParents = async () => {
// //     try {
// //       const res = await axios.get("/api/parent", config());
// //       setParentOptions(res.data);
// //     } catch (err) {
// //       console.error("Lỗi khi tải phụ huynh:", err);
// //     }
// //   };

// //   const config = () => ({
// //     headers: {
// //       Authorization: `Bearer ${localStorage.getItem("token")}`,
// //     },
// //   });

// //   const handleChange = (e) => {
// //     const { name, value, files } = e.target;
// //     if (name === "image") {
// //       setFormData({ ...formData, image: files[0] });
// //     } else {
// //       setFormData({ ...formData, [name]: value });
// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       setLoading(true);
// //       const data = new FormData();
// //       for (const key in formData) {
// //         if (formData[key]) data.append(key, formData[key]);
// //       }

// //       if (editingStudentId) {
// //         await axios.put(`/api/student/${editingStudentId}`, data, config());
// //         alert("Cập nhật học sinh thành công!");
// //       } else {
// //         await axios.post("/api/student/create", data, config());
// //         alert("Tạo học sinh thành công!");
// //       }

// //       resetForm();
// //       setShowModal(false);
// //       fetchStudents();
// //     } catch (error) {
// //       console.error("Error submitting form:", error);
// //       alert("Có lỗi xảy ra khi lưu thông tin học sinh");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const resetForm = () => {
// //     setFormData({
// //       fullName: "",
// //       email: "",
// //       password: "",
// //       gender: "male",
// //       dateOfBirth: "",
// //       studentCode: "",
// //       grade: "",
// //       academicYear: "",
// //       classId: "",
// //       parentId: "",
// //       image: null,
// //     });
// //     setEditingStudentId(null);
// //   };

// //   const handleEdit = (student) => {
// //     const { user } = student;
// //     setFormData({
// //       fullName: user.fullName,
// //       email: user.email,
// //       password: "",
// //       gender: user.gender,
// //       dateOfBirth: user.dateOfBirth?.substring(0, 10) || "",
// //       studentCode: student.studentCode,
// //       grade: student.grade,
// //       academicYear: student.academicYear,
// //       classId: student.class?._id || "",
// //       parentId: student.parent?._id || "",
// //       image: null,
// //     });
// //     setEditingStudentId(student._id);
// //     setShowModal(true);
// //   };

// //   const handleDelete = async (id) => {
// //     if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
// //       try {
// //         setLoading(true);
// //         await axios.delete(`/api/student/${id}`, config());
// //         alert("Xóa học sinh thành công!");
// //         fetchStudents();
// //       } catch (error) {
// //         console.error("Error deleting student:", error);
// //         alert("Có lỗi khi xóa học sinh");
// //       } finally {
// //         setLoading(false);
// //       }
// //     }
// //   };

// //   const handleView = (student) => {
// //     setViewStudent(student);
// //     setShowViewModal(true);
// //   };

// //   const openCreateModal = () => {
// //     resetForm();
// //     setShowModal(true);
// //   };

// //   const closeModal = () => {
// //     setShowModal(false);
// //     resetForm();
// //   };

// //   const formatDate = (dateString) => {
// //     if (!dateString) return "";
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString("vi-VN");
// //   };

// //   const getAvatarInitials = (fullName) => {
// //     return fullName
// //       .split(" ")
// //       .map((word) => word[0])
// //       .join("")
// //       .toUpperCase()
// //       .slice(0, 2);
// //   };

// //   useEffect(() => {
// //     fetchStudents();
// //     fetchClasses();
// //     fetchParents();
// //   }, []);

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
// //       <div className="mx-auto max-w-7xl">
// //         {/* Header */}
// //         <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
// //           <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
// //             <div>
// //               <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
// //                 Quản lý học sinh
// //               </h1>
// //               <p className="mt-1 text-sm text-gray-600">
// //                 Quản lý thông tin học sinh trong hệ thống
// //               </p>
// //             </div>
// //             <button
// //               onClick={openCreateModal}
// //               className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:text-base"
// //               disabled={loading}
// //             >
// //               <Plus size={20} />
// //               {loading ? "Đang tải..." : "Thêm học sinh"}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Students Table */}
// //         <div className="overflow-hidden rounded-lg bg-white shadow-sm">
// //           <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
// //             <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
// //               Danh sách học sinh
// //             </h2>
// //           </div>
// //           <div className="overflow-x-auto">
// //             {loading ? (
// //               <div className="flex items-center justify-center py-8">
// //                 <div className="text-gray-500">Đang tải dữ liệu...</div>
// //               </div>
// //             ) : (
// //               <table className="w-full table-auto">
// //                 <thead className="bg-gray-50">
// //                   <tr>
// //                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
// //                       Học sinh
// //                     </th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
// //                       Mã số
// //                     </th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
// //                       Lớp
// //                     </th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
// //                       Năm học
// //                     </th>
// //                     <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
// //                       Hành động
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-gray-200 bg-white">
// //                   {students.length === 0 ? (
// //                     <tr>
// //                       <td
// //                         colSpan="5"
// //                         className="px-4 py-4 text-center text-gray-500 sm:px-6"
// //                       >
// //                         Chưa có học sinh nào
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     students.map((student) => (
// //                       <tr key={student._id} className="hover:bg-gray-50">
// //                         <td className="px-4 py-4 sm:px-6">
// //                           <div className="flex items-center">
// //                             <div className="h-10 w-10 flex-shrink-0">
// //                               {student.user.avatarUrl ? (
// //                                 <img
// //                                   className="h-10 w-10 rounded-full object-cover"
// //                                   src={student.user.avatarUrl}
// //                                   alt={student.user.fullName}
// //                                 />
// //                               ) : (
// //                                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
// //                                   <span className="text-sm font-medium text-blue-600">
// //                                     {getAvatarInitials(student.user.fullName)}
// //                                   </span>
// //                                 </div>
// //                               )}
// //                             </div>
// //                             <div className="ml-4">
// //                               <div className="text-sm font-medium text-gray-900">
// //                                 {student.user.fullName}
// //                               </div>
// //                               <div className="text-sm text-gray-500">
// //                                 {student.user.email}
// //                               </div>
// //                             </div>
// //                           </div>
// //                         </td>
// //                         <td className="px-4 py-4 text-sm text-gray-900 sm:px-6">
// //                           {student.studentCode}
// //                         </td>
// //                         <td className="px-4 py-4 text-sm text-gray-900 sm:px-6">
// //                           {student.class?.className || "Chưa xếp lớp"}
// //                         </td>
// //                         <td className="px-4 py-4 text-sm text-gray-900 sm:px-6">
// //                           {student.academicYear}
// //                         </td>
// //                         <td className="px-4 py-4 text-sm font-medium sm:px-6">
// //                           <div className="flex space-x-3">
// //                             <button
// //                               onClick={() => handleView(student)}
// //                               className="rounded p-1 text-blue-600 hover:text-blue-900 disabled:opacity-50"
// //                               title="Xem chi tiết"
// //                               disabled={loading}
// //                             >
// //                               <Eye size={16} />
// //                             </button>
// //                             <button
// //                               onClick={() => handleEdit(student)}
// //                               className="rounded p-1 text-green-600 hover:text-green-900 disabled:opacity-50"
// //                               title="Chỉnh sửa"
// //                               disabled={loading}
// //                             >
// //                               <Edit size={16} />
// //                             </button>
// //                             <button
// //                               onClick={() => handleDelete(student._id)}
// //                               className="rounded p-1 text-red-600 hover:text-red-900 disabled:opacity-50"
// //                               title="Xóa"
// //                               disabled={loading}
// //                             >
// //                               <Trash2 size={16} />
// //                             </button>
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))
// //                   )}
// //                 </tbody>
// //               </table>
// //             )}
// //           </div>
// //         </div>

// //         {/* Render Modals */}
// //         <StudentFormModal
// //           showModal={showModal}
// //           closeModal={closeModal}
// //           formData={formData}
// //           handleChange={handleChange}
// //           handleSubmit={handleSubmit}
// //           editingStudentId={editingStudentId}
// //           classOptions={classOptions}
// //           parentOptions={parentOptions}
// //           loading={loading}
// //         />
// //         <StudentViewModal
// //           showViewModal={showViewModal}
// //           setShowViewModal={setShowViewModal}
// //           viewStudent={viewStudent}
// //           handleEdit={handleEdit}
// //           loading={loading}
// //           formatDate={formatDate}
// //           getAvatarInitials={getAvatarInitials}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default StudentManagement;
// import { useEffect, useState } from "react";
// import { Plus, Edit, Trash2, Eye } from "lucide-react";
// import axios from "../ultils/axios.js";
// import StudentFormModal from "../components/StudentFormModal";
// import StudentViewModal from "../components/StudentViewModal";

// const StudentManagement = () => {
//   const [students, setStudents] = useState([]);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     gender: "male",
//     dateOfBirth: "",
//     studentCode: "",
//     grade: "",
//     academicYear: "",
//     classId: "",
//     parentId: "",
//     image: null,
//   });
//   const [editingStudentId, setEditingStudentId] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [viewStudent, setViewStudent] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [classOptions, setClassOptions] = useState([]);
//   const [parentOptions, setParentOptions] = useState([]);
//   const [selectedClassId, setSelectedClassId] = useState("all");

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/student", config());
//       setStudents(res.data);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       alert("Có lỗi khi tải danh sách học sinh");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchClasses = async () => {
//     try {
//       const res = await axios.get("/api/classes", config());
//       setClassOptions(res.data.classes);
//     } catch (err) {
//       console.error("Lỗi khi tải lớp:", err);
//     }
//   };

//   const fetchParents = async () => {
//     try {
//       const res = await axios.get("/api/parent", config());
//       setParentOptions(res.data);
//     } catch (err) {
//       console.error("Lỗi khi tải phụ huynh:", err);
//     }
//   };

//   const config = () => ({
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setFormData({ ...formData, image: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       const data = new FormData();
//       for (const key in formData) {
//         if (formData[key]) data.append(key, formData[key]);
//       }

//       if (editingStudentId) {
//         await axios.put(`/api/student/${editingStudentId}`, data, config());
//         alert("Cập nhật học sinh thành công!");
//       } else {
//         await axios.post("/api/student/create", data, config());
//         alert("Tạo học sinh thành công!");
//       }

//       resetForm();
//       setShowModal(false);
//       fetchStudents();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert("Có lỗi xảy ra khi lưu thông tin học sinh");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       fullName: "",
//       email: "",
//       password: "",
//       gender: "male",
//       dateOfBirth: "",
//       studentCode: "",
//       grade: "",
//       academicYear: "",
//       classId: "",
//       parentId: "",
//       image: null,
//     });
//     setEditingStudentId(null);
//   };

//   const handleEdit = (student) => {
//     const { user } = student;
//     setFormData({
//       fullName: user.fullName,
//       email: user.email,
//       password: "",
//       gender: user.gender,
//       dateOfBirth: user.dateOfBirth?.substring(0, 10) || "",
//       studentCode: student.studentCode,
//       grade: student.grade,
//       academicYear: student.academicYear,
//       classId: student.class?._id || "",
//       parentId: student.parent?._id || "",
//       image: null,
//     });
//     setEditingStudentId(student._id);
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
//       try {
//         setLoading(true);
//         await axios.delete(`/api/student/${id}`, config());
//         alert("Xóa học sinh thành công!");
//         fetchStudents();
//       } catch (error) {
//         console.error("Error deleting student:", error);
//         alert("Có lỗi khi xóa học sinh");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   const handleView = (student) => {
//     setViewStudent(student);
//     setShowViewModal(true);
//   };

//   const openCreateModal = () => {
//     resetForm();
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     resetForm();
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("vi-VN");
//   };

//   const getAvatarInitials = (fullName) => {
//     return fullName
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);
//   };

//   const filteredStudents = students.filter(
//     (student) =>
//       selectedClassId === "all" || student.class?._id === selectedClassId
//   );

//   useEffect(() => {
//     fetchStudents();
//     fetchClasses();
//     fetchParents();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-4 flex justify-between items-center">
//           <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
//             Quản lý học sinh
//           </h1>
//           <div className="flex items-center gap-4">
//             <select
//               className="border border-gray-300 rounded px-3 py-2"
//               value={selectedClassId}
//               onChange={(e) => setSelectedClassId(e.target.value)}
//             >
//               <option value="all">Tất cả lớp</option>
//               {classOptions.map((cls) => (
//                 <option key={cls._id} value={cls._id}>
//                   {cls.className}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={openCreateModal}
//               className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//             >
//               <Plus size={20} /> Thêm học sinh
//             </button>
//           </div>
//         </div>

//         <div className="overflow-hidden rounded-lg bg-white shadow-sm">
//           <div className="overflow-x-auto">
//             {loading ? (
//               <div className="p-6 text-center text-gray-500">
//                 Đang tải dữ liệu...
//               </div>
//             ) : (
//               <table className="w-full table-auto">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Học sinh
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Mã số
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Lớp
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Năm học
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Hành động
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {filteredStudents.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan="5"
//                         className="p-4 text-center text-sm text-gray-500"
//                       >
//                         Không có học sinh nào
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredStudents.map((student) => (
//                       <tr key={student._id}>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           {student.user.fullName}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           {student.studentCode}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           {student.class?.className || "-"}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           {student.academicYear}
//                         </td>
//                         <td className="px-4 py-2">
//                           <div className="flex space-x-2">
//                             <button onClick={() => handleView(student)}>
//                               <Eye size={16} className="text-blue-600" />
//                             </button>
//                             <button onClick={() => handleEdit(student)}>
//                               <Edit size={16} className="text-green-600" />
//                             </button>
//                             <button onClick={() => handleDelete(student._id)}>
//                               <Trash2 size={16} className="text-red-600" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

//         <StudentFormModal
//           showModal={showModal}
//           closeModal={closeModal}
//           formData={formData}
//           handleChange={handleChange}
//           handleSubmit={handleSubmit}
//           editingStudentId={editingStudentId}
//           classOptions={classOptions}
//           parentOptions={parentOptions}
//           loading={loading}
//         />

//         <StudentViewModal
//           showViewModal={showViewModal}
//           setShowViewModal={setShowViewModal}
//           viewStudent={viewStudent}
//           handleEdit={handleEdit}
//           loading={loading}
//           formatDate={formatDate}
//           getAvatarInitials={getAvatarInitials}
//         />
//       </div>
//     </div>
//   );
// };

// export default StudentManagement;
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import axios from "../ultils/axios.js";
import StudentFormModal from "../components/StudentFormModal";
import StudentViewModal from "../components/StudentViewModal";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "male",
    dateOfBirth: "",
    studentCode: "",
    grade: "",
    academicYear: "",
    classId: "",
    parentId: "",
    image: null,
  });
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classOptions, setClassOptions] = useState([]);
  const [parentOptions, setParentOptions] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("all");

  // const fetchStudents = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get("/api/student", config());
  //     setStudents(res.data);
  //   } catch (error) {
  //     console.error("Error fetching students:", error);
  //     alert("Có lỗi khi tải danh sách học sinh");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/student", config());

      const sortedStudents = res.data.sort((a, b) => {
        const getLastName = (fullName) => {
          const parts = fullName.trim().split(" ");
          return parts[parts.length - 1]; // Lấy từ cuối cùng
        };

        const nameA = getLastName(a.user.fullName).toLowerCase();
        const nameB = getLastName(b.user.fullName).toLowerCase();

        return nameA.localeCompare(nameB, "vi", { sensitivity: "base" });
      });

      // Gán mã số học sinh theo lớp
      const studentMap = {};
      for (let student of sortedStudents) {
        const classId = student.class?._id || "unassigned";
        if (!studentMap[classId]) studentMap[classId] = 1;
        student.studentCode = studentMap[classId].toString().padStart(2, "0");
        studentMap[classId]++;
      }

      setStudents(sortedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Có lỗi khi tải danh sách học sinh");
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("/api/classes", config());
      setClassOptions(res.data.classes);
    } catch (err) {
      console.error("Lỗi khi tải lớp:", err);
    }
  };

  const fetchParents = async () => {
    try {
      const res = await axios.get("/api/parent", config());
      setParentOptions(res.data);
    } catch (err) {
      console.error("Lỗi khi tải phụ huynh:", err);
    }
  };

  const config = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }

      if (editingStudentId) {
        await axios.put(`/api/student/${editingStudentId}`, data, config());
        alert("Cập nhật học sinh thành công!");
      } else {
        await axios.post("/api/student/create", data, config());
        alert("Tạo học sinh thành công!");
      }

      resetForm();
      setShowModal(false);
      fetchStudents();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Có lỗi xảy ra khi lưu thông tin học sinh");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      gender: "male",
      dateOfBirth: "",
      studentCode: "",
      grade: "",
      academicYear: "",
      classId: "",
      parentId: "",
      image: null,
    });
    setEditingStudentId(null);
  };

  const handleEdit = (student) => {
    const { user } = student;
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      gender: user.gender,
      dateOfBirth: user.dateOfBirth?.substring(0, 10) || "",
      studentCode: student.studentCode,
      grade: student.grade,
      academicYear: student.academicYear,
      classId: student.class?._id || "",
      parentId: student.parent?._id || "",
      image: null,
    });
    setEditingStudentId(student._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/student/${id}`, config());
        alert("Xóa học sinh thành công!");
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Có lỗi khi xóa học sinh");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleView = (student) => {
    setViewStudent(student);
    setShowViewModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getAvatarInitials = (fullName) => {
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredStudents = students.filter(
    (student) =>
      selectedClassId === "all" || student.class?._id === selectedClassId
  );

  useEffect(() => {
    fetchStudents();
    fetchClasses();
    fetchParents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Quản lý học sinh
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Danh sách và thao tác với học sinh
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                disabled={loading}
              >
                <option value="all">Tất cả lớp</option>
                {classOptions.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.className}
                  </option>
                ))}
              </select>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                <Plus size={20} />
                {loading ? "Đang xử lý..." : "Thêm học sinh"}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Đang tải dữ liệu...
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Học sinh
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Mã số
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Lớp
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Năm học
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        Không có học sinh nào
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student._id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {student.user.fullName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {student.studentCode}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {student.class?.className || "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {student.academicYear}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(student)}
                              title="Xem"
                            >
                              <Eye
                                size={16}
                                className="text-blue-600 hover:text-blue-800"
                              />
                            </button>
                            <button
                              onClick={() => handleEdit(student)}
                              title="Sửa"
                            >
                              <Edit
                                size={16}
                                className="text-green-600 hover:text-green-800"
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(student._id)}
                              title="Xoá"
                            >
                              <Trash2
                                size={16}
                                className="text-red-600 hover:text-red-800"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <StudentFormModal
          showModal={showModal}
          closeModal={closeModal}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingStudentId={editingStudentId}
          classOptions={classOptions}
          parentOptions={parentOptions}
          loading={loading}
        />

        <StudentViewModal
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          viewStudent={viewStudent}
          handleEdit={handleEdit}
          loading={loading}
          formatDate={formatDate}
          getAvatarInitials={getAvatarInitials}
        />
      </div>
    </div>
  );
};

export default StudentManagement;
