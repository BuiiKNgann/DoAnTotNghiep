import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "../ultils/axios";
import { X } from "lucide-react";

const SemesterFormModal = ({ showModal, closeModal, semester, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (semester) {
      setFormData({
        name: semester.name || "",
        startDate: semester.startDate?.slice(0, 10) || "",
        endDate: semester.endDate?.slice(0, 10) || "",
      });
    } else {
      setFormData({ name: "", startDate: "", endDate: "" });
    }
  }, [semester]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (semester) {
        await axios.put(`/api/semesters/${semester._id}`, formData);
        alert("Cập nhật học kỳ thành công!");
      } else {
        await axios.post("/api/semesters", formData);
        alert("Tạo học kỳ thành công!");
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu học kỳ: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          {semester ? "Chỉnh sửa học kỳ" : "Thêm học kỳ"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tên học kỳ
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ngày bắt đầu
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full rounded border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ngày kết thúc
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full rounded border px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Đang lưu..."
                : semester
                ? "Cập nhật học kỳ"
                : "Tạo học kỳ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SemesterFormModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  semester: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default SemesterFormModal;
