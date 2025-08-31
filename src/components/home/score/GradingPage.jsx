// src/components/grading/GradingPage.js

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import { useContext, useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TasksContext } from "../../contexts/TasksProvider";
import { SubmissionsContext } from "../../contexts/SubmissionsProvider";

import { EnrollmentsContext } from "../../contexts/EnrollmentsProvider";
import { updateDocument } from "../../services/firebaseService";
import { UserContext } from "../../contexts/userProvider";

const GradingPage = () => {
  const { classId, taskId, studentId } = useParams();
  const navigate = useNavigate();

  // Lấy dữ liệu từ Contexts
  const allTasks = useContext(TasksContext);
  const allSubmissions = useContext(SubmissionsContext);
  const allUsers = useContext(UserContext);
  const allEnrollments = useContext(EnrollmentsContext);

  // State
  const [task, setTask] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [student, setStudent] = useState(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(studentId);

  // Lấy danh sách sinh viên trong lớp
  const studentsInClass = useMemo(() => {
    // Quan trọng: Đảm bảo bạn có đoạn kiểm tra này
    if (!allEnrollments || !allUsers || allUsers.length === 0) {
      return [];
    }

    return allEnrollments
      .filter((en) => en.class_id === classId)
      .map((en) => allUsers.find((u) => u.id === en.user_id))
      .filter(Boolean);
  }, [allEnrollments, allUsers, classId]);

  useEffect(() => {
    const currentTask = allTasks.find((t) => t.id === taskId);
    const currentStudent = allUsers.find((u) => u.id === selectedStudentId);
    const studentSubmission = allSubmissions.find(
      (s) => s.task_id === taskId && s.user_id === selectedStudentId
    );

    setTask(currentTask);
    setStudent(currentStudent);
    setSubmission(studentSubmission);

    if (studentSubmission) {
      setScore(studentSubmission.score || "");
      setFeedback(studentSubmission.teacher_feedback || "");
    } else {
      setScore("");
      setFeedback("");
    }
  }, [taskId, selectedStudentId, allTasks, allUsers, allSubmissions]);

  const handleReturnGrade = async () => {
    if (!submission) {
      alert("Sinh viên này chưa nộp bài!");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateDocument("submissions", submission.id, {
        score: Number(score),
        teacher_feedback: feedback,
        graded_at: new Date(),
      });
      alert("Đã trả điểm thành công!");
      navigate(`/class/${classId}/grades`);
    } catch (error) {
      console.error("Lỗi khi trả điểm:", error);
      alert("Đã xảy ra lỗi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentSelect = (newStudentId) => {
    setSelectedStudentId(newStudentId);
    // Cập nhật URL để đồng bộ
    navigate(`/class/${classId}/grades/${taskId}/student/${newStudentId}`, {
      replace: true,
    });
  };

  if (!task || !student) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { md: "300px 1fr" },
        gap: 2,
        p: 2,
        height: "calc(100vh - 64px)",
      }}
    >
      {/* Cột danh sách sinh viên */}
      <Paper sx={{ overflowY: "auto" }}>
        <Typography variant="h6" sx={{ p: 2 }}>
          Danh sách sinh viên
        </Typography>
        <List>
          {studentsInClass.map((s, index) => (
            <ListItem
              button
              key={s?.id || index}
              selected={s?.id === selectedStudentId}
              onClick={() => handleStudentSelect(s?.id)}
            >
              <Avatar sx={{ mr: 2 }}>{s?.username?.[0]}</Avatar>
              <ListItemText primary={s?.username} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Cột chấm bài */}
      <Paper sx={{ p: 3, overflowY: "auto" }}>
        <Typography variant="h5">Bài làm của {student.username}</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {submission
            ? `Nộp lúc: ${new Date(
                submission.submitted_at.toDate()
              ).toLocaleString("vi-VN")}`
            : "Chưa nộp bài"}
        </Typography>
        <Divider sx={{ my: 2 }} />

        {submission ? (
          <>
            <Typography variant="h6">Tệp đã nộp:</Typography>
            <Button
              variant="outlined"
              component="a"
              href={submission.file_path}
              target="_blank"
            >
              {submission.originalFileName}
            </Button>

            {/* Khung preview file */}
            <Box
              sx={{
                my: 2,
                border: "1px solid #ddd",
                height: 400,
                overflow: "hidden",
              }}
            >
              <iframe
                src={submission.file_path}
                width="100%"
                height="100%"
                title="File preview"
              />
            </Box>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Chấm điểm
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
              <TextField
                label="Điểm số"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                sx={{ width: "150px" }}
              />
              <Typography variant="h6">/ 10</Typography>
            </Box>
            <TextField
              label="Nhận xét"
              multiline
              rows={4}
              fullWidth
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleReturnGrade}
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Trả bài"}
            </Button>
          </>
        ) : (
          <Typography sx={{ mt: 4, textAlign: "center" }}>
            Sinh viên này chưa nộp bài cho bài tập này.
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default GradingPage;
