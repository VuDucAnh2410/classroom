import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { FaGoogleDrive, FaLink, FaYoutube } from "react-icons/fa";
import { addDocument } from "../../services/firebaseService";
import { serverTimestamp } from "firebase/firestore";
import { EnrollmentsContext } from "../../contexts/EnrollmentsProvider";
import { UserContext } from "../../contexts/userProvider";
import { uploadFileToCloudinary } from "../../../config/CloudinaryConfig";

function AddTaskModal({ open, handleClose, classId, folders = [] }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [listUser, setListUser] = useState([]);
  const enrollments = useContext(EnrollmentsContext);
  const users = useContext(UserContext);

  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  console.log(users);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddTask = async () => {
    // SỬA: Sửa biến trong validation cho đúng
    if (!title.trim() || !deadline.trim()) {
      alert("Vui lòng nhập tiêu đề và hạn nộp.");
      return;
    }

    setIsUploading(true);
    let attachmentUrl = null;
    let attachmentName = null;

    try {
      // 1. Nếu có file, tải lên Cloudinary
      if (file) {
        attachmentUrl = await uploadFileToCloudinary(file, "tasks");
        attachmentName = file.name;
      }

      // 2. Tạo đối tượng task mới
      const newTask = {
        name: title.trim(),
        description: content.trim(), // Dùng state `content`
        deadline: new Date(deadline),
        folder_id: selectedTopic, // Dùng state `selectedTopic`
        assigned_users: listUser, // THÊM: Lưu danh sách học sinh được giao
        class_id: classId,
        createdAt: serverTimestamp(),
        attachmentUrl: attachmentUrl,
        attachmentName: attachmentName,
      };

      // 3. Thêm task vào Firestore
      await addDocument("tasks", newTask);

      // 4. Reset state và đóng modal (SỬA: Dùng đúng tên hàm setState)
      setTitle("");
      setContent("");
      setDeadline("");
      setSelectedTopic("");
      setListUser([]);
      setFile(null);
      handleClose();
    } catch (error) {
      console.error("Lỗi khi tạo bài tập hoặc tải tệp lên:", error);
      alert("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Tạo bài tập</DialogTitle>
      <DialogContent>
        <TextField
          label="Tiêu đề *"
          fullWidth
          margin="normal"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: 2, my: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Chủ đề</InputLabel>
            <Select
              label="Chủ đề"
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <MenuItem value="">
                <em>Không chủ đề</em>
              </MenuItem>
              {/* SỬA: Dùng prop `folders` đã được lọc sẵn */}
              {folders.map((folder) => (
                <MenuItem key={folder.id} value={folder.id}>
                  {folder.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Hạn nộp *"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="none"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </Box>

        <FormControl fullWidth margin="normal">
          <Autocomplete
            multiple
            options={enrollments.filter((e) => e.class_id == classId)}
            getOptionLabel={(option) =>
              users.find((e) => e.id == option.user_id)?.username
            } // user_id có thể là số, nên convert sang chuỗi
            disableCloseOnSelect
            onChange={(event, newValue) => {
              // Lấy danh sách user_id từ newValue
              const selectedUserIds = newValue.map((item) => item.user_id);
              setListUser(selectedUserIds);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Đến" placeholder="Chọn học sinh" />
            )}
          />
        </FormControl>

        <TextField
          label="Nội dung"
          multiline
          rows={5}
          fullWidth
          margin="normal"
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
        <Button onClick={handleClose} disabled={isUploading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={handleAddTask}
          disabled={!title.trim() || !deadline.trim() || isUploading}
          startIcon={
            isUploading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isUploading ? "Đang giao..." : "Giao bài"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTaskModal;
