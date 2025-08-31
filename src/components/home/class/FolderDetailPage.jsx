import { useContext, useState } from "react";
import { Box, Typography, Button, Paper, IconButton } from "@mui/material";
import { MdAdd } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import BreadcrumbNavigation from "../BreadcrumbNavigation";
import TaskDetailView from "../TaskDetailView";
import { FolderContext } from "../../contexts/FolderProvider";
import { TasksContext } from "../../contexts/TasksProvider"; // THÊM
import { ContentItem } from "./ContentItem";
import TaskDetailPage from "../task/TaskDetailPage";

function FolderDetailPage() {
  const [selectedTask, setSelectedTask] = useState(null);
  const { id, folderId } = useParams();
  const navigate = useNavigate();

  // Lấy toàn bộ dữ liệu từ các context
  const allFolders = useContext(FolderContext) || [];
  const allTasks = useContext(TasksContext) || []; // THÊM

  // Tìm thông tin của thư mục hiện tại
  const currentFolder = allFolders.find((f) => f.id === folderId);

  // Lọc để lấy các thư mục con và bài tập con của thư mục hiện tại
  const subFolders = allFolders.filter((f) => f.parentId === folderId);
  const tasksInFolder = allTasks.filter((t) => t.folder_id === folderId); // THÊM

  // Gộp lại để hiển thị
  const folderContent = [...subFolders, ...tasksInFolder];

  const handleNestedFolderClick = (subFolderId) => {
    navigate(`/class/${id}/folder/${subFolderId}`);
  };
  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  if (selectedTask) {
    return (
      <TaskDetailPage
        taskInfo={selectedTask}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  const breadcrumbItems = [
    { label: "Trang chủ", onClick: () => navigate("/") },
    { label: "Lớp học", onClick: () => navigate(`/class/${id}`) },
    { label: currentFolder?.name || "Thư mục", onClick: null },
  ];

  return (
    <>
      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <Box>
            <BreadcrumbNavigation items={breadcrumbItems} />
            <Box sx={{ display: "flex", mt: 2 }}>
              <Box sx={{ flex: 3 }}>
                <Paper /* Banner */>
                  <Typography
                    variant="h4"
                    sx={{ position: "absolute", bottom: 16, left: 16 }}
                  >
                    {currentFolder?.name || "Thư mục"}
                  </Typography>
                </Paper>
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
                  >
                    Thông báo trong thư mục...
                  </Button>
                  <IconButton title="Tạo Bài tập">
                    <MdAdd />
                  </IconButton>
                </Paper>
                {/* Hiển thị nội dung của thư mục */}
                <ContentItem
                  listFolder={folderContent}
                  handleFolderClick={handleNestedFolderClick}
                  handleTaskClick={handleTaskClick}
                />
              </Box>
            </Box>
          </Box>
        </div>
        <div className="col-span-2">thong bao</div>
      </div>
    </>
  );
}

export default FolderDetailPage;
