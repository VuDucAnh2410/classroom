import {
  Box,
  Button,
  CircularProgress,
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
import { uploadFileToCloudinary } from "../../../config/CloudinaryConfig";

function NotificationModal({ open, handleClose, classId }) {
  const [content, setContent] = useState(""); // State để lưu nội dung thông báo
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) return;

    setIsUploading(true);
    let attachmentUrl = null;
    let attachmentName = null;

    try {
      // 1. Nếu có file, tải lên Cloudinary
      if (file) {
        attachmentUrl = await uploadFileToCloudinary(file, "notifications"); // Lưu vào thư mục 'notifications' trên Cloudinary
        attachmentName = file.name;
      }

      // 2. Tạo đối tượng thông báo mới với URL của file (nếu có)
      const newNotification = {
        content: content.trim(),
        class_id: classId,
        createdAt: serverTimestamp(),
        attachmentUrl: attachmentUrl, // có thể là null
        attachmentName: attachmentName, // có thể là null
      };

      // 3. Thêm thông báo vào Firestore
      await addDocument("notifications", newNotification);

      // 4. Reset state và đóng modal
      setContent("");
      setFile(null);
      handleClose();
    } catch (error) {
      console.error("Lỗi khi đăng thông báo hoặc tải tệp lên:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsUploading(false); // Dừng trạng thái loading dù thành công hay thất bại
    }
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
          <Button component="label" variant="outlined" sx={{ mr: 1 }}>
            Tải tệp <input type="file" hidden onChange={handleFileChange} />
          </Button>
          {file && <Typography variant="caption">{file.name}</Typography>}
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
          startIcon={
            isUploading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isUploading ? "Đang đăng..." : "Đăng"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NotificationModal;
