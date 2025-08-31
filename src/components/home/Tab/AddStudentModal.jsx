// src/components/class/tabs/AddStudentModal.jsx

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { UserContext } from "../../contexts/userProvider";
import { addDocument } from "../../services/firebaseService";

const AddStudentModal = ({ open, onClose, subjectId, currentStudentIds }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const allUsers = useContext(UserContext) || [];

  const handleAddStudent = async () => {
    setError(""); // Reset lỗi
    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    // 1. Tìm người dùng trong danh sách user theo email
    const studentToAdd = allUsers.find((user) => user.email === email.trim());

    if (!studentToAdd) {
      setError("Không tìm thấy người dùng với email này.");
      return;
    }

    // 2. Kiểm tra xem người dùng này đã có trong lớp chưa
    if (currentStudentIds.includes(studentToAdd.id)) {
      setError("Học sinh này đã có trong lớp.");
      return;
    }

    // 3. Thêm document mới vào collection "enrollments"
    try {
      await addDocument("enrollments", {
        user_id: studentToAdd.id,
        sub_id: subjectId, // Tên trường này phải khớp với DB của bạn
        enrolled_at: new Date(),
      });
      handleClose(); // Đóng modal sau khi thêm thành công
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Lỗi thêm học sinh:", err);
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Thêm học sinh</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Nhập email của học sinh bạn muốn thêm vào lớp học.
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Email học sinh"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleAddStudent} variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentModal;
