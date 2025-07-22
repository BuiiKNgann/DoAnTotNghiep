import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../ultils/axios.js";

const ParentChildrenModal = ({ parent, onClose }) => {
  const [children, setChildren] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchChildren = async () => {
    try {
      const res = await axios.get(`/api/parents/${parent._id}/children`);
      setChildren(res.data.children);
    } catch (err) {
      console.error("Lỗi khi tải danh sách con:", err);
    }
  };

  const fetchAllStudents = async () => {
    try {
      const res = await axios.get("/api/student");
      setAllStudents(res.data);
    } catch (err) {
      console.error("Lỗi khi tải học sinh:", err);
    }
  };

  const handleAddChild = async () => {
    if (!selectedChildId) return;

    try {
      setLoading(true);
      setError(""); // clear lỗi cũ

      await axios.post(`/api/parents/${parent._id}/children`, {
        childIds: [selectedChildId],
      });

      setSelectedChildId("");
      await fetchChildren();
    } catch (err) {
      console.error("Lỗi khi thêm học sinh:", err);
      const response = err.response;

      const errorMsg =
        response?.data?.message || // ← lấy từ backend
        err.message || // ← fallback
        "Lỗi không xác định khi thêm học sinh.";

      setError(errorMsg); // ← hiển thị lỗi ra giao diện
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveChild = async (childId) => {
    const child = children.find((c) => c._id === childId);
    const confirm = window.confirm(
      `Bạn có chắc chắn muốn xoá học sinh "${child?.user?.fullName}" khỏi danh sách con của phụ huynh này không?`
    );

    if (!confirm) return;

    try {
      await axios.delete(`/api/parents/${parent._id}/children/${childId}`);
      await fetchChildren();
    } catch (err) {
      console.error("Lỗi khi xóa con:", err);
      alert("Xoá thất bại. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    fetchChildren();
    fetchAllStudents();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          Quản lý con của: {parent.fullName}
        </h2>

        {/* Lỗi khi thêm */}
        {error && (
          <div className="mb-3 rounded bg-red-100 border border-red-300 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Dropdown thêm con */}
        <div className="flex gap-2 mb-4">
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="flex-1 border px-2 py-1 rounded"
          >
            <option value="">-- Chọn học sinh --</option>
            {allStudents.map((student) => (
              <option key={student._id} value={student._id}>
                {student.user?.fullName}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddChild}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </div>

        {/* Danh sách con */}
        <ul className="space-y-2">
          {children.length === 0 ? (
            <p className="text-gray-500 text-sm">Chưa có học sinh nào</p>
          ) : (
            children.map((child) => (
              <li
                key={child._id}
                className="flex justify-between items-center border px-3 py-2 rounded"
              >
                <div>
                  <strong>{child.user?.fullName}</strong> –{" "}
                  {child.class?.className || "Chưa xếp lớp"}
                </div>
                <button
                  onClick={() => handleRemoveChild(child._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Xoá
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="mt-4 text-right">
          <button onClick={onClose} className="text-gray-600 underline">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

ParentChildrenModal.propTypes = {
  parent: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ParentChildrenModal;
