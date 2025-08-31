// src/components/layout/Header.jsx

import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaHome,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { GoTriangleDown } from "react-icons/go";
import { IoNotificationsCircle } from "react-icons/io5";
import { DropdownItem } from "./DropdownItem";
import { Typography } from "@mui/material";

import { LoginContext } from "../contexts/AuthProvider";
import { SubjectContext } from "../contexts/SubjectProvider";
import { EnrollmentsContext } from "../contexts/EnrollmentsProvider";
import { NotificationContext } from "../contexts/NotificationProvider";
import { updateDocument } from "../services/firebaseService";

function Header() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  const [isNotiDropdownOpen, setIsNotiDropdownOpen] = useState(false);
  const notiDropdownRef = useRef(null);

  const navigate = useNavigate();

  const { handleLogout: contextLogout, auth } = useContext(LoginContext);
  const allSubjects = useContext(SubjectContext);
  const allEnrollments = useContext(EnrollmentsContext);
  const notificationsFromContext = useContext(NotificationContext) || [];

  const [localNotifications, setLocalNotifications] = useState(
    notificationsFromContext
  );

  useEffect(() => {
    setLocalNotifications(notificationsFromContext);
  }, [notificationsFromContext]);

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
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
    return uniqueClasses.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [auth, allSubjects, allEnrollments]);

  const hasUnreadNotifications = useMemo(() => {
    return localNotifications.some((noti) => !noti.isRead);
  }, [localNotifications]);

  const sortedNotifications = useMemo(() => {
    if (!notificationsFromContext || notificationsFromContext.length === 0) {
      return [];
    }

    // SỬA LẠI HÀM SORT Ở ĐÂY
    return [...notificationsFromContext].sort((a, b) => {
      // Nếu b không có ngày tạo, đẩy nó xuống cuối
      if (!b.createdAt) return -1;
      // Nếu a không có ngày tạo, đẩy nó xuống cuối
      if (!a.createdAt) return 1;

      // Nếu cả hai đều có ngày tạo, so sánh bình thường
      return b.createdAt.toDate() - a.createdAt.toDate();
    });
  }, [notificationsFromContext]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        notiDropdownRef.current &&
        !notiDropdownRef.current.contains(event.target)
      ) {
        setIsNotiDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userDropdownRef, notiDropdownRef]);

  const handleLogout = () => {
    if (contextLogout) contextLogout();
    setIsUserDropdownOpen(false);
    navigate("/");
  };

  const handleNotificationClick = async (notification) => {
    const isAlreadyRead = notification.isRead;
    setLocalNotifications((currentNotifications) =>
      currentNotifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );
    setIsNotiDropdownOpen(false);
    navigate(`/class/${notification.class_id}`);

    if (!isAlreadyRead) {
      try {
        await updateDocument("notifications", notification.id, {
          isRead: true,
        });
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
        setLocalNotifications(notificationsFromContext);
      }
    }
  };

  return (
    <div className="flex justify-between shadow-md bg-white p-3 w-full relative">
      <Link to="/">
        <img src="/image/Logo.png" alt="Logo" style={{ height: "40px" }} />
      </Link>
      <div className="box flex items-center gap-3 text-blue-500">
        <div className="relative" ref={notiDropdownRef}>
          <IoNotificationsCircle
            size={28}
            className={`cursor-pointer ${
              hasUnreadNotifications ? "text-red-500" : "text-blue-500"
            }`}
            onClick={() => setIsNotiDropdownOpen(!isNotiDropdownOpen)}
          />
          {isNotiDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-md shadow-xl z-20 border border-gray-200">
              <div className="p-3 border-b">
                <Typography variant="h6">Thông báo</Typography>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {sortedNotifications.length > 0 ? (
                  sortedNotifications.map((noti) => (
                    <div
                      key={noti.id}
                      onClick={() => handleNotificationClick(noti)}
                      className={`p-3 border-b hover:bg-gray-100 cursor-pointer ${
                        !noti.isRead ? "bg-blue-50" : ""
                      }`}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: !noti.isRead ? "bold" : "normal" }}
                      >
                        {noti.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {noti.createdAt &&
                          new Date(noti.createdAt.toDate()).toLocaleString(
                            "vi-VN"
                          )}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Không có thông báo nào.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={userDropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <p className="text-blue-500">{auth?.username || "User"}</p>
            <div className="img-box">
              <img
                src={auth?.photoURL || "/image/Avar.png"}
                alt="avatar"
                className="w-[30px] h-[30px] rounded-full object-cover"
              />
            </div>
            <GoTriangleDown
              size={16}
              className={`transition-transform ${
                isUserDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {isUserDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-md shadow-xl z-20 p-2 border border-gray-200">
              <div className="p-2 border-b">
                <DropdownItem
                  icon={<FaUserCircle size={20} />}
                  text="Tài khoản"
                  to="/settings"
                  onClick={() => setIsUserDropdownOpen(false)}
                />
              </div>
              <div className="p-2 border-b">
                <DropdownItem
                  icon={<FaHome size={20} />}
                  text="Trang chủ"
                  to="/"
                  onClick={() => setIsUserDropdownOpen(false)}
                />
                {userClasses.length > 0 && (
                  <DropdownItem
                    icon={<FaClipboardList size={20} />}
                    text="Điểm số"
                    to={`/class/${userClasses[0].id}/grades`}
                    onClick={() => setIsUserDropdownOpen(false)}
                  />
                )}
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
