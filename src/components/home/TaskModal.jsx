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


function TaskModal({
  open,
  onClose,
  onSubmit,
  recipients,
  topics,
  initialData = null,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [recipient, setRecipient] = useState("all");
  const [topicId, setTopicId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = !!initialData;

  useEffect(() => {
    if (open) {
      setTitle(isEditing ? initialData.name : "");
      setContent(isEditing ? initialData.description || "" : "");
      setRecipient(isEditing ? initialData.recipient || "all" : "all");
      setTopicId(isEditing ? initialData.parent_id || "" : "");
      setDeadline(
        isEditing
          ? new Date(initialData.deadline).toISOString().slice(0, 16)
          : ""
      );
      setAttachments(isEditing ? initialData.attachments || [] : []);
    } else {
      // Reset form khi đóng
      setTitle("");
      setContent("");
      setRecipient("all");
      setTopicId("");
      setDeadline("");
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
    if (!title.trim() || !deadline) {
      alert("Vui lòng nhập Tiêu đề và Hạn nộp.");
      return;
    }

    setIsUploading(true);
    let finalAttachments = [...attachments];

    if (fileToUpload) {
      try {
        const downloadURL = await uploadFile(
          fileToUpload,
          `tasks/${Date.now()}/`
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

    onSubmit({
      name: title,
      description: content,
      parent_id: topicId || null,
      deadline,
      attachments: finalAttachments,
      recipient,
    });

    setIsUploading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{isEditing ? "Sửa bài tập" : "Tạo bài tập"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Tiêu đề *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
          autoFocus
        />
        <Box sx={{ display: "flex", gap: 2, my: 1 }}>
          <FormControl fullWidth>
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
          <FormControl fullWidth>
            <InputLabel>Chủ đề</InputLabel>
            <Select
              value={topicId}
              label="Chủ đề"
              onChange={(e) => setTopicId(e.target.value)}
            >
              <MenuItem value="">
                <em>Không chủ đề</em>
              </MenuItem>
              {topics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField
          label="Nội dung"
          multiline
          rows={5}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Hạn nộp *"
          type="datetime-local"
          fullWidth
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
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
        {attachments.map((att, index) => (
          <Typography key={index} variant="caption" sx={{ display: "block" }}>
            Đã đính kèm link: {att.name}
          </Typography>
        ))}
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
          {isUploading ? "Đang xử lý..." : isEditing ? "Lưu" : "Giao bài"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default TaskModal;
