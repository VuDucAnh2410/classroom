import { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { LoginContext } from "../../contexts/AuthProvider";
import { addDocument } from "../../services/firebaseService";

const ModalAddClass = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { auth } = useContext(LoginContext);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên lớp!");
      return;
    }

    try {
      await addDocument("class", {
        name: name.trim(),
        description: description.trim(),
        user_id: auth.id,
        createdAt: new Date().toISOString(),
      });

      // Reset state and close modal
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo lớp học:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Tạo lớp học mới</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Tên lớp học (bắt buộc)"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Mô tả (tùy chọn)"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ModalAddClass;
