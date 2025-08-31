import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { MdAdd, MdSearch } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { FolderContext } from "../../contexts/FolderProvider";
import { TasksContext } from "../../contexts/TasksProvider";

function LessonsTab({ classId }) {
  // Trong tương lai, bạn có thể dùng `classId` ở đây để tải danh sách bài học cho lớp này
  const navigate = useNavigate();
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState("");

  const allFolders = useContext(FolderContext) || [];
  const allTasks = useContext(TasksContext) || [];

  // THÊM: Lọc dữ liệu theo classId
  const foldersInClass = allFolders.filter(
    (f) => f.class_id === classId && !f.parentId
  );
  const tasksInClass = allTasks.filter((t) => t.class_id === classId);

  // THÊM: Lọc tiếp dữ liệu theo từ khóa tìm kiếm (không phân biệt hoa thường)
  const filteredFolders = foldersInClass.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredTasks = tasksInClass.filter((task) =>
    task.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* KHỐI HEADER: Chứa tiêu đề và nút tạo mới */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Bài học</Typography>
        <Button variant="contained" startIcon={<MdAdd />}>
          Tạo bài học
        </Button>
      </Box>

      {/* THÊM: Thanh tìm kiếm */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Tìm kiếm theo tên bài học hoặc chủ đề"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdSearch />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box>
        {filteredFolders.map((folder) => (
          <div key={folder.id}>
            <ContentItem
              listFolder={[folder]}
              
            />
            <Box sx={{ pl: 4, borderLeft: "2px solid #e0e0e0", ml: 2 }}>
              {filteredTasks
                .filter((task) => task.folder_id === folder.id)
                .map((task) => (
                  <ContentItem
                    key={task.id}
                    listFolder={[task]}
                    
                  />
                ))}
            </Box>
          </div>
        ))}
        {filteredTasks
          .filter((task) => !task.folder_id)
          .map((task) => (
            <ContentItem
              key={task.id}
              listFolder={[task]}
              
            />
          ))}

        {/* Hiển thị thông báo nếu không có kết quả */}
        {filteredFolders.length === 0 && filteredTasks.length === 0 && (
          <Typography color="text.secondary" textAlign="center" sx={{ p: 3 }}>
            Không tìm thấy bài học hay chủ đề nào.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default LessonsTab;
