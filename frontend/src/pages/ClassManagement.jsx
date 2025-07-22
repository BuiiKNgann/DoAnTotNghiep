import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import axios from "../ultils/axios";
import ClassFormModal from "../components/ClassFormModal";
import ClassViewModal from "../components/ClassViewModal";

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [teacherOptions, setTeacherOptions] = useState([]); // ✅ Thêm state giáo viên

  const [formData, setFormData] = useState({
    className: "",
    grade: "",
    academicYear: "",
    homeroomTeacher: "",
  });
  const [editingClassId, setEditingClassId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewClass, setViewClass] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const config = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/classes", config());
      console.log("✅ Response classes:", res.data); // <-- Thêm dòng này
      setClasses(res.data.classes);
    } catch (err) {
      console.error("Lỗi khi tải danh sách lớp:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/api/teachers", config());
      setTeacherOptions(res.data.teachers); // ✅ Đảm bảo res.data.teachers là mảng populated user
    } catch (err) {
      console.error("Lỗi khi tải giáo viên:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingClassId) {
        await axios.put(`/api/classes/${editingClassId}`, formData, config());
        alert("Cập nhật lớp thành công!");
      } else {
        await axios.post("/api/classes", formData, config());
        alert("Tạo lớp thành công!");
      }
      resetForm();
      setShowModal(false);
      fetchClasses();
    } catch (err) {
      console.error("Lỗi khi gửi dữ liệu lớp:", err);
      alert("Lỗi khi xử lý lớp");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      className: "",
      grade: "",
      academicYear: "",
      homeroomTeacher: "",
    });
    setEditingClassId(null);
  };

  const handleEdit = (classItem) => {
    setFormData({
      className: classItem.className,
      grade: classItem.grade,
      academicYear: classItem.academicYear,
      homeroomTeacher: classItem.homeroomTeacher?._id || "",
    });
    setEditingClassId(classItem._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá lớp này?")) {
      try {
        setLoading(true);
        await axios.delete(`/api/classes/${id}`, config());
        alert("Xoá lớp thành công!");
        fetchClasses();
      } catch (err) {
        console.error("Lỗi khi xoá lớp:", err);
        alert("Lỗi khi xoá lớp");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleView = async (classItem) => {
    try {
      const [resDetail, resTeachers] = await Promise.all([
        axios.get(`/api/classes/${classItem._id}`, config()),
        axios.get(`/api/assignments/by-class/${classItem._id}`, config()),
      ]);

      const classData = resDetail.data.class;
      const teachers = resTeachers.data.teachers;

      // Gộp dữ liệu và tính số lượng
      setViewClass({
        ...classData,
        subjectTeachers: teachers,
        studentCount: classData.students?.length || 0,
        teacherCount: teachers.length,
      });
      setShowViewModal(true);
    } catch (err) {
      console.error("Lỗi khi xem chi tiết lớp:", err);
      alert("Không thể tải chi tiết lớp");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers(); // ✅ Load giáo viên khi load trang
  }, []);
  useEffect(() => {
    console.log("👉 Kiểm tra giá trị classes:", classes);
  }, [classes]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Quản lý lớp
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Danh sách và thao tác lớp trong hệ thống
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
              {loading ? "Đang tải..." : "Thêm lớp"}
            </button>
          </div>
        </div>

        {/* <div className="overflow-hidden rounded-lg bg-white shadow-sm">
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
                      Tên lớp
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Khối
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Năm học
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      GVCN
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classes.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        Không có lớp nào
                      </td>
                    </tr>
                  ) : (
                    classes.map((cls) => (
                      <tr key={cls._id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {cls.className}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {cls.grade}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {cls.academicYear}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {cls.homeroomTeacher?.user?.fullName || "-"}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button onClick={() => handleView(cls)} title="Xem">
                              <Eye
                                className="text-blue-600 hover:text-blue-800"
                                size={16}
                              />
                            </button>
                            <button onClick={() => handleEdit(cls)} title="Sửa">
                              <Edit
                                className="text-green-600 hover:text-green-800"
                                size={16}
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(cls._id)}
                              title="Xoá"
                            >
                              <Trash2
                                className="text-red-600 hover:text-red-800"
                                size={16}
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
        </div> */}
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
                      Tên lớp
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Khối
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Năm học
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      GVCN
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(classes) && classes.length > 0 ? (
                    classes.map((cls) => (
                      <tr key={cls._id}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {cls.className}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {cls.grade}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {cls.academicYear}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {cls.homeroomTeacher?.user?.fullName || "-"}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button onClick={() => handleView(cls)} title="Xem">
                              <Eye
                                className="text-blue-600 hover:text-blue-800"
                                size={16}
                              />
                            </button>
                            <button onClick={() => handleEdit(cls)} title="Sửa">
                              <Edit
                                className="text-green-600 hover:text-green-800"
                                size={16}
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(cls._id)}
                              title="Xoá"
                            >
                              <Trash2
                                className="text-red-600 hover:text-red-800"
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        Không có lớp nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* ✅ Truyền teacherOptions vào modal */}
        <ClassFormModal
          showModal={showModal}
          closeModal={() => setShowModal(false)}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          editingClassId={editingClassId}
          loading={loading}
          teacherOptions={teacherOptions}
        />

        <ClassViewModal
          showViewModal={showViewModal}
          setShowViewModal={setShowViewModal}
          classData={viewClass} // ✅ Đổi đúng prop tên
        />
      </div>
    </div>
  );
};

export default ClassManagement;
