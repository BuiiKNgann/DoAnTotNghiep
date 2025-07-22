import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import axios from "../ultils/axios";
import TeacherFormModal from "../components/TeacherFormModal";
import TeacherViewModal from "../components/TeacherViewModal";

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "male",
    dateOfBirth: "",
    teacherCode: "",
    subject: "",
    department: "",
    phone: "",
    image: null,
  });
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewTeacher, setViewTeacher] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/teachers", config());
      // setTeachers(res.data);
      setTeachers(res.data.teachers);
    } catch (err) {
      console.error("Lỗi khi tải giáo viên:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      for (const key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }
      if (editingTeacherId) {
        await axios.put(`/api/teachers/${editingTeacherId}`, data, config());
        alert("Cập nhật giáo viên thành công!");
      } else {
        await axios.post("/api/teachers/", data, config());
        alert("Tạo giáo viên thành công!");
      }
      resetForm();
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu giáo viên:", err);
      alert("Lỗi khi xử lý giáo viên");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      gender: "male",
      dateOfBirth: "",
      teacherCode: "",
      // subject: "",
      subjects: [],
      department: "",
      phone: "",
      image: null,
    });
    setEditingTeacherId(null);
  };

  const handleEdit = (teacher) => {
    const { user } = teacher;
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "",
      gender: user.gender,
      dateOfBirth: user.dateOfBirth?.substring(0, 10) || "",
      teacherCode: teacher.teacherCode,
      subjects: teacher.subjects.map((s) => s._id),
      department: teacher.department,
      phone: teacher.phone,
      image: null,
    });
    setEditingTeacherId(teacher._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/teachers/${id}`, config());
        alert("Xóa giáo viên thành công!");
        fetchTeachers();
      } catch (err) {
        console.error("Lỗi khi xóa giáo viên:", err);
        alert("Lỗi khi xóa giáo viên");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleView = (teacher) => {
    setViewTeacher(teacher);
    setShowViewModal(true);
  };
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/api/subjects", config());
        setSubjects(res.data.subjects || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách môn học:", err);
      }
    };

    fetchSubjects();
  }, []);
  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Quản lý giáo viên
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Danh sách và thao tác giáo viên trong hệ thống
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              <Plus size={20} />
              {loading ? "Đang tải..." : "Thêm giáo viên"}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-500">
                Đang tải dữ liệu...
              </div>
            ) : (
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Họ tên
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Mã GV
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Bộ môn
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Tổ
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teachers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        Không có giáo viên nào
                      </td>
                    </tr>
                  ) : (
                    teachers.map((teacher) => (
                      <tr key={teacher._id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {teacher.user?.fullName}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {teacher.user?.email}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {teacher.teacherCode}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {teacher.subjects && teacher.subjects.length > 0
                            ? teacher.subjects.map((s) => s.name).join(", ")
                            : "Không rõ"}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {teacher.department}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleView(teacher)}
                              title="Xem"
                            >
                              <Eye
                                size={16}
                                className="text-blue-600 hover:text-blue-800"
                              />
                            </button>
                            <button
                              onClick={() => handleEdit(teacher)}
                              title="Sửa"
                            >
                              <Edit
                                size={16}
                                className="text-green-600 hover:text-green-800"
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(teacher._id)}
                              title="Xoá"
                            >
                              <Trash2
                                size={16}
                                className="text-red-600 hover:text-red-800"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* <TeacherFormModal
          showModal={showModal}
          closeModal={() => setShowModal(false)}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingTeacherId={editingTeacherId}
          loading={loading}
        /> */}
        <TeacherFormModal
          showModal={showModal}
          closeModal={() => setShowModal(false)}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingTeacherId={editingTeacherId}
          loading={loading}
          subjects={subjects}
        />
        <TeacherViewModal
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          teacher={viewTeacher}
        />
      </div>
    </div>
  );
};

export default TeacherManagement;
