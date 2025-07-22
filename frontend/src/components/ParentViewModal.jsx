import PropTypes from "prop-types";
import { X } from "lucide-react";

const ParentViewModal = ({ parent, onClose }) => {
  if (!parent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="text-center">
          {parent.avatarUrl ? (
            <img
              src={parent.avatarUrl}
              alt="Avatar"
              className="mx-auto h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {parent.fullName
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
          )}
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            {parent.fullName}
          </h2>
          <p className="text-gray-500">{parent.email}</p>
        </div>

        <div className="mt-6 space-y-3 text-sm text-gray-700">
          <p>
            <strong>Giới tính:</strong>{" "}
            {parent.gender === "male" ? "Nam" : "Nữ"}
          </p>
          <p>
            <strong>Ngày sinh:</strong>{" "}
            {parent.dateOfBirth
              ? new Date(parent.dateOfBirth).toLocaleDateString("vi-VN")
              : "Không rõ"}
          </p>
        </div>
      </div>
    </div>
  );
};

ParentViewModal.propTypes = {
  parent: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ParentViewModal;
