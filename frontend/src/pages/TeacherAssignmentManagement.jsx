import { useEffect, useState } from "react";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";

import axios from "../ultils/axios";
import TeacherAssignmentModal from "../components/TeacherAssignmentModal";
import TeacherAssignmentViewModal from "../components/TeacherAssignmentViewModal";

const TeacherAssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editAssignment, setEditAssignment] = useState(null);
  const [viewAssignment, setViewAssignment] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/assignments", config);
      setAssignments(res.data.assignments);
    } catch (err) {
      alert("Lỗi khi tải danh sách phân công");
    } finally {
      setLoading(false);
    }
  };
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/api/teachers", config);
      console.log("Fetched teachers:", res.data.teachers);
      setTeachers(Array.isArray(res.data.teachers) ? res.data.teachers : []);
    } catch (err) {
      console.error("Lỗi khi tải giáo viên", err);
      setTeachers([]); // fallback để tránh undefined
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xoá phân công này?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/assignments/${id}`, config);
        fetchAssignments();
      } catch (err) {
        alert("Lỗi khi xoá phân công");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleView = (assignment) => setViewAssignment(assignment);
  const handleEdit = (assignment) => {
    setEditAssignment(assignment);
    setShowModal(true);
  };

  useEffect(() => {
    fetchAssignments();
    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Quản lý phân công giáo viên
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Danh sách giáo viên được phân công dạy học
              </p>
            </div>
            <button
              onClick={() => {
                setEditAssignment(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              <Plus size={20} />
              {loading ? "Đang xử lý..." : "Thêm phân công"}
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
                      Giáo viên
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Môn học
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Học kỳ
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Lớp
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {assignments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        Không có phân công nào
                      </td>
                    </tr>
                  ) : (
                    assignments.map((a) => (
                      <tr key={a._id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {a.teacher?.user?.fullName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {a.subject?.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {a.semester?.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {a.class?.className || "-"}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button onClick={() => handleView(a)} title="Xem">
                              <Eye
                                className="text-blue-600 hover:text-blue-800"
                                size={16}
                              />
                            </button>
                            <button onClick={() => handleEdit(a)} title="Sửa">
                              <Edit
                                className="text-green-600 hover:text-green-800"
                                size={16}
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(a._id)}
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

        <TeacherAssignmentModal
          showModal={showModal}
          closeModal={() => {
            setShowModal(false);
            setEditAssignment(null);
          }}
          onSuccess={fetchAssignments}
          editingAssignment={editAssignment}
          teachers={teachers}
        />

        <TeacherAssignmentViewModal
          show={!!viewAssignment}
          assignment={viewAssignment}
          onClose={() => setViewAssignment(null)}
          teachers={teachers}
        />
      </div>
    </div>
  );
};

export default TeacherAssignmentManagement;
