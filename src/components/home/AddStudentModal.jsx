import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

function AddStudentModal({ open, onClose, onSubmit }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim() || !email.includes("@")) {
      alert("Vui lòng nhập một địa chỉ email hợp lệ.");
      return;
    }
    onSubmit(email.trim().toLowerCase());
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Mời học sinh</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Nhập email của học sinh bạn muốn mời vào lớp học.
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
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Mời
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddStudentModal;
