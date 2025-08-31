// src/components/grading/Gradebook.jsx

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { TasksContext } from "../../contexts/TasksProvider";
import { SubmissionsContext } from "../../contexts/SubmissionsProvider";
import { EnrollmentsContext } from "../../contexts/EnrollmentsProvider";
import { UserContext } from "../../contexts/userProvider";
import { SubjectContext } from "../../contexts/SubjectProvider";
import { LoginContext } from "../../contexts/AuthProvider";

const Gradebook = () => {
  const { id: classIdFromUrl } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const allTasks = useContext(TasksContext);
  const allSubmissions = useContext(SubmissionsContext);
  const allEnrollments = useContext(EnrollmentsContext);
  const allUsers = useContext(UserContext);
  const allSubjects = useContext(SubjectContext);
  const { auth } = useContext(LoginContext);

  const [selectedClassId, setSelectedClassId] = useState(classIdFromUrl || "");
  const [selectedTaskId, setSelectedTaskId] = useState(
    location.state?.defaultTaskId || ""
  );
  const [gradeData, setGradeData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const userClasses = useMemo(() => {
    if (!auth?.id || !allSubjects || !allEnrollments) return [];
    const taughtClasses = allSubjects.filter((sub) => sub.user_id === auth.id);
    const enrolledClassIds = allEnrollments
      .filter((en) => en.user_id === auth.id)
      .map((en) => en.class_id);
    const enrolledClasses = allSubjects.filter((sub) =>
      enrolledClassIds.includes(sub.id)
    );
    const combinedClasses = [...taughtClasses, ...enrolledClasses];
    return combinedClasses.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );
  }, [auth, allSubjects, allEnrollments]);

  useEffect(() => {
    if (selectedClassId && selectedClassId !== classIdFromUrl) {
      navigate(`/class/${selectedClassId}/grades`, { replace: true });
    }
  }, [selectedClassId, classIdFromUrl, navigate]);

  const tasksInClass = useMemo(
    () => allTasks.filter((task) => task.class_id === selectedClassId),
    [allTasks, selectedClassId]
  );

  useEffect(() => {
    if (tasksInClass.length > 0) {
      const currentTaskBelongsToClass = tasksInClass.some(
        (t) => t.id === selectedTaskId
      );
      if (!selectedTaskId || !currentTaskBelongsToClass) {
        setSelectedTaskId(tasksInClass[0].id);
      }
    } else {
      setSelectedTaskId("");
    }
  }, [tasksInClass, selectedTaskId]);

  useEffect(() => {
    if (!selectedTaskId || !selectedClassId) {
      setGradeData([]);
      return;
    }
    const studentsInClass = allEnrollments.filter(
      (en) => en.class_id === selectedClassId
    );
    const submissionsForTask = allSubmissions.filter(
      (sub) => sub.task_id === selectedTaskId
    );
    const data = studentsInClass.map((enrollment) => {
      const studentInfo = allUsers.find((u) => u.id === enrollment.user_id);
      const studentSubmission = submissionsForTask.find(
        (sub) => sub.user_id === enrollment.user_id
      );
      const score = studentSubmission?.score;
      let rank = "F";
      if (score >= 9) rank = "A+";
      else if (score >= 8) rank = "A";
      else if (score >= 7) rank = "B";
      else if (score >= 5) rank = "C";
      else if (score >= 4) rank = "D";
      return {
        studentId: studentInfo?.id,
        name: studentInfo?.username || "Không rõ",
        submissionsCount: studentSubmission ? 1 : 0,
        lateSubmissions: 0, // Cần bổ sung logic nộp trễ nếu có
        rank: studentSubmission ? rank : "Chưa nộp",
        averageScore: score ?? "N/A",
        status: studentSubmission
          ? score < 4
            ? "Học lại"
            : "Pass"
          : "Chưa nộp",
      };
    });
    setGradeData(data);
  }, [
    selectedTaskId,
    selectedClassId,
    allEnrollments,
    allSubmissions,
    allUsers,
  ]);

  const filteredGradeData = useMemo(() => {
    if (!searchTerm) return gradeData;
    return gradeData.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [gradeData, searchTerm]);

  const handleRowClick = (studentId) => {
    if (studentId && selectedTaskId && selectedClassId) {
      navigate(
        `/class/${selectedClassId}/grades/${selectedTaskId}/student/${studentId}`
      );
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Sổ điểm
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Chọn lớp học</InputLabel>
        <Select
          value={selectedClassId}
          label="Chọn lớp học"
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <MenuItem value="">
            <em>-- Vui lòng chọn một lớp --</em>
          </MenuItem>
          {userClasses.map((cls) => (
            <MenuItem key={cls.id} value={cls.id}>
              {cls.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <FormControl fullWidth disabled={!selectedClassId}>
          <InputLabel>Chọn bài tập</InputLabel>
          <Select
            value={selectedTaskId}
            label="Chọn bài tập"
            onChange={(e) => setSelectedTaskId(e.target.value)}
          >
            <MenuItem value="">
              <em>-- Chọn bài tập để xem điểm --</em>
            </MenuItem>
            {tasksInClass.map((task) => (
              <MenuItem key={task.id} value={task.id}>
                {task.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Tìm kiếm sinh viên"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={!selectedTaskId}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Số lần nộp</TableCell>
              <TableCell>Lần nộp trễ</TableCell>
              <TableCell>Hạng</TableCell>
              <TableCell>Điểm</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGradeData.map((row, index) => (
              <TableRow
                key={row.studentId}
                hover
                onClick={() => handleRowClick(row.studentId)}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.submissionsCount}</TableCell>
                <TableCell>{row.lateSubmissions}</TableCell>
                <TableCell>{row.rank}</TableCell>
                <TableCell>{row.averageScore}</TableCell>
                <TableCell>
                  <Typography
                    color={row.status === "Học lại" ? "error" : "inherit"}
                    sx={{
                      fontWeight: row.status === "Học lại" ? "bold" : "normal",
                    }}
                  >
                    {row.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Gradebook;
