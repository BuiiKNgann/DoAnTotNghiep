import PropTypes from "prop-types";
import {
  X,
  Users,
  GraduationCap,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";

const ClassViewModal = ({ showViewModal, setShowViewModal, classData }) => {
  if (!showViewModal || !classData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Chi tiết lớp học</h2>
            <button
              onClick={() => setShowViewModal(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                Tên lớp:
              </span>
              <span className="font-semibold">{classData.className}</span>
            </div>

            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Khối:</span>
              <span className="font-semibold">{classData.grade}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                Năm học:
              </span>
              <span className="font-semibold">{classData.academicYear}</span>
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">GVCN:</span>
              <span className="font-semibold">
                {classData.homeroomTeacher?.user?.fullName || "Chưa có GVCN"}
              </span>
            </div>
          </div>

          {/* Statistics */}
          <div className="flex space-x-4 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Học sinh:</span>
              <span className="font-semibold text-blue-600">
                {classData.studentCount}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Giáo viên:</span>
              <span className="font-semibold text-green-600">
                {classData.teacherCount}
              </span>
            </div>
          </div>

          {/* Students List */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="font-medium text-gray-800">Danh sách học sinh</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {classData.students?.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {/* {classData.students.map((student, index) => (
                    <li
                      key={student._id}
                      className="flex items-center space-x-2"
                    >
                      <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span>{student.user?.fullName}</span>
                    </li>
                  ))} */}
                  {[...classData.students]
                    .sort((a, b) => {
                      const getLastName = (name) => {
                        const parts = name?.trim().split(" ") || [];
                        return parts[parts.length - 1] || "";
                      };

                      const nameA = getLastName(a.user?.fullName).toLowerCase();
                      const nameB = getLastName(b.user?.fullName).toLowerCase();
                      return nameA.localeCompare(nameB, "vi", {
                        sensitivity: "base",
                      });
                    })
                    .map((student, index) => (
                      <li
                        key={student._id}
                        className="flex items-center space-x-2"
                      >
                        <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <span>{student.user?.fullName}</span>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  Chưa có học sinh
                </p>
              )}
            </div>
          </div>

          {/* Teachers List */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <GraduationCap className="w-4 h-4 text-green-600" />
              <h3 className="font-medium text-gray-800">Giáo viên giảng dạy</h3>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
              {classData.subjectTeachers?.length > 0 ? (
                <ul className="space-y-1 text-sm">
                  {classData.subjectTeachers.map((teacher) => (
                    <li
                      key={teacher._id}
                      className="flex items-center justify-between"
                    >
                      <span>{teacher.teacher?.user?.fullName}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {teacher.subject?.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">
                  Chưa có giáo viên bộ môn
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ClassViewModal.propTypes = {
  showViewModal: PropTypes.bool,
  setShowViewModal: PropTypes.func,
  classData: PropTypes.object,
};

export default ClassViewModal;
