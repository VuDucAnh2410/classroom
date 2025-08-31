import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { MdAssignment, MdDoneAll } from "react-icons/md";

// Import các context cần thiết
import { LoginContext } from "../contexts/AuthProvider";
import { TasksContext } from "../contexts/TasksProvider";
import { SubjectContext } from "../contexts/SubjectProvider";
import { EnrollmentsContext } from "../contexts/EnrollmentsProvider";
import { formatDeadline } from "./formatDeadline";

function UpcomingTasks({ idClass }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tasks = useContext(TasksContext);
  const { auth } = useContext(LoginContext);
  const allSubjects = useContext(SubjectContext);
  const allEnrollments = useContext(EnrollmentsContext);

  const [taskTime, setTaskTime] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(idClass || "all");

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
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
  }, [auth, allSubjects, allEnrollments]);

  useEffect(() => {
    const now = new Date();
    const allUpcomingTasks = tasks.filter(
      (e) => e.deadline && e.deadline.toDate() > now
    );
    const tasksForSelectedClass =
      selectedClassId === "all"
        ? allUpcomingTasks
        : allUpcomingTasks.filter((e) => e.class_id === selectedClassId);
    const finalTaskList = tasksForSelectedClass.filter(
      (e) =>
        userClasses.some((c) => c.id === e.class_id && c.user_id === auth.id) ||
        e.assigned_users?.includes(auth.id)
    );
    finalTaskList.sort((a, b) => a.deadline.toDate() - b.deadline.toDate());
    setTaskTime(finalTaskList);
  }, [selectedClassId, tasks, auth, userClasses, idClass]);

  const displayedTasks = isExpanded ? taskTime : taskTime.slice(0, 3);

  const getClassName = (classId) => {
    const subject = allSubjects.find((s) => s.id === classId);
    return subject?.name || "Lớp học không xác định";
  };

  return (
    <Paper sx={{ p: 2, height: "fit-content", backgroundColor: "#f8f9fa" }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontWeight: "500", color: "#3c4043" }}
      >
        Sắp đến hạn
      </Typography>

      {!idClass && userClasses.length > 0 && (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Lọc theo lớp</InputLabel>
          <Select
            value={selectedClassId}
            label="Lọc theo lớp"
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <MenuItem value="all">
              <em>Tất cả lớp học</em>
            </MenuItem>
            {userClasses.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Divider sx={{ mb: 1 }} />
      {taskTime.length > 0 ? (
        <Box>
          {displayedTasks.map((task) => (
            <Link
              to={`/taskdetail/${task.id}`}
              key={task.id}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  p: 1.5,
                  my: 1,
                  borderRadius: "8px",
                  transition: "background-color 0.2s",
                  "&:hover": { backgroundColor: "#e8f0fe" },
                }}
              >
                <Box sx={{ mr: 1.5, color: "primary.main", mt: "3px" }}>
                  <MdAssignment size={24} />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{ fontWeight: 500, color: "#3c4043" }}
                    title={task?.name}
                  >
                    {task?.name}
                  </Typography>
                  <Typography
                    noWrap
                    variant="body2"
                    sx={{ color: "#5f6368" }}
                    title={getClassName(task.class_id)}
                  >
                    {getClassName(task.class_id)}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "error.main", ml: 1, whiteSpace: "nowrap" }}
                >
                  {task.deadline && formatDeadline(task.deadline.toDate())}
                </Typography>
              </Box>
            </Link>
          ))}
          {taskTime.length > 3 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", width: "100%" }}
            >
              <Button size="small" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Thu gọn" : "Xem tất cả"}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", p: 3, color: "text.secondary" }}>
          <Typography>Tuyệt vời, không có bài tập nào sắp đến hạn!</Typography>
        </Box>
      )}
    </Paper>
  );
}

export default UpcomingTasks;
