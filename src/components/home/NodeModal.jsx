import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

function NodeModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      return;
    }
    onSubmit(name.trim());
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Tạo thư mục mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NodeModal;
