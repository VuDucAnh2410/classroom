import React, { useContext, useState } from "react";
import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import { MdFolder, MdAdd } from "react-icons/md";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../contexts/AuthProvider";
import { SubjectContext } from "../../contexts/SubjectProvider";
import { FolderContext } from "../../contexts/FolderProvider";
import { TasksContext } from "../../contexts/TasksProvider";
import { NotificationContext } from "../../contexts/NotificationProvider";
import BreadcrumbNavigation from "../BreadcrumbNavigation";
import NotificationItem from "./notification/NotificationItem";
import NotificationModal from "./notification/NotificationModal";
import UpcomingTasks from "../UpcomingTasks";
// Contexts
import { ContentItem } from "./ContentItem";
import { TaskItem } from "./TaskItem";
import CreateTopicModal from "./CreateTopicModal";
// Components

function ClassDetailPage({ children }) {
  const { auth } = useContext(LoginContext);
  const { id } = useParams();
  const navigate = useNavigate();

  // Lấy dữ liệu từ các context
  const allSubjects = useContext(SubjectContext) || [];
  const allFolders = useContext(FolderContext) || [];
  const allTasks = useContext(TasksContext) || [];
  const allNotifications = useContext(NotificationContext) || [];

  // State quản lý
  const [expandFolderId, setExpandFolderId] = useState(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Tìm thông tin lớp học và vai trò người dùng
  const subjectInfo = allSubjects.find((cls) => cls.id === id);
  const isTeacher = subjectInfo && auth.id === subjectInfo.user_id;

  // Lọc dữ liệu cho lớp học này
  const folders = allFolders.filter((f) => f.class_id === id && !f.parentId);
  const tasks = allTasks.filter((t) => t.class_id === id);

  // Lọc để chỉ hiển thị các thông báo chung (loại 'ANNOUNCEMENT') trong bảng tin
  const announcements = allNotifications.filter(
    (e) => e.class_id === id && e.type === "ANNOUNCEMENT"
  );

  // Các hàm xử lý modal
  const handleOpenFolderModal = () => setIsFolderModalOpen(true);
  const handleCloseFolderModal = () => setIsFolderModalOpen(false);
  const handleOpenNotificationModal = () => setIsNotificationModalOpen(true);
  const handleCloseNotificationModal = () => setIsNotificationModalOpen(false);
  const handleOpenTaskModal = () => setIsTaskModalOpen(true);
  const handleCloseTaskModal = () => setIsTaskModalOpen(false);

  if (!subjectInfo) {
    return (
      <Typography sx={{ p: 3 }}>
        Đang tải hoặc không tìm thấy thông tin lớp học...
      </Typography>
    );
  }

  const tabs = [
    { name: "Bảng tin", path: `/class/${id}` },
    { name: "Mọi người", path: `/class/${id}/people` },
    { name: "Sổ điểm", path: `/class/${id}/grades` },
  ];

  const breadcrumbItems = [
    { label: "Trang chủ", onClick: () => navigate("/") },
  ];

  const handleFolderToggle = (folderId) => {
    setExpandFolderId((prevId) => (prevId === folderId ? null : folderId));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-8 gap-6 p-4">
        {/* Cột chính */}
        <div className="md:col-span-6">
          <Box>
            <BreadcrumbNavigation items={breadcrumbItems} />
            <Paper
              sx={{
                height: 200,
                mt: 2,
                p: 3,
                position: "relative",
                backgroundSize: "cover",
                color: "white",
                borderRadius: 2,
                backgroundImage:
                  "url(https://gstatic.com/classroom/themes/img_graduation.jpg)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {subjectInfo.name}
              </Typography>
            </Paper>

            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                mt: 2,
                bgcolor: "background.paper",
                borderRadius: "8px 8px 0 0",
              }}
            >
              {tabs.map((tab) => (
                <Button
                  key={tab.name}
                  component={NavLink}
                  to={tab.path}
                  end={tab.path.endsWith(`/class/${id}`)}
                  sx={{
                    py: 1.5,
                    px: 3,
                    color: "text.secondary",
                    "&.active": {
                      fontWeight: "bold",
                      color: "primary.main",
                      borderBottom: 2,
                      borderColor: "primary.main",
                      borderRadius: 0,
                    },
                  }}
                >
                  {tab.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ mt: 3 }}>
              {children ? (
                // Nếu là route con (ví dụ /people), render component con
                children
              ) : (
                // Nếu là route mặc định của lớp học, render nội dung bảng tin
                <Box>
                  <Paper
                    sx={{
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      sx={{
                        justifyContent: "flex-start",
                        color: "text.secondary",
                        textTransform: "none",
                        py: 1.5,
                      }}
                      onClick={handleOpenNotificationModal}
                    >
                      Thông báo nội dung nào đó cho lớp học của bạn...
                    </Button>
                    {isTeacher && (
                      <>
                        <IconButton
                          onClick={handleOpenFolderModal}
                          title="Tạo Chủ đề"
                        >
                          <MdFolder />
                        </IconButton>
                        <IconButton
                          onClick={handleOpenTaskModal}
                          title="Tạo Bài tập"
                        >
                          <MdAdd />
                        </IconButton>
                      </>
                    )}
                  </Paper>

                  {/* Hiển thị các thông báo chung */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {announcements.map((noti) => (
                      <NotificationItem key={noti.id} notification={noti} />
                    ))}
                  </Box>

                  {/* Hiển thị các thư mục và bài tập */}
                  <Box
                    sx={{
                      mt: 4,
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    {folders.map((folder) => (
                      <div key={folder.id}>
                        <div onClick={() => handleFolderToggle(folder.id)}>
                          <ContentItem folder={folder} />
                        </div>
                        <Box
                          sx={{
                            pl: 4,
                            borderLeft: "2px solid #e0e0e0",
                            ml: 2,
                            mt: 1,
                            display:
                              expandFolderId === folder.id ? "block" : "none",
                          }}
                        >
                          {tasks
                            .filter((task) => task.folder_id === folder.id)
                            .map((task) => (
                              <TaskItem key={task.id} task={task} />
                            ))}
                        </Box>
                      </div>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </div>

        {/* Cột phụ */}
        <div className="md:col-span-2">
          <UpcomingTasks idClass={id} />
        </div>
      </div>

      {/* Modals */}
      <CreateTopicModal
        open={isFolderModalOpen}
        handleClose={handleCloseFolderModal}
        id={id}
      />
      <AddTaskModal
        open={isTaskModalOpen}
        handleClose={handleCloseTaskModal}
        classId={id}
        folders={folders}
        className={subjectInfo.name}
      />
      <NotificationModal
        open={isNotificationModalOpen}
        handleClose={handleCloseNotificationModal}
        classId={id}
      />
    </>
  );
}

export default ClassDetailPage;
