import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Button,
} from "@mui/material";
import { MdMoreVert, MdEdit, MdDelete } from "react-icons/md";

function AnnouncementItem({ item, onOpenDialog, onDeleteItem }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Paper sx={{ display: "flex", p: 2, mb: 2, alignItems: "flex-start" }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Thông báo lúc: {new Date(item.createdAt).toLocaleString("vi-VN")}
        </Typography>
        <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
          {item.content}
        </Typography>
        {item.attachments && item.attachments.length > 0 && (
          <Box mt={2}>
            {item.attachments.map((att, index) => (
              <Button
                key={index}
                component="a"
                href={att.url}
                target="_blank"
                variant="outlined"
                size="small"
                sx={{ mr: 1, mt: 1 }}
              >
                {att.name}
              </Button>
            ))}
          </Box>
        )}
      </Box>
      <IconButton size="small" onClick={handleMenuOpen}>
        <MdMoreVert />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={(e) => {
            handleMenuClose(e);
            onOpenDialog("edit", "announcement", item);
          }}
        >
          <MdEdit sx={{ mr: 1 }} /> Sửa
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            handleMenuClose(e);
            onDeleteItem(item);
          }}
        >
          <MdDelete sx={{ mr: 1 }} /> Xóa
        </MenuItem>
      </Menu>
    </Paper>
  );
}

export default AnnouncementItem;
