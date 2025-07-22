import { X, User, Calendar, BookOpen, Users, Edit } from "lucide-react";
import PropTypes from "prop-types";
const StudentViewModal = ({
  showViewModal,
  setShowViewModal,
  viewStudent,
  handleEdit,
  loading,
  formatDate,
  getAvatarInitials,
}) => {
  if (!showViewModal || !viewStudent) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Chi tiết học sinh
          </h3>
          <button
            onClick={() => setShowViewModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6 flex items-center">
            <div className="h-20 w-20 flex-shrink-0">
              {viewStudent.user.avatarUrl ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={viewStudent.user.avatarUrl}
                  alt={viewStudent.user.fullName}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-xl font-medium text-blue-600">
                    {getAvatarInitials(viewStudent.user.fullName)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-6">
              <h4 className="text-xl font-semibold text-gray-900">
                {viewStudent.user.fullName}
              </h4>
              <p className="text-sm text-gray-600">{viewStudent.user.email}</p>
              <p className="text-sm text-gray-500">
                Mã học sinh: {viewStudent.studentCode}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <User className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Giới tính</p>
                  <p className="text-gray-900">
                    {viewStudent.user.gender === "male" ? "Nam" : "Nữ"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                  <p className="text-gray-900">
                    {formatDate(viewStudent.user.dateOfBirth)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <BookOpen className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Khối</p>
                  <p className="text-gray-900">{viewStudent.grade}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Lớp</p>
                  <p className="text-gray-900">
                    {viewStudent.class?.className || "Chưa xếp lớp"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Năm học</p>
                  <p className="text-gray-900">{viewStudent.academicYear}</p>
                </div>
              </div>
              <div className="flex items-center">
                <User className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phụ huynh</p>
                  <p className="text-gray-900">
                    {viewStudent.parent?.fullName || "Chưa có thông tin"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowViewModal(false);
                handleEdit(viewStudent);
              }}
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 sm:text-base"
              disabled={loading}
            >
              <Edit size={16} />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
StudentViewModal.propTypes = {
  showViewModal: PropTypes.bool.isRequired,
  setShowViewModal: PropTypes.func.isRequired,
  viewStudent: PropTypes.object, // hoặc PropTypes.shape({...}) nếu muốn cụ thể hơn
  handleEdit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  formatDate: PropTypes.func.isRequired,
  getAvatarInitials: PropTypes.func.isRequired,
};

export default StudentViewModal;
