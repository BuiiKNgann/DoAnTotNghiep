import { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "../ultils/axios";
import SemesterFormModal from "./SemesterFormModal";

const SemesterManagement = () => {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);

  const fetchSemesters = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/semesters");
      setSemesters(res.data.semesters);
    } catch (err) {
      alert("Lỗi khi tải danh sách học kỳ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xoá học kỳ này?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/semesters/${id}`);
        fetchSemesters();
      } catch (err) {
        alert("Lỗi khi xoá học kỳ");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Quản lý học kỳ
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Danh sách và thao tác với học kỳ
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSemester(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              <Plus size={20} />
              {loading ? "Đang xử lý..." : "Thêm học kỳ"}
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
                      Tên học kỳ
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Ngày bắt đầu
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Ngày kết thúc
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {semesters.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        Không có học kỳ nào
                      </td>
                    </tr>
                  ) : (
                    semesters.map((semester) => (
                      <tr key={semester._id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {semester.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {new Date(semester.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {new Date(semester.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingSemester(semester);
                                setShowModal(true);
                              }}
                              title="Sửa"
                            >
                              <Edit
                                size={16}
                                className="text-green-600 hover:text-green-800"
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(semester._id)}
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

        <SemesterFormModal
          showModal={showModal}
          closeModal={() => setShowModal(false)}
          semester={editingSemester}
          onSuccess={() => {
            setShowModal(false);
            fetchSemesters();
          }}
        />
      </div>
    </div>
  );
};

export default SemesterManagement;
