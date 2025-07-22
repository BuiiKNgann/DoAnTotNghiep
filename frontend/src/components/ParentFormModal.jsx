import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "../ultils/axios.js";

const ParentFormModal = ({ parent, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    gender: "male",
    dateOfBirth: "",
    image: null,
  });

  useEffect(() => {
    if (parent) {
      setFormData({
        fullName: parent.fullName || "",
        email: parent.email || "",
        password: "",
        gender: parent.gender || "male",
        dateOfBirth: parent.dateOfBirth?.substring(0, 10) || "",
        image: null,
      });
    }
  }, [parent]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("gender", formData.gender);
    data.append("dateOfBirth", formData.dateOfBirth);
    if (formData.image) {
      data.append("image", formData.image); // đúng key backend nhận
    }

    try {
      if (parent) {
        await axios.put(`/api/parent/${parent._id}`, data);
        alert("Cập nhật phụ huynh thành công!");
      } else {
        data.append("email", formData.email);
        data.append("password", formData.password);
        await axios.post("/api/parent/create", data);
        alert("Tạo phụ huynh thành công!");
      }

      onClose();
    } catch (err) {
      alert(err?.data?.message || "Đã xảy ra lỗi khi gửi dữ liệu");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">
          {parent ? "Cập nhật phụ huynh" : "Thêm phụ huynh"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Họ tên"
            className="w-full border px-3 py-2"
            required
          />
          {!parent && (
            <>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border px-3 py-2"
                required
              />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mật khẩu"
                className="w-full border px-3 py-2"
                required
              />
            </>
          )}
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border px-3 py-2"
          />
          {parent?.avatarUrl && (
            <div className="text-sm">
              Ảnh hiện tại:
              <img
                src={parent.avatarUrl}
                alt="avatar"
                className="w-20 h-20 object-cover mt-1 rounded"
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {parent ? "Cập nhật" : "Tạo mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ParentFormModal.propTypes = {
  parent: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ParentFormModal;
