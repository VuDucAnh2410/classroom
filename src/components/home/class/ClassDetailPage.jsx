import React, { useContext, useState } from "react";
import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import { MdFolder, MdAdd } from "react-icons/md";

// Contexts and Services
import BreadcrumbNavigation from "../BreadcrumbNavigation";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ContentItem } from "./ContentItem";
import { FolderContext } from "../../contexts/FolderProvider";
import CreateTopicModal from "./CreateTopicModal";
import Notification from "../nofication/Notification";
import { NotificationContext } from "../../contexts/NotificationProvider";
import NotificationItem from "../nofication/NotificationItem";
import { SubjectContext } from "../../contexts/SubjectProvider";
import AddTaskModal from "../task/AddTaskModal";
import { TasksContext } from "../../contexts/TasksProvider";
import UpcomingTasks from "../UpcomingTasks";
import { TaskItem } from "./TaskItem";
import { LoginContext } from "../../contexts/AuthProvider";
// --- Component con để hiển thị từng mục ---

// --- Component chính ---
function ClassDetailPage({ children }) {
  const { auth } = useContext(LoginContext);
  const allFolders = useContext(FolderContext);
  const allSubjects = useContext(SubjectContext) || [];
  const { id } = useParams();
  const navigate = useNavigate();
  const subjectInfo = allSubjects.find((cls) => cls.id === id);
  const [expand, setExpand] = useState(null);

  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const allTasks = useContext(TasksContext) || [];
  const allNotifications = useContext(NotificationContext);

  // Tạo state mới cho modal tạo bài tập
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const tasks = allTasks.filter((t) => t.class_id === id); //Lọc ra bài tập cho lớp học này
  // lọc những thư mục không có parentId (thư mục gốc của lớp)
  const folders = allFolders.filter((f) => f.class_id === id && !f.parentId);
  // TỰ LỌC để chỉ lấy thông báo cho lớp học này
  const notifications = allNotifications.filter((e) => e.class_id === id);
  // Hàm xử lý cho modal tạo thư mục
  const handleOpenFolderModal = () => setIsFolderModalOpen(true);
  const handleCloseFolderModal = () => setIsFolderModalOpen(false);

  //hàm xử lý riêng cho modal thông báo
  const handleOpenNotificationModal = () => setIsNotificationModalOpen(true);
  const handleCloseNotificationModal = () => setIsNotificationModalOpen(false);

  // hàm xử lý riêng cho modal tạo bài tập
  const handleOpenTaskModal = () => setIsTaskModalOpen(true);
  const handleCloseTaskModal = () => setIsTaskModalOpen(false);
  // XÁC ĐỊNH VAI TRÒ NGƯỜI DÙNG
  const isTeacher = subjectInfo && auth.id === subjectInfo.user_id;

  if (!subjectInfo) {
    return (
      <Typography sx={{ p: 3 }}>
        Đang tải hoặc không tìm thấy thông tin lớp học...
      </Typography>
    );
  }

  const tabs = [
    { name: "Lớp học", path: `/class/${id}` },
    { name: "Mọi người", path: `/class/${id}/people` },
  ];

  const onBack = () => navigate("/");
  const breadcrumbItems = [{ label: "Trang chủ", onClick: onBack }];
  const handleFolder = (id) => {
    if (id == expand) {
      setExpand(null);
    } else {
      setExpand(id);
    }
  };
  return (
    <>
      <div className="grid grid-cols-8 gap-3">
        <div className="col-span-6">
          <Box>
            <BreadcrumbNavigation items={breadcrumbItems} />
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                mt: 2,
              }}
            >
              <Box sx={{ flex: 3 }}>
                <Paper
                  sx={{
                    height: 200,
                    mb: 3,
                    p: 2,
                    position: "relative",
                    backgroundSize: "cover",
                    backgroundImage:
                      "url(https://gstatic.com/classroom/themes/img_code.jpg)",
                    color: "white",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{ position: "absolute", bottom: 16, left: 16 }}
                  >
                    {subjectInfo.name}
                  </Typography>
                </Paper>

                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                  {tabs.map((tab) => (
                    <Button
                      key={tab.name}
                      component={NavLink}
                      to={tab.path}
                      end={tab.path.endsWith(`/class/${id}`)}
                      sx={{
                        color: "text.secondary",
                        "&.active": {
                          fontWeight: "bold",
                          color: "primary.main",
                        },
                      }}
                    >
                      {tab.name}
                    </Button>
                  ))}
                </Box>

                <Box sx={{ mt: 3 }}>
                  {children ? (
                    // Nếu là route /lessons hoặc /people, render component con
                    children
                  ) : (
                    // Nếu là route /class/:id, render nội dung mặc định
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
                          sx={{ justifyContent: "flex-start" }}
                          onClick={handleOpenNotificationModal}
                        >
                          Thông báo...
                        </Button>
                        {isTeacher && (
                          <>
                            <IconButton
                              onClick={handleOpenFolderModal}
                              title="Tạo Thư mục"
                            >
                              <MdFolder />
                            </IconButton>
                            <IconButton
                              title="Tạo Bài tập"
                              onClick={handleOpenTaskModal}
                            >
                              <MdAdd />
                            </IconButton>
                          </>
                        )}
                      </Paper>

                      <Box sx={{ mt: 4 }}>
                        {notifications.map((noti) => (
                          <NotificationItem key={noti.id} notification={noti} />
                        ))}
                      </Box>
                      <Box sx={{ mt: 4 }}>
                        {folders.map((folder) => (
                          <div key={folder.id}>
                            <div onClick={() => handleFolder(folder.id)}>
                              <ContentItem folder={folder} />
                            </div>
                            <Box
                              sx={{
                                pl: 4,
                                borderLeft: "2px solid #e0e0e0",
                                ml: 2,
                                display: expand == folder.id ? "" : "none",
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
            </Box>
          </Box>
        </div>
        <div className="col-span-2 p-5">
          <UpcomingTasks idClass={id} isTeacher={isTeacher} />
        </div>
      </div>
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
        id={id}
      />
      <Notification
        open={isNotificationModalOpen}
        handleClose={handleCloseNotificationModal}
        classId={id}
      />
    </>
  );
}

export default ClassDetailPage;
