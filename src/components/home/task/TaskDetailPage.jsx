import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import {
  FaLink,
  FaFileWord,
  FaFileExcel,
  FaGoogleDrive,
  FaYoutube,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../contexts/AuthProvider";
import { TasksContext } from "../../contexts/TasksProvider";
import { SubjectContext } from "../../contexts/SubjectProvider";
import { SubmissionsContext } from "../../contexts/SubmissionsProvider";
import {
  addDocument,
  deleteDocument,
  updateDocument,
} from "../../services/firebaseService";
import { uploadFileToCloudinary } from "../../../config/CloudinaryConfig";

function TaskDetailPage() {
  const { id: taskId } = useParams();
  const { auth } = useContext(LoginContext);
  const allTasks = useContext(TasksContext);
  const allSubjects = useContext(SubjectContext);
  const allSubmissions = useContext(SubmissionsContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userSubmission, setUserSubmission] = useState(null); // Lưu bài nộp của HS
  const [isLoading, setIsLoading] = useState(true); // State để xử lý tải dữ liệu

  const [task, setTask] = useState(null);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const [isTeacher, setIsTeacher] = useState(false);
  const [submissionCount, setSubmissionCount] = useState(0);
  const [assignedCount, setAssignedCount] = useState(0);

  const [taskDescription, setTaskDescription] = useState(""); // Dành cho GV sửa mô tả
  const [submissionComment, setSubmissionComment] = useState("");

  const handleGradeTask = () => {
    if (task) {
      // Điều hướng đến trang sổ điểm và truyền ID của task hiện tại qua state
      navigate(`/grades/student`, {
        state: { defaultTaskId: taskId },
      });
    }
  };

  useEffect(() => {
    setIsLoading(true); // Bắt đầu tải dữ liệu
    const currentTask = allTasks.find((e) => e.id === taskId);
    if (currentTask) {
      setTask(currentTask);
      setTaskDescription(currentTask.description || "");
      const currentSubject = allSubjects.find(
        (s) => s.id === currentTask.class_id
      );
      if (currentSubject && auth?.id) {
        const teacher = currentSubject.user_id === auth.id;
        setIsTeacher(teacher);

        if (teacher) {
          // Logic cho giáo viên
          const submissionsForTask = allSubmissions.filter(
            (sub) => sub.task_id === taskId
          );
          setSubmissionCount(submissionsForTask.length);
          setAssignedCount(currentTask.assigned_users?.length || 0);
        } else {
          // TÌM BÀI NỘP CỦA HỌC SINH
          const submission = allSubmissions.find(
            (s) => s.task_id === taskId && s.user_id === auth.id
          );
          setUserSubmission(submission || null);
          console.log("Loaded userSubmission from allSubmissions:", submission);
          console.log("All submissions:", allSubmissions); // Debug toàn bộ allSubmissions
        }
      }
    }
    setIsLoading(false); // Hoàn tất tải dữ liệu
  }, [taskId, allTasks, allSubjects, allSubmissions, auth]);

  const handleBack = () => {
    if (task) navigate(`/class/${task.class_id}`);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (isTeacher) {
        let updatedData = { description: taskDescription };
        if (file) {
          const uploadResult = await uploadFileToCloudinary(
            file,
            "task_attachments"
          );
          updatedData.filePath = uploadResult;
          updatedData.originalFileName = file.name;
        }
        await updateDocument("tasks", task.id, updatedData);
        setTask((prevTask) => ({ ...prevTask, ...updatedData }));
        setFile(null);
        alert("Cập nhật thành công!");
      } else {
        // ---- LOGIC CỦA HỌC SINH ----
        if (!file && !submissionComment.trim()) {
          alert("Bạn phải đính kèm một tệp hoặc viết bình luận để nộp bài.");
          return;
        }

        const newSubmissionData = {
          description: submissionComment.trim(),
          task_id: taskId,
          user_id: auth.id,
          score: null,
          submitted_at: new Date(),
          file_path: null,
          originalFileName: null,
        };

        if (file) {
          const uploadResult = await uploadFileToCloudinary(file, "baitap");
          newSubmissionData.file_path = uploadResult;
          newSubmissionData.originalFileName = file.name;
        }

        // Thêm document và lấy ID
        const newId = await addDocument("submission", newSubmissionData);
        console.log("addDocument returned ID:", newId); // Debug ID

        // Optimistic update với ID tạm nếu không có ID từ addDocument
        if (newId) {
          setUserSubmission({ ...newSubmissionData, id: newId });
        } else {
          const tempId =
            "temp_" +
            Date.now() +
            "_" +
            Math.random().toString(36).substr(2, 9);
          setUserSubmission({ ...newSubmissionData, id: tempId });
          console.warn(
            "Warning: addDocument did not return an ID. Using temporary ID:",
            tempId
          );
          console.log(
            "Please check Firebase 'submissions' collection for a document with task_id:",
            taskId,
            "and user_id:",
            auth.id,
            "and compare the ID."
          );
        }

        alert(
          "Nộp bài thành công! (Vui lòng kiểm tra ID trong Firebase nếu cần.)"
        );
        setFile(null);
        setSubmissionComment("");
      }
    } catch (error) {
      console.error("Lỗi khi nộp bài:", error);
      alert(
        "Thao tác thất bại, vui lòng thử lại. Kiểm tra console để biết chi tiết."
      );
      if (!isTeacher) {
        setUserSubmission(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUnsubmit = async () => {
    if (
      !userSubmission ||
      !userSubmission.id ||
      userSubmission.id.startsWith("temp_")
    ) {
      alert(
        "Không tìm thấy bài nộp hợp lệ để hủy. Vui lòng kiểm tra với quản trị viên."
      );
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn hủy nộp bài không?")) {
      setIsSubmitting(true);
      try {
        console.log(
          "Attempting to delete submission with ID:",
          userSubmission.id
        );
        await deleteDocument("submission", userSubmission.id);
        setUserSubmission(null);
        setFile(null);
        setSubmissionComment("");
        alert("Hủy nộp bài thành công!");
      } catch (error) {
        console.error("Lỗi khi hủy nộp bài:", error);
        alert("Hủy nộp bài thất bại. Kiểm tra console để biết chi tiết.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split(".").pop().toLowerCase();
    if (extension === "docx" || extension === "doc") {
      return <FaFileWord color="#2B579A" />;
    }
    if (extension === "xlsx" || extension === "xls") {
      return <FaFileExcel color="#217346" />;
    }
    return <FaLink />; // Default icon
  };

  if (!task) {
    return (
      <Typography sx={{ p: 3 }}>
        Đang tải hoặc không tìm thấy bài tập...
      </Typography>
    );
  }

  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    try {
      return url.split("/").pop().split("?")[0];
    } catch {
      return "Tệp đính kèm";
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Button onClick={handleBack} sx={{ mb: 2 }}>
        &larr; Quay lại Lớp học
      </Button>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "2fr 1fr" },
          gap: 4,
        }}
      >
        {/* Cột chính: Thông tin bài tập */}
        <Paper sx={{ p: 3, position: "relative" }}>
          {isTeacher && (
            <Box
              sx={{
                position: "absolute",
                top: 24,
                right: 24,
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" component="p" fontWeight="500">
                  {submissionCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đã nộp
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem />
              <Box sx={{ textAlign: "center", p: 1 }}>
                <Typography variant="h4" component="p" fontWeight="500">
                  {assignedCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Đã giao
                </Typography>
              </Box>
            </Box>
          )}
          <Typography variant="h4" component="h1" fontWeight="bold">
            {task.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            <strong>Hạn nộp:</strong>{" "}
            {task.deadline
              ? new Date(task.deadline.toDate()).toLocaleString("vi-VN")
              : "Không có"}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography sx={{ whiteSpace: "pre-wrap" }}>
            {task.description}
          </Typography>
          {task.attachmentUrl && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Tệp đính kèm:
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FaLink />}
                href={task.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 1 }}
              >
                {task.attachmentName || getFileNameFromUrl(task.attachmentUrl)}
              </Button>
            </Box>
          )}
          {isTeacher && (
            <Box sx={{ mt: 3, borderTop: 1, borderColor: "divider", pt: 2 }}>
              <Button variant="contained" onClick={handleGradeTask}>
                Chấm điểm
              </Button>
            </Box>
          )}
        </Paper>

        {/* Cột phụ: Nộp bài / Quản lý */}
        <Paper sx={{ p: 3 }}>
          {isTeacher ? (
            // GIAO DIỆN CỦA GIÁO VIÊN
            <>
              <Typography variant="h6" gutterBottom>
                Chỉnh sửa bài tập
              </Typography>
              <TextField
                label="Chỉnh sửa nội dung"
                multiline
                rows={4}
                fullWidth
                variant="filled"
                defaultValue={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
              <Box
                sx={{
                  border: "1px dashed grey",
                  borderRadius: 1,
                  p: 2,
                  mt: 2,
                }}
              >
                {task.filePath && (
                  <Box
                    sx={{ mb: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Tệp hiện tại:
                    </Typography>
                    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                      {task.attachmentName ||
                        getFileNameFromUrl(task.attachmentUrl)}
                    </Typography>
                  </Box>
                )}
                <Typography variant="body2" sx={{ mb: 1, textAlign: "center" }}>
                  Cập nhật hoặc thêm tệp đính kèm mới:
                </Typography>
                <Box sx={{ textAlign: "center" }}>
                  <Button component="label" variant="outlined" sx={{ mr: 1 }}>
                    Tải tệp
                    <input type="file" hidden onChange={handleFileChange} />
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
                {file && (
                  <Box sx={{ mt: 2, textAlign: "left" }}>
                    <Typography variant="body1">
                      <Box
                        component="span"
                        sx={{ verticalAlign: "middle", mr: 1 }}
                      >
                        {getFileIcon(file.name)}
                      </Box>
                      {file.name}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Button
                onClick={handleSubmit}
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
                disabled={isSubmitting}
              >
                Lưu thay đổi
              </Button>
            </>
          ) : (
            // GIAO DIỆN CỦA HỌC SINH
            <>
              {userSubmission ? (
                // GIAO DIỆN KHI ĐÃ NỘP BÀI
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Bài đã nộp
                  </Typography>
                  {userSubmission.file_path && (
                    <Box
                      sx={{ mb: 2, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        Tệp của bạn:
                      </Typography>
                      <Button
                        variant="text"
                        startIcon={<FaLink />}
                        href={userSubmission.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {userSubmission.originalFileName || "Tệp đính kèm"}
                      </Button>
                    </Box>
                  )}
                  {userSubmission.description && (
                    <Box sx={{ mb: 2, p: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Bình luận riêng tư:
                      </Typography>
                      <Typography variant="body2">
                        {userSubmission.description}
                      </Typography>
                    </Box>
                  )}
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={handleUnsubmit}
                    disabled={isSubmitting}
                  >
                    Hủy nộp bài
                  </Button>
                </Box>
              ) : (
                // GIAO DIỆN KHI CHƯA NỘP BÀI
                <>
                  <Typography variant="h6" gutterBottom>
                    Bài nộp của bạn
                  </Typography>
                  <TextField
                    label="Thêm bình luận riêng tư"
                    multiline
                    rows={4}
                    fullWidth
                    variant="filled"
                    value={submissionComment}
                    onChange={(e) => setSubmissionComment(e.target.value)}
                  />
                  <Box
                    sx={{
                      border: "1px dashed grey",
                      borderRadius: 1,
                      p: 2,
                      mt: 2,
                    }}
                  >
                    {task.attachmentUrl && (
                      <Box
                        sx={{
                          mb: 2,
                          p: 1,
                          bgcolor: "#f5f5f5",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Tệp đính kèm từ giáo viên:
                        </Typography>
                        <Button
                          component="a"
                          href={task.attachmentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="small"
                          startIcon={getFileIcon(
                            task.originalFileName || task.filePath
                          )}
                          sx={{
                            textTransform: "none",
                            p: 0,
                            justifyContent: "flex-start",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ wordBreak: "break-all" }}
                          >
                            {task.attachmentName ||
                              getFileNameFromUrl(task.attachmentUrl)}
                          </Typography>
                        </Button>
                      </Box>
                    )}
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, textAlign: "center" }}
                    >
                      Thêm hoặc tạo tệp đính kèm:
                    </Typography>
                    <Box sx={{ textAlign: "center" }}>
                      <Button
                        component="label"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      >
                        Tải tệp
                        <input type="file" hidden onChange={handleFileChange} />
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
                    {file && (
                      <Box sx={{ mt: 2, textAlign: "left" }}>
                        <Typography variant="body1">
                          <Box
                            component="span"
                            sx={{ verticalAlign: "middle", mr: 1 }}
                          >
                            {getFileIcon(file.name)}
                          </Box>
                          {file.name}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Button
                    onClick={handleSubmit}
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={isSubmitting}
                  >
                    Nộp bài
                  </Button>
                </>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

export default TaskDetailPage;
