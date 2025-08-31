"use client";
import { useState, useContext, useEffect } from "react";
import { Box, Menu, MenuItem, IconButton } from "@mui/material";
import { MdEdit, MdDelete, MdExitToApp, MdContentCopy } from "react-icons/md";
import { IoMdMore } from "react-icons/io";

// Import các context

// Import các component
import ModalAddClass from "./main/ModalAddClass";
import JoinClassModal from "./main/JoinClassModal";
import ClassDetailPage from "./class/ClassDetailPage";
import UpcomingTasks from "./UpcomingTasks";
import { UserContext } from "../contexts/userProvider";
import { EnrollmentsContext } from "../contexts/EnrollmentsProvider";
import { deleteDocument, updateDocument } from "../services/firebaseService";
import { LoginContext } from "../contexts/AuthProvider";
import { SubjectContext } from "../contexts/SubjectProvider";
import { Link } from "react-router-dom";

const ClassCard = ({ classInfo, currentUserId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const users = useContext(UserContext);
  const isOwner = classInfo.user_id === currentUserId;
  const teacher = users.find((user) => user.id === classInfo.user_id);
  const { auth } = useContext(LoginContext);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    const newName = prompt("Nhập tên lớp mới:", classInfo.name);
    if (newName && newName.trim()) {
      updateDocument("class", classInfo.id, { name: newName.trim() });
    }
    handleMenuClose(event);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn xóa lớp "${classInfo.name}"?`)) {
      deleteDocument("class", classInfo.id);
    }
    handleMenuClose(event);
  };

  const handleLeave = (event) => {
    event.stopPropagation();
    const enrollment = enrollments.find(
      (e) => e.sub_id === classInfo.id && e.user_id === currentUserId
    );
    if (
      enrollment &&
      window.confirm(`Bạn có chắc muốn rời lớp "${classInfo.name}"?`)
    ) {
      deleteDocument("enrollments", enrollment.id);
    }
    handleMenuClose(event);
  };

  const handleCopyCode = (event) => {
    event.stopPropagation();
    navigator.clipboard
      .writeText(classInfo.id)
      .then(() => alert("Đã sao chép mã lớp!"));
  };

  return (
    <Link
      to={`/class/${classInfo.id}`}
      className="bg-white rounded-lg shadow-md border border-gray-200 flex flex-col h-72 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className={`text-white p-4 rounded-t-lg relative h-28  ${auth.id == classInfo.user_id ? "bg-blue-600" : "bg-orange-600"  }`}>
        <div className="flex justify-between items-start">
          <div className="w-4/5">
            <h3 className="font-bold text-xl truncate" title={classInfo.name}>
              {classInfo.name}
            </h3>
          </div>
          <IconButton onClick={handleMenuClick} sx={{ color: "white" }}>
            <IoMdMore size={24} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
          >
            {isOwner ? (
              [
                <MenuItem key="edit" onClick={handleEdit}>
                  <MdEdit className="mr-2" /> Sửa
                </MenuItem>,
                <MenuItem key="delete" onClick={handleDelete}>
                  <MdDelete className="mr-2" /> Xóa
                </MenuItem>,
              ]
            ) : (
              <MenuItem onClick={handleLeave}>
                <MdExitToApp className="mr-2" /> Rời lớp
              </MenuItem>
            )}
          </Menu>
        </div>
        <p className="mt-2 text-sm">
          Giáo viên:{" "}
          <span className="underline">{teacher?.username || "N/A"}</span>
        </p>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-sm text-gray-600">
          {classInfo.description || "Chưa có mô tả."}
        </p>
      </div>
      <div className="border-t px-4 py-2 flex justify-between items-center">
        <p className="text-xs text-gray-500">Mã lớp: {classInfo.id}</p>
        <IconButton
          onClick={handleCopyCode}
          size="small"
          title="Sao chép mã lớp"
        >
          <MdContentCopy size={16} />
        </IconButton>
      </div>
    </Link>
  );
};

function Home() {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [classBy, setClassBy] = useState([]);
  const { auth } = useContext(LoginContext);
  const allSubjects = useContext(SubjectContext);
  const enrollments = useContext(EnrollmentsContext);
  

  useEffect(() => {
    const classByUser = allSubjects.filter(e => e.user_id == auth.id);
    const entroByUser = enrollments.filter(e => e.user_id == auth.id);
       entroByUser.map(e => {
         const a = allSubjects.find(b => b.id == e.class_id);
         const b = classByUser.find(c => c.id == a.id);
         if(!b) {
             classByUser.push(a)
         }
       });
       setClassBy(classByUser);
  },[auth,enrollments, allSubjects]);
  if (!auth) {
    return <div>Vui lòng đăng nhập.</div>;
  }

  if (selectedClass) {
    return (
      <NotificationProvider classId={selectedClass.id}>
        <ClassDetailPage
          subjectInfo={selectedClass}
          onBack={() => setSelectedClass(null)}
        />
      </NotificationProvider>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Box
        sx={{
          display: "flex",
          gap: 4,
          maxWidth: "1400px",
          mx: "auto",
          p: { xs: 2, md: 4 },
          alignItems: "flex-start",
        }}
      >
        <main style={{ flex: 3 }}>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Lớp học của tôi
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Tạo lớp học
              </button>
              <button
                onClick={() => setJoinModalOpen(true)}
                className="border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg"
              >
                Tham gia lớp
              </button>
            </div>
          </div>
          {classBy.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {classBy.map((cls) => (
                <ClassCard
                  key={cls.id}
                  classInfo={cls}
                  onCardClick={setSelectedClass}
                  currentUserId={auth.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 text-lg">
                Bạn chưa tham gia lớp học nào.
              </p>
            </div>
          )}
        </main>

        <aside style={{ flex: 1, position: "sticky", top: "20px" }}>
          <UpcomingTasks />
        </aside>
      </Box>

      <ModalAddClass
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
      <JoinClassModal
        isOpen={isJoinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
    </div>
  );
}

export default Home;
