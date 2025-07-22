import PropTypes from "prop-types";
import { X } from "lucide-react";

const SubjectViewModal = ({ showViewModal, setShowViewModal, subject }) => {
  if (!showViewModal || !subject) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">
        <button
          onClick={() => setShowViewModal(false)}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Chi tiết môn học
        </h2>
        <p>
          <strong>Tên:</strong> {subject.name}
        </p>
        <p>
          <strong>Mã:</strong> {subject.code}
        </p>
        <p>
          <strong>Loại:</strong> {subject.isRequired ? "Bắt buộc" : "Tự chọn"}
        </p>
        <p>
          <strong>Số tiết mỗi năm:</strong> {subject.periodsPerYear}
        </p>
        <p>
          <strong>Học kỳ:</strong>{" "}
          {subject.semesters?.map((s) => s.name).join(", ")}
        </p>
      </div>
    </div>
  );
};

SubjectViewModal.propTypes = {
  showViewModal: PropTypes.bool.isRequired,
  setShowViewModal: PropTypes.func.isRequired,
  subject: PropTypes.object,
};

export default SubjectViewModal;
