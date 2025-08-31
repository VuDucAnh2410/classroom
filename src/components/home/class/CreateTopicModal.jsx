// src/components/home/CreateTopicModal.jsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { addDocument } from "../../services/firebaseService";
import { MdClose } from "react-icons/md";

const CreateTopicModal = ({ open, handleClose, id, parentId = null }) => {
  const [topicName, setTopicName] = useState("");

  const onSubmit = async () => {
    if (!topicName.trim()) return; // Không cho tạo nếu tên rỗng

    //Xây dựng đối tượng dữ liệu hoàn chỉnh
    const newFolderData = {
      name: topicName.trim(), // Cắt bỏ khoảng trắng thừa
      type: "folder", // **QUAN TRỌNG: Thêm 'type' ngay khi tạo**
    };

    if (parentId) {
      newFolderData.parentId = parentId; // Nếu là thư mục con
    } else {
      newFolderData.class_id = id; // Nếu là thư mục gốc trong lớp
    }
    await addDocument("folder", newFolderData);

    setTopicName("");
    handleClose();
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter" && topicName.trim()) {
      onSubmit();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Tạo thư mục
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <MdClose />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ mb: 2, color: "primary.main" }}>
          Tên thư mục
        </Typography>
        <TextField
          autoFocus
          placeholder="Nhập tên chủ đề"
          fullWidth
          variant="outlined"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          onKeyDown={handleEnterPress}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Hủy
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={!topicName.trim()}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTopicModal;
