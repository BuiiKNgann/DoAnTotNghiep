import { useEffect, useState } from "react";
import { Plus, Edit, Users, Eye, Trash2 } from "lucide-react";
import axios from "../ultils/axios.js";
import ParentFormModal from "../components/ParentFormModal.jsx";
import ParentChildrenModal from "../components/ParentChildrenModal.jsx";
import ParentViewModal from "../components/ParentViewModal.jsx";

const ParentManagement = () => {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showChildrenModal, setShowChildrenModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);

  const fetchParents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/parent", config());
      setParents(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phụ huynh:", err);
      alert("Lỗi khi tải danh sách phụ huynh.");
    } finally {
      setLoading(false);
    }
  };

  const config = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  useEffect(() => {
    fetchParents();
  }, []);

  const getAvatarInitials = (fullName) => {
    return fullName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAdd = () => {
    setSelectedParent(null);
    setShowFormModal(true);
  };

  const handleEdit = (parent) => {
    setSelectedParent(parent);
    setShowFormModal(true);
  };

  const handleView = (parent) => {
    setSelectedParent(parent);
    setShowViewModal(true);
  };

  const handleManageChildren = (parent) => {
    setSelectedParent(parent);
    setShowChildrenModal(true);
  };

  const handleDelete = async (parent) => {
    const confirm = window.confirm(
      `Bạn có chắc chắn muốn xoá phụ huynh "${parent.fullName}" không?`
    );
    if (!confirm) return;

    try {
      setLoading(true);
      await axios.delete(`/api/parent/${parent._id}`, config());
      alert("Xoá phụ huynh thành công");
      fetchParents();
    } catch (err) {
      console.error("Lỗi khi xoá phụ huynh:", err);
      alert("Không thể xoá phụ huynh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Quản lý phụ huynh
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Quản lý thông tin phụ huynh trong hệ thống
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:text-base"
              disabled={loading}
            >
              <Plus size={20} />
              {loading ? "Đang tải..." : "Thêm phụ huynh"}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
            <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
              Danh sách phụ huynh
            </h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Đang tải dữ liệu...</div>
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                      Phụ huynh
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 sm:px-6">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {parents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-4 py-4 text-center text-gray-500 sm:px-6"
                      >
                        Chưa có phụ huynh nào
                      </td>
                    </tr>
                  ) : (
                    parents.map((parent) => (
                      <tr key={parent._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {parent.avatarUrl ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={parent.avatarUrl}
                                  alt={parent.fullName}
                                />
                              ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                  <span className="text-sm font-medium text-blue-600">
                                    {getAvatarInitials(parent.fullName)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {parent.fullName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900 sm:px-6">
                          {parent.email}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium sm:px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(parent)}
                              className="rounded p-1 text-blue-600 hover:text-blue-800"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(parent)}
                              className="rounded p-1 text-yellow-500 hover:text-yellow-700"
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleManageChildren(parent)}
                              className="rounded p-1 text-green-600 hover:text-green-800"
                              title="Quản lý con"
                            >
                              <Users size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(parent)}
                              className="rounded p-1 text-red-600 hover:text-red-800"
                              title="Xoá phụ huynh"
                            >
                              <Trash2 size={16} />
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

        {/* Modals */}
        {showFormModal && (
          <ParentFormModal
            parent={selectedParent}
            onClose={() => {
              setShowFormModal(false);
              setSelectedParent(null);
              fetchParents();
            }}
          />
        )}

        {showChildrenModal && (
          <ParentChildrenModal
            parent={selectedParent}
            onClose={() => {
              setShowChildrenModal(false);
              setSelectedParent(null);
            }}
          />
        )}

        {showViewModal && (
          <ParentViewModal
            parent={selectedParent}
            onClose={() => {
              setShowViewModal(false);
              setSelectedParent(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ParentManagement;
