// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
//import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "male",
    dateOfBirth: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/auth/get-profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { fullName, gender, dateOfBirth, avatarUrl } = res.data.user;
        setFormData({ fullName, gender, dateOfBirth, avatar: null });
        setAvatarPreview(avatarUrl);
      } catch (err) {
        console.error(err);
        setMessage("Không thể tải thông tin cá nhân.");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });
    if (file) setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("gender", formData.gender);
    data.append("dateOfBirth", formData.dateOfBirth);
    if (formData.avatar) data.append("image", formData.avatar);

    try {
      setLoading(true);
      await axios.put("/api/auth/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage("Cập nhật thành công.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-20 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">
        Cập nhật thông tin cá nhân
      </h2>
      {message && <p className="text-center text-red-500 mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Ngày sinh</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth?.substring(0, 10)}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar preview"
              className="w-20 h-20 mt-2 rounded-full object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
