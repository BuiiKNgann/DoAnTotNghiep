// import { useEffect, useState } from "react";
// import { Plus, Eye, Edit, Trash2 } from "lucide-react";
// import axios from "../ultils/axios";
// import SubjectFormModal from "../components/SubjectFormModal";
// import SubjectViewModal from "../components/SubjectViewModal";

// const SubjectManagement = () => {
//   const [subjects, setSubjects] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingSubject, setEditingSubject] = useState(null);
//   const [viewSubject, setViewSubject] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const fetchSubjects = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/subjects");
//       setSubjects(res.data.subjects);
//     } catch (err) {
//       alert("Lỗi khi tải môn học");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const handleDelete = async (id) => {
//     if (confirm("Bạn có chắc chắn muốn xóa môn học này?")) {
//       try {
//         setLoading(true);
//         await axios.delete(`/api/subjects/${id}`);
//         fetchSubjects();
//       } catch (err) {
//         alert("Xóa thất bại");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
//                 Quản lý môn học
//               </h1>
//               <p className="mt-1 text-sm text-gray-600">
//                 Danh sách và thao tác với môn học
//               </p>
//             </div>
//             <button
//               onClick={() => {
//                 setEditingSubject(null);
//                 setShowModal(true);
//               }}
//               className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
//             >
//               <Plus size={20} />
//               Thêm môn học
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
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Tên môn
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Mã môn
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Bắt buộc
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Học kỳ
//                     </th>
//                     <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
//                       Hành động
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {subjects.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan="5"
//                         className="p-4 text-center text-sm text-gray-500"
//                       >
//                         Không có môn học nào
//                       </td>
//                     </tr>
//                   ) : (
//                     subjects.map((subject) => (
//                       <tr key={subject._id}>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           {subject.name}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           {subject.code}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           {subject.isRequired ? "Bắt buộc" : "Tự chọn"}
//                         </td>
//                         <td className="px-4 py-2 text-sm text-gray-900">
//                           {subject.semesters?.map((s) => s.name).join(", ")}
//                         </td>
//                         <td className="px-4 py-2">
//                           <div className="flex space-x-2">
//                             <button
//                               onClick={() => {
//                                 setViewSubject(subject);
//                                 setShowViewModal(true);
//                               }}
//                               title="Xem"
//                             >
//                               <Eye
//                                 className="text-blue-600 hover:text-blue-800"
//                                 size={16}
//                               />
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setEditingSubject(subject);
//                                 setShowModal(true);
//                               }}
//                               title="Sửa"
//                             >
//                               <Edit
//                                 className="text-green-600 hover:text-green-800"
//                                 size={16}
//                               />
//                             </button>
//                             <button
//                               onClick={() => handleDelete(subject._id)}
//                               title="Xoá"
//                             >
//                               <Trash2
//                                 className="text-red-600 hover:text-red-800"
//                                 size={16}
//                               />
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

//         <SubjectFormModal
//           showModal={showModal}
//           closeModal={() => setShowModal(false)}
//           subject={editingSubject}
//           onSuccess={() => {
//             setShowModal(false);
//             fetchSubjects();
//           }}
//         />

//         <SubjectViewModal
//           showViewModal={showViewModal}
//           setShowViewModal={setShowViewModal}
//           subject={viewSubject}
//         />
//       </div>
//     </div>
//   );
// };

// export default SubjectManagement;
import { useEffect, useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import axios from "../ultils/axios";
import SubjectFormModal from "../components/SubjectFormModal";
import SubjectViewModal from "../components/SubjectViewModal";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [viewSubject, setViewSubject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/subjects");
      console.log("Dữ liệu môn học:", res.data.subjects); // Log để kiểm tra
      setSubjects(res.data.subjects || []);
    } catch (err) {
      alert(
        "Lỗi khi tải môn học: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa môn học này?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/subjects/${id}`);
        fetchSubjects();
      } catch (err) {
        alert("Xóa thất bại: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Hàm hiển thị giá trị gradingType
  const displayGradingType = (gradingType) => {
    return gradingType === "letter" ? "Chữ" : "Điểm số"; // Mặc định là "Điểm số" nếu không có gradingType
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Quản lý môn học
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Danh sách và thao tác với môn học
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSubject(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              <Plus size={20} />
              Thêm môn học
            </button>
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
                      Tên môn
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Mã môn
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Bắt buộc
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Học kỳ
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Loại điểm
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {subjects.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        Không có môn học nào
                      </td>
                    </tr>
                  ) : (
                    subjects.map((subject) => (
                      <tr key={subject._id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {subject.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {subject.code}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {subject.isRequired ? "Bắt buộc" : "Tự chọn"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {subject.semesters?.map((s) => s.name).join(", ") ||
                            "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {displayGradingType(subject.gradingType)}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setViewSubject(subject);
                                setShowViewModal(true);
                              }}
                              title="Xem"
                            >
                              <Eye
                                className="text-blue-600 hover:text-blue-800"
                                size={16}
                              />
                            </button>
                            <button
                              onClick={() => {
                                setEditingSubject(subject);
                                setShowModal(true);
                              }}
                              title="Sửa"
                            >
                              <Edit
                                className="text-green-600 hover:text-green-800"
                                size={16}
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(subject._id)}
                              title="Xoá"
                            >
                              <Trash2
                                className="text-red-600 hover:text-red-800"
                                size={16}
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

        <SubjectFormModal
          showModal={showModal}
          closeModal={() => setShowModal(false)}
          subject={editingSubject}
          onSuccess={() => {
            setShowModal(false);
            fetchSubjects();
          }}
        />

        <SubjectViewModal
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          subject={viewSubject}
        />
      </div>
    </div>
  );
};

export default SubjectManagement;
