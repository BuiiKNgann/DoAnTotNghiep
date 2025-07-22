import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "../ultils/axios";
import { X } from "lucide-react";

const SubjectFormModal = ({ showModal, closeModal, subject, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    isRequired: true,
    semesters: [],
    periodsPerYear: "",
  });

  const [semesterOptions, setSemesterOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSemesters = async () => {
    const res = await axios.get("/api/semesters");
    setSemesterOptions(res.data.semesters || []);
  };

  useEffect(() => {
    fetchSemesters();
    if (subject) {
      setFormData({
        name: subject.name,
        code: subject.code,
        isRequired: subject.isRequired,
        semesters: subject.semesters?.map((s) => s._id),
        periodsPerYear: subject.periodsPerYear || "",
      });
    } else {
      setFormData({
        name: "",
        code: "",
        isRequired: true,
        semesters: [],
        periodsPerYear: "",
      });
    }
  }, [subject]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "semesters") {
      const selected = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({ ...prev, semesters: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (subject) {
        await axios.put(`/api/subjects/${subject._id}`, formData);
        alert("Cập nhật môn học thành công!");
      } else {
        await axios.post("/api/subjects", formData);
        alert("Tạo môn học thành công!");
      }
      onSuccess();
    } catch (err) {
      alert("Lỗi: " + err.response?.data?.message);
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
          {subject ? "Chỉnh sửa môn học" : "Thêm môn học"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Tên môn học"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            name="code"
            placeholder="Mã môn học"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="number"
            name="periodsPerYear"
            placeholder="Số tiết mỗi năm"
            value={formData.periodsPerYear}
            onChange={handleChange}
            required
            min={1}
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isRequired"
              checked={formData.isRequired}
              onChange={handleChange}
            />

            <label>Bắt buộc</label>
          </div>

          <div>
            <label className="block mb-1 text-sm">Chọn học kỳ</label>
            <select
              name="semesters"
              multiple
              value={formData.semesters}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              {semesterOptions.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : subject ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SubjectFormModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  subject: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
};

export default SubjectFormModal;
