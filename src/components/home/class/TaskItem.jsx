import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import {
  MdDelete,
  MdEdit,
  MdFolder,
  MdInsertDriveFile,
  MdMoreVert,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

// Component ContentItem nhận props listFolder.
export const TaskItem = ({ task }) => {
  const [anchorElMap, setAnchorElMap] = useState({});
  const navigation = useNavigate();

  const handleTask = (id) => {
    navigation(`/taskdetail/${id}`);
  };

  // Xử lý đóng menu
  const handleMenuClose = (event, itemId) => {
    event.stopPropagation();
    setAnchorElMap((prev) => ({ ...prev, [itemId]: null }));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          mb: 1,
          backgroundColor: "white",
          borderRadius: 2,
          border: "1px solid #e0e0e0",
          cursor: "pointer",
          "&:hover": { boxShadow: 1, borderColor: "primary.main" },
        }}
        onClick={() => handleTask(task.id)}
      >
        <MdInsertDriveFile size={28} className="text-green-600" />
        <Typography sx={{ ml: 2, flexGrow: 1, fontWeight: 500 }}>
          {task?.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "error.main", mr: 2 }}>
          Hạn:{" "}
          {/* Thêm item.deadline && để kiểm tra và .toDate() để chuyển đổi */}
          {task?.deadline &&
            new Date(task?.deadline.toDate()).toLocaleString("vi-VN")}
        </Typography>
        <IconButton size="small">
          <MdMoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorElMap[task?.id]}
          open={Boolean(anchorElMap[task?.id])}
          onClose={(e) => handleMenuClose(e, task?.id)}
          onClick={(e) => e.stopPropagation()}
        >
          <MenuItem>
            {/* Để icon và text cùng nằm trên một hàng, bạn có thể
                  sử dụng Box với display flex hoặc thêm sx vào MenuItem
                */}
            <MdEdit style={{ marginRight: 8 }} />
            Sửa
          </MenuItem>
          <MenuItem>
            <MdDelete style={{ marginRight: 8 }} />
            Xóa
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};
