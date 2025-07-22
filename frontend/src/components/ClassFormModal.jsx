// components/ClassFormModal.jsx
import PropTypes from "prop-types";
import { X } from "lucide-react";

const ClassFormModal = ({
  showModal,
  closeModal,
  formData,
  handleChange,
  handleSubmit,
  editingClassId,
  teacherOptions = [],
  loading,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingClassId ? "Cập nhật lớp học" : "Thêm lớp học"}
          </h2>
          <button onClick={closeModal}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Tên lớp</label>
            <input
              type="text"
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Khối</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Năm học</label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">GVCN</label>
            {/* <select
              name="homeroomTeacher"
              value={formData.homeroomTeacher}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="">-- Chọn giáo viên --</option>
              {(teacherOptions || []).map((t) => (
                <option key={t._id} value={t._id}>
                  {t.user?.fullName}
                </option>
              ))}
            </select> */}
            <select
              name="homeroomTeacher"
              value={formData.homeroomTeacher}
              onChange={handleChange}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="">-- Chọn giáo viên --</option>
              {teacherOptions.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.user?.fullName || "Không có tên"}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {loading
                ? "Đang xử lý..."
                : editingClassId
                ? "Cập nhật"
                : "Tạo lớp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ClassFormModal.propTypes = {
  showModal: PropTypes.bool,
  closeModal: PropTypes.func,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func,
  editingClassId: PropTypes.string,
  teacherOptions: PropTypes.array,
  loading: PropTypes.bool,
};

export default ClassFormModal;
