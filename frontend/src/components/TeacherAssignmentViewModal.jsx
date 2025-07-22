// TeacherAssignmentViewModal.jsx
import PropTypes from "prop-types";
import { X } from "lucide-react";

const TeacherAssignmentViewModal = ({ show, assignment, onClose }) => {
  if (!show || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Chi tiết phân công</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giáo viên
            </label>
            <div className="rounded border p-2 bg-gray-50">
              {assignment.teacher?.user?.fullName || "-"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="rounded border p-2 bg-gray-50">
              {assignment.teacher?.user?.email || "-"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Môn học
            </label>
            <div className="rounded border p-2 bg-gray-50">
              {assignment.subject?.name || "-"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Học kỳ
            </label>
            <div className="rounded border p-2 bg-gray-50">
              {assignment.semester?.name || "-"}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lớp
            </label>
            <div className="rounded border p-2 bg-gray-50">
              {assignment.class?.className || "-"}
            </div>
          </div>

          <div className="text-right">
            <button
              onClick={onClose}
              className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TeacherAssignmentViewModal.propTypes = {
  show: PropTypes.bool,
  assignment: PropTypes.object,
  onClose: PropTypes.func,
};

export default TeacherAssignmentViewModal;
