import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { FaYoutube, FaGoogleDrive, FaLink } from "react-icons/fa";
import { uploadFile } from "../services/storageService";


function AnnouncementModal({
  open,
  onClose,
  onSubmit,
  recipients,
  initialData = null,
}) {
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [attachments, setAttachments] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (open) {
      setContent(isEditing ? initialData.content || "" : "");
      setRecipient(isEditing ? initialData.recipient || "all" : "all");
      setAttachments(isEditing ? initialData.attachments || [] : []);
    } else {
      setContent("");
      setRecipient("all");
      setAttachments([]);
      setFileToUpload(null);
      setIsUploading(false);
    }
  }, [open, initialData, isEditing]);

  const handleAddAttachmentLink = (type) => {
    const url = prompt(`Vui lòng nhập đường dẫn (URL) cho ${type}:`);
    if (url && url.trim() !== "") {
      let name = url;
      try {
        const urlObject = new URL(url);
        name =
          urlObject.hostname + (urlObject.pathname.length > 1 ? "/..." : "");
      } catch (e) {
        name = url.substring(0, 30) + "...";
        console.log(e);
        
      }
      setAttachments((prev) => [...prev, { type, url: url.trim(), name }]);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Vui lòng nhập nội dung thông báo.");
      return;
    }

    setIsUploading(true);
    let finalAttachments = [...attachments];

    if (fileToUpload) {
      try {
        const downloadURL = await uploadFile(
          fileToUpload,
          `announcements/${Date.now()}/`
        );
        finalAttachments.push({
          type: "file",
          url: downloadURL,
          name: fileToUpload.name,
        });
      } catch (error) {
        alert("Tải tệp lên thất bại! Vui lòng kiểm tra lại Rules của Storage.");
        setIsUploading(false);
        console.log(error);

        return;
      }
    }

    onSubmit({ content, recipient, attachments: finalAttachments });
    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? "Sửa thông báo" : "Tạo thông báo mới"}
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Đến</InputLabel>
          <Select
            value={recipient}
            label="Đến"
            onChange={(e) => setRecipient(e.target.value)}
          >
            <MenuItem value="all">Tất cả học sinh</MenuItem>
            {recipients.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Nội dung"
          multiline
          rows={5}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Thông báo..."
          margin="normal"
          autoFocus
        />

        <Box mt={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Tệp đính kèm:
          </Typography>
          <Button component="label" sx={{ mr: 1 }}>
            Tải tệp <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <IconButton
            title="Đính kèm YouTube"
            onClick={() => handleAddAttachmentLink("youtube")}
          >
            <FaYoutube color="red" />
          </IconButton>
          <IconButton
            title="Đính kèm Google Drive"
            onClick={() => handleAddAttachmentLink("drive")}
          >
            <FaGoogleDrive color="blue" />
          </IconButton>
          <IconButton
            title="Đính kèm liên kết"
            onClick={() => handleAddAttachmentLink("link")}
          >
            <FaLink />
          </IconButton>
        </Box>
        {fileToUpload && (
          <Typography variant="caption">
            Sẽ tải lên: {fileToUpload.name}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isUploading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isUploading}
        >
          {isUploading ? "Đang xử lý..." : isEditing ? "Lưu" : "Đăng"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default AnnouncementModal;
