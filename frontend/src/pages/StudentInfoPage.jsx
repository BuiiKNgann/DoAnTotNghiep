import { useEffect, useState } from "react";
import axios from "axios";
import { GraduationCap } from "lucide-react";

const StudentInfoPage = () => {
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/auth/get-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentProfile(res.data.studentProfile);
    };

    fetchProfile();
  }, []);

  if (!studentProfile)
    return (
      <p className="text-center text-gray-600 italic">Đang tải dữ liệu...</p>
    );

  const {
    studentCode,
    grade,
    academicYear,
    status,
    class: classInfo,
  } = studentProfile;

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl border border-gray-100 transform transition-all duration-300 hover:shadow-3xl">
      <h2 className="text-2xl font-extrabold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text flex items-center mb-5">
        <GraduationCap className="mr-2 text-blue-600" size={28} />
        Thông tin học sinh
      </h2>
      <div className="space-y-3">
        <p className="text-gray-800">
          <span className="font-semibold text-gray-900">Học sinh:</span>{" "}
          {studentProfile?.user?.fullName || "Chưa có thông tin"}
        </p>
        <p className="text-gray-800">
          <span className="font-semibold text-gray-900">Mã học sinh:</span>{" "}
          {studentCode || "Chưa có thông tin"}
        </p>
        <p className="text-gray-800">
          <span className="font-semibold text-gray-900">Khối:</span>{" "}
          {grade || "Chưa có thông tin"}
        </p>
        <p className="text-gray-800">
          <span className="font-semibold text-gray-900">Năm học:</span>{" "}
          {academicYear || "Chưa có thông tin"}
        </p>
        <p className="text-gray-800">
          <span className="font-semibold text-gray-900">Trạng thái:</span>{" "}
          {status === "active" ? "Đang học" : "Nghỉ" || "Chưa có thông tin"}
        </p>
        <p className="text-gray-800">
          <span className="font-semibold text-gray-900">Lớp:</span>{" "}
          {classInfo?.className || "Chưa có thông tin"}
        </p>
        <p className="text-gray-800">
          <span className="font-semibold text-gray-900">Giáo viên CN:</span>{" "}
          {classInfo?.homeroomTeacher?.fullName || "Chưa có thông tin"}
        </p>
        <p className="text-gray-800">
          <span className="font-semibold text-gray-900">Phụ huynh:</span>{" "}
          {studentProfile?.parent?.fullName || "Chưa có thông tin"}
        </p>
      </div>
    </div>
  );
};

export default StudentInfoPage;
