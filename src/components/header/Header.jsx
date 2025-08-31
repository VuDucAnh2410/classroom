// src/components/layout/Header.jsx

import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm Link và useNavigate
import {
  FaSearch,
  FaUserCircle,
  FaHome,
  FaGraduationCap,
  FaClipboardList,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { GoTriangleDown } from "react-icons/go";
import { IoNotificationsCircle } from "react-icons/io5";
import { DropdownItem } from "./DropdownItem";
import { LoginContext } from "../contexts/AuthProvider";
import { SubjectContext } from "../contexts/SubjectProvider";
import { EnrollmentsContext } from "../contexts/EnrollmentsProvider";

// Component con cho mỗi mục trong menu

function Header() {
  // State để quản lý trạng thái đóng/mở của dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref để theo dõi element dropdown
  const navigate = useNavigate();

  // LẤY HÀM ĐĂNG XUẤT TỪ CONTEXT
  const { handleLogout: contextLogout, auth } = useContext(LoginContext);
  const allSubjects = useContext(SubjectContext);
  const allEnrollments = useContext(EnrollmentsContext);

  const userClasses = useMemo(() => {
    if (!auth?.id || !allSubjects || !allEnrollments) return [];
    const taughtClasses = allSubjects.filter((sub) => sub.user_id === auth.id);
    const enrolledClassIds = allEnrollments
      .filter((en) => en.user_id === auth.id)
      .map((en) => en.class_id);
    const enrolledClasses = allSubjects.filter((sub) =>
      enrolledClassIds.includes(sub.id)
    );
    const combinedClasses = [...taughtClasses, ...enrolledClasses];
    const uniqueClasses = combinedClasses.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );
    return uniqueClasses.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [auth, allSubjects, allEnrollments]);

  // Logic để đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    // Lắng nghe sự kiện click
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Dọn dẹp event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    if (contextLogout) {
      contextLogout();
    }
    setIsDropdownOpen(false);
    navigate("/");
  };

  return (
    <div className="flex justify-between shadow-md bg-white p-3 w-full relative">
      <img src="/image/Logo.png" alt="Logo" style={{ height: "40px" }} />
      <div className="box flex items-center gap-3 text-blue-500">
        <FaSearch size={20} className="cursor-pointer" />
        <IoNotificationsCircle size={24} className="cursor-pointer" />
        <p className="cursor-pointer">Phản hồi</p>

        {/* Bọc trigger (avatar, tên, icon) để bắt sự kiện click và gắn Ref */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
          >
            <p className="text-blue-500">{auth?.username || "User"}</p>
            <div className="img-box">
              <img
                src="/image/Avar.png"
                alt="avatar"
                className="w-[30px] h-[30px] rounded-full object-cover"
              />
            </div>
            <GoTriangleDown
              size={16}
              className={`transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Menu dropdown được hiển thị có điều kiện */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-md shadow-xl z-20 p-2 border border-gray-200">
              <div className="p-2 border-b">
                <DropdownItem
                  icon={<FaUserCircle size={20} />}
                  text="Tài khoản"
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                />
              </div>
              <div className="p-2 border-b">
                <DropdownItem
                  icon={<FaHome size={20} />}
                  text="Trang chủ"
                  to="/"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <DropdownItem
                  icon={<FaClipboardList size={20} />}
                  text="Điểm số"
                  to={`/class/${userClasses[0].id}/grades`}
                  onClick={() => setIsDropdownOpen(false)}
                />
              </div>
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md w-full text-left"
                >
                  <FaSignOutAlt size={20} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
