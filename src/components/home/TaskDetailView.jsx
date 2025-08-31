import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  IconButton,
  TextField,
} from "@mui/material";
import { MdContentCopy } from "react-icons/md";
import { FaYoutube, FaGoogleDrive, FaLink } from "react-icons/fa";
import { SubmissionsContext } from "../contexts/SubmissionsProvider";
import { EnrollmentsContext } from "../contexts/EnrollmentsProvider";
import { LoginContext } from "../contexts/AuthProvider";
import { uploadFile } from "../services/storageService";
import { addDocument } from "../services/firebaseService";
import { UserContext } from "../contexts/userProvider";

// Contexts and Services

// --- Component con cho giáo viên ---
const TeacherSubmissionSummary = ({ taskInfo }) => {
  const allSubmissions = useContext(SubmissionsContext);
  const allEnrollments = useContext(EnrollmentsContext);

  const studentCount = allEnrollments.filter(
    (e) => e.sub_id === taskInfo.sub_id
  ).length;
  const submissionCount = allSubmissions.filter(
    (s) => s.task_id === taskInfo.id
  ).length;

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 4, alignItems: "center", mb: 3 }}>
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold">
            {studentCount}
          </Typography>
          <Typography color="text.secondary">Được giao</Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box textAlign="center">
          <Typography variant="h3" fontWeight="bold">
            {submissionCount}
          </Typography>
          <Typography color="text.secondary">Đã nộp</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button variant="outlined">Xem bài làm</Button>
        <Button variant="contained">Chấm điểm</Button>
      </Box>
    </Box>
  );
};

// --- Component con cho học sinh ---
const StudentSubmissionForm = ({ taskInfo }) => {
  const { auth } = useContext(LoginContext);
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAttachmentLink = (type) => {
    const url = prompt(`Vui lòng nhập đường dẫn (URL) cho ${type}:`);
    if (url && url.trim() !== "") {
      setAttachments((prev) => [...prev, { type, url: url.trim(), name: url }]);
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setFileToUpload(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && attachments.length === 0 && !fileToUpload) {
      alert("Bạn phải nộp ít nhất một nội dung, tệp hoặc liên kết.");
      return;
    }

    setIsSubmitting(true);
    let finalAttachments = [...attachments];

    if (fileToUpload) {
      try {
        const downloadURL = await uploadFile(
          fileToUpload,
          `submissions/${auth.id}/${taskInfo.id}/`
        );
        finalAttachments.push({
          type: "file",
          url: downloadURL,
          name: fileToUpload.name,
        });
      } catch (error) {
        alert("Tải tệp lên thất bại! Vui lòng thử lại.");
        setIsSubmitting(false);
        console.log(error);

        return;
      }
    }

    try {
      await addDocument("submissions", {
        task_id: taskInfo.id,
        sub_id: taskInfo.sub_id,
        user_id: auth.id,
        content: content,
        attachments: finalAttachments,
        submitted_at: new Date().toISOString(),
        score: null,
      });
      alert("Nộp bài thành công!");
    } catch (error) {
      alert("Đã xảy ra lỗi khi nộp bài.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bài nộp của bạn
      </Typography>
      <TextField
        label="Thêm bình luận riêng tư cho giáo viên"
        multiline
        rows={4}
        fullWidth
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Box mt={1} p={2} border="1px dashed grey" borderRadius={2}>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Thêm hoặc tạo tệp đính kèm:
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
        {fileToUpload && (
          <Typography variant="caption" display="block">
            Sẽ tải lên: {fileToUpload.name}
          </Typography>
        )}
        {attachments.map((att, i) => (
          <Typography key={i} variant="caption" display="block">
            Đã đính kèm link: {att.name}
          </Typography>
        ))}
      </Box>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Đang nộp..." : "Nộp bài"}
      </Button>
    </Box>
  );
};

// --- Component con hiển thị bài đã nộp ---
const StudentSubmittedView = ({ submission }) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Bài đã nộp
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Nộp lúc: {new Date(submission.submitted_at).toLocaleString("vi-VN")}
      </Typography>
      {submission.content && (
        <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
          {submission.content}
        </Paper>
      )}
      {submission.attachments &&
        submission.attachments.map((att, i) => (
          <Button
            key={i}
            sx={{ mt: 1, display: "block" }}
            component="a"
            href={att.url}
            target="_blank"
          >
            {att.name}
          </Button>
        ))}
      <Button variant="outlined" sx={{ mt: 2 }} color="error">
        Hủy nộp bài
      </Button>
    </Box>
  );
};

// --- Component chính ---
function TaskDetailView({ taskInfo, onBack }) {
  const { auth } = useContext(LoginContext);
  const allUsers = useContext(UserContext);
  const allSubmissions = useContext(SubmissionsContext);

  const isTeacher = auth?.id === taskInfo.user_id;
  const author = allUsers.find((u) => u.id === taskInfo.user_id);

  // MỚI: Kiểm tra xem học sinh đã nộp bài chưa
  const existingSubmission = allSubmissions.find(
    (s) => s.task_id === taskInfo.id && s.user_id === auth.id
  );

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => alert(`Đã sao chép mã: ${code}`));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Button onClick={onBack} sx={{ mb: 2 }}>
        &larr; Quay lại Lớp học
      </Button>
      <Box
        sx={{ display: "grid", gridTemplateColumns: { md: "2fr 1fr" }, gap: 4 }}
      >
        {/* Cột chính: Thông tin bài tập */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {taskInfo.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            {author?.username || "Giáo viên"} &bull; Hạn nộp:{" "}
            <strong>
              {new Date(taskInfo.deadline).toLocaleString("vi-VN")}
            </strong>
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {taskInfo.description}
          </Typography>
          {taskInfo.attachments && taskInfo.attachments.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6">Tài liệu đính kèm</Typography>
              {taskInfo.attachments.map((att, i) => (
                <Button
                  key={i}
                  component="a"
                  href={att.url}
                  target="_blank"
                  variant="outlined"
                  sx={{ mt: 1, mr: 1 }}
                >
                  {att.name}
                </Button>
              ))}
            </Box>
          )}
        </Paper>

        {/* Cột phụ: Nộp bài / Xem bài đã nộp */}
        <Paper sx={{ p: 3 }}>
          {isTeacher ? (
            <TeacherSubmissionSummary taskInfo={taskInfo} />
          ) : existingSubmission ? (
            <StudentSubmittedView submission={existingSubmission} />
          ) : (
            <StudentSubmissionForm taskInfo={taskInfo} />
          )}
        </Paper>
      </Box>
    </Box>
  );
}
export default TaskDetailView;
