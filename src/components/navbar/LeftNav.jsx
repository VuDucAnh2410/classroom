import React, { useContext, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { FaBook } from "react-icons/fa";
import { GrScorecard } from "react-icons/gr";
import { IoMdHome } from "react-icons/io";
import { IoSettings } from "react-icons/io5";
import { Typography } from "@mui/material";

import { LoginContext } from "../contexts/AuthProvider";
import { SubjectContext } from "../contexts/SubjectProvider";
import { EnrollmentsContext } from "../contexts/EnrollmentsProvider";

function LeftNav() {
  const { auth } = useContext(LoginContext);
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

  const getNavLinkClass = ({ isActive }) =>
    `item flex items-center p-2 rounded-lg hover:bg-gray-200 no-underline text-current ${
      isActive ? "bg-blue-100 text-blue-600 font-bold" : ""
    }`;

  return (
    <div className="w-1/6">
      <div className="nav flex flex-col p-5 gap-4 text-base">
        <NavLink to="/" className={getNavLinkClass}>
          <IoMdHome size={22} className="mr-3" /> Trang chủ
        </NavLink>

        {userClasses.length > 0 && (
          <NavLink
            to={`/class/${userClasses[0].id}/grades`}
            className={getNavLinkClass}
          >
            <GrScorecard size={22} className="mr-3" /> Điểm số
          </NavLink>
        )}

        <NavLink to="/settings" className={getNavLinkClass}>
          <IoSettings size={22} className="mr-3" /> Cài đặt
        </NavLink>
      </div>

      <hr className="text-gray-400 mx-5" />

      <div className="flex flex-col p-5 gap-4 text-base">
        <Typography variant="subtitle2" color="text.secondary" sx={{ px: 2 }}>
          LỚP HỌC
        </Typography>

        {userClasses.slice(0, 5).map((subject) => (
          <NavLink
            key={subject.id}
            to={`/class/${subject.id}`}
            className={getNavLinkClass}
          >
            <FaBook size={22} className="mr-3" />
            <span className="truncate">{subject.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default LeftNav;
