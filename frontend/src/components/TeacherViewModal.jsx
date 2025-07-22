// import { X } from "lucide-react";
// import PropTypes from "prop-types";

// const TeacherViewModal = ({ showViewModal, setShowViewModal, teacher }) => {
//   if (!showViewModal || !teacher) return null;

//   const { user } = teacher;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="w-full max-w-xl rounded-lg bg-white p-6 relative shadow-lg">
//         <button
//           className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
//           onClick={() => setShowViewModal(false)}
//         >
//           <X size={24} />
//         </button>
//         <h2 className="text-xl font-bold mb-4">Thông tin giáo viên</h2>
//         <div className="space-y-2">
//           <p>
//             <strong>Họ tên:</strong> {user?.fullName}
//           </p>
//           <p>
//             <strong>Email:</strong> {user?.email}
//           </p>
//           <p>
//             <strong>Giới tính:</strong> {user?.gender === "male" ? "Nam" : "Nữ"}
//           </p>
//           <p>
//             <strong>Ngày sinh:</strong> {user?.dateOfBirth?.substring(0, 10)}
//           </p>
//           <p>
//             <strong>Số điện thoại:</strong> {teacher.phone}
//           </p>
//           <p>
//             <strong>Mã giáo viên:</strong> {teacher.teacherCode}
//           </p>
//           <p>
//             <strong>Môn dạy:</strong> {teacher.subject}
//           </p>
//           <p>
//             <strong>Tổ bộ môn:</strong> {teacher.department}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// TeacherViewModal.propTypes = {
//   showViewModal: PropTypes.bool.isRequired,
//   setShowViewModal: PropTypes.func.isRequired,
//   teacher: PropTypes.object,
// };

// export default TeacherViewModal;
import { X, User, Calendar, Phone, BookOpen, Users } from "lucide-react";
import PropTypes from "prop-types";

const TeacherViewModal = ({ showViewModal, setShowViewModal, teacher }) => {
  if (!showViewModal || !teacher) return null;

  const { user } = teacher;

  // Lấy chữ cái đầu tên nếu không có avatar
  const getAvatarInitials = (name) => {
    return name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không có thông tin";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white">
        <div className="flex items-center justify-between border-b p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Chi tiết giáo viên
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
              {user?.avatarUrl ? (
                <img
                  className="h-20 w-20 rounded-full object-cover"
                  src={user.avatarUrl}
                  alt={user.fullName}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-xl font-medium text-blue-600">
                    {getAvatarInitials(user?.fullName || "")}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-6">
              <h4 className="text-xl font-semibold text-gray-900">
                {user?.fullName}
              </h4>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Mã giáo viên: {teacher.teacherCode}
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
                    {user?.gender === "male" ? "Nam" : "Nữ"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                  <p className="text-gray-900">
                    {formatDate(user?.dateOfBirth)}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Số điện thoại
                  </p>
                  <p className="text-gray-900">{teacher.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <BookOpen className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Môn giảng dạy
                  </p>
                  <p className="text-gray-900">
                    {teacher.subjects?.map((s) => s.name).join(", ") ||
                      "Không rõ"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổ bộ môn</p>
                  <p className="text-gray-900">{teacher.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TeacherViewModal.propTypes = {
  showViewModal: PropTypes.bool.isRequired,
  setShowViewModal: PropTypes.func.isRequired,
  teacher: PropTypes.object,
};

export default TeacherViewModal;
