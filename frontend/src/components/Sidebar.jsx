import PropTypes from "prop-types";
import {
  Settings,
  Home,
  BookOpen,
  Users,
  MessageSquare,
  Calendar,
  BarChart3,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const [role, setRole] = useState("");
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setRole(user.role);
      } catch (e) {
        console.error("Invalid user JSON in localStorage");
      }
    }
  }, []);

  const menuItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: BookOpen, label: "Quản lý học tập", path: "/study", badge: "5" },
    { icon: Users, label: "Kết nối cộng đồng", path: "/community" },
    { icon: MessageSquare, label: "Tin nhắn", path: "/messages", badge: "12" },
    { icon: Calendar, label: "Lịch học", path: "/calendar" },
    { icon: BarChart3, label: "Báo cáo tiến độ", path: "/reports" },
    { icon: Settings, label: "Cài đặt", path: "/settings" },
    ...(role === "admin" || role === "teacher"
      ? [
          { icon: Users, label: "Quản lý học sinh", path: "/stuManagement" },
          {
            icon: Users,
            label: "Quản lý giáo viên",
            path: "/teacherManagement",
          },
          {
            icon: Users,
            label: "Quản lý phụ huynh",
            path: "/parentManagement",
          },
          {
            icon: Users,
            label: "Quản lý học kỳ",
            path: "/semester",
          },
          {
            icon: Users,
            label: "Quản lý môn học",
            path: "/subject",
          },
          {
            icon: Users,
            label: "Phân công giảng dạy",
            path: "/teacherAssignment",
          },
          {
            icon: Users,
            label: "Quản lý lớp",
            path: "/class",
          },
          {
            icon: Users,
            label: "Quản lý TKB",
            path: "/timetable",
          },

          {
            icon: Users,
            label: "Nhập điểm",
            path: "/gradeManagement",
          },
          {
            icon: Users,
            label: "Điểm danh",
            path: "/attendance",
          },
          {
            icon: Users,
            label: "Sổ hạnh kiểm",
            path: "/conduct",
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path || "#"}
                  className={`
                    flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center">
                    <item.icon size={18} className="mr-3" />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
