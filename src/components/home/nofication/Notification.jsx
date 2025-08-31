import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FaGoogleDrive, FaLink, FaYoutube } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { addDocument } from "../../services/firebaseService";
import { serverTimestamp } from "firebase/firestore";

function Notification({ open, handleClose, classId }) {
  const [content, setContent] = useState(""); // State để lưu nội dung thông báo

  const handlePost = async () => {
    if (!content.trim()) return;

    const newNotification = {
      content: content.trim(),
      class_id: classId,
      createdAt: serverTimestamp(),
    };

    await addDocument("notifications", newNotification);
    setContent("");
    handleClose();
  };
  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          Thêm thông báo
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <MdClose />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal"></FormControl>
        <TextField
          label="Nội dung"
          multiline
          rows={5}
          fullWidth
          placeholder="Thông báo..."
          margin="normal"
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Box mt={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tệp đính kèm:
          </Typography>
          <Button component="label" sx={{ mr: 1 }}>
            Tải tệp <input type="file" hidden />
          </Button>
          <IconButton title="Đính kèm YouTube">
            <FaYoutube color="red" />
          </IconButton>
          <IconButton title="Đính kèm Google Drive">
            <FaGoogleDrive color="blue" />
          </IconButton>
          <IconButton title="Đính kèm liên kết">
            <FaLink />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handlePost}
          disabled={!content.trim()}
        >
          Đăng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Notification;
