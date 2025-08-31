import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { MdDelete, MdEdit, MdLink, MdMoreVert } from "react-icons/md";

function NotificationItem({ notification }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Paper sx={{ display: "flex", p: 2, mb: 2, alignItems: "flex-start" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {/* THÊM: Hiển thị thời gian tạo thông báo */}
          Thông báo lúc:{" "}
          {notification.createdAt
            ? new Date(notification.createdAt.toDate()).toLocaleString("vi-VN")
            : "..."}
        </Typography>
        <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
          {notification.content}
        </Typography>

        {notification.attachmentUrl && (
          <Box sx={{ mt: 2 }}>
            <Button
              component="a"
              href={notification.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<MdLink />}
            >
              {notification.attachmentName || "Xem tệp đính kèm"}
            </Button>
          </Box>
        )}
      </Box>
      <IconButton size="small">
        <MdMoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem>
          <MdEdit sx={{ mr: 1 }} /> Sửa
        </MenuItem>
        <MenuItem>
          <MdDelete sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>
    </Paper>
  );
}

export default NotificationItem;
