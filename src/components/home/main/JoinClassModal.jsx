"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { SubjectContext } from "../../contexts/SubjectProvider";
import { addDocument } from "../../services/firebaseService";
import { LoginContext } from "../../contexts/AuthProvider";

const JoinClassModal = ({ isOpen, onClose }) => {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const subjects = useContext(SubjectContext);
  const { auth } = useContext(LoginContext);

  useEffect(() => {
    if (isOpen) setClassCode("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!classCode.trim()) {
      setError("Vui lòng nhập mã lớp học");
      return;
    }
    const a = subjects.find((e) => e.id === classCode);
    await addDocument("enrollments", { user_id: auth.id, class_id: a.id });
    onClose();
  };
  const handleClose = () => {
    setClassCode("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Tham gia lớp học
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoIosClose size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Nhập mã lớp học mà giáo viên đã cung cấp
        </Typography>

        <TextField
          autoFocus
          required
          margin="dense"
          label="Mã lớp học"
          placeholder="Ví dụ: ABC123"
          fullWidth
          variant="outlined"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          error={!!error}
          helperText={error}
        />
      </DialogContent>

      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={handleClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Tham gia
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinClassModal;
