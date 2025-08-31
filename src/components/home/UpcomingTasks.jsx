import { useContext, useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, Button } from "@mui/material";
import { LoginContext } from "../contexts/AuthProvider";
import { TasksContext } from "../contexts/TasksProvider";
import { formatDeadline } from "./formatDeadline";

function UpcomingTasks({ idClass, isTeacher }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const tasks = useContext(TasksContext);
  const { auth } = useContext(LoginContext);
  const [taskTime, setTaskTime] = useState([]);
  useEffect(() => {
    const now = new Date();
    const allUpcomingTasksInClass = tasks.filter(
      (e) => e.class_id === idClass && e.deadline && e.deadline.toDate() > now
    );
    let finalTaskList;
    if (isTeacher) {
      // Nếu là giáo viên, danh sách cuối cùng là tất cả bài tập của lớp
      finalTaskList = allUpcomingTasksInClass;
    } else {
      // Nếu là học sinh, lọc tiếp để lấy bài tập được giao cho mình
      finalTaskList = allUpcomingTasksInClass.filter((e) =>
        e.listUser?.includes(auth.id)
      );
    }
    finalTaskList.sort((a, b) => a.deadline.toDate() - b.deadline.toDate());
    setTaskTime(finalTaskList);
  }, [idClass, auth, tasks, isTeacher]);

  const displayedTasks = isExpanded ? taskTime : taskTime.slice(0, 2);
  return (
    <Paper sx={{ p: 2, height: "fit-content" }}>
      <Typography variant="h6" gutterBottom>
        Lời nhắc
      </Typography>
      <Divider className="mb-2" />
      {taskTime.length > 0 ? (
        <>
          {displayedTasks.map((e, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                mb: 1,
                mt: 1,
                backgroundColor: "white",
                borderRadius: 2,
                border: "1px solid #e0e0e0",
                cursor: "pointer",
                "&:hover": { boxShadow: 1, borderColor: "primary.main" },
              }}
            >
              <Typography sx={{ ml: 2, flexGrow: 1, fontWeight: 400 }}>
                {e?.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "error.main", mr: 2 }}>
                Hạn: {formatDeadline(e?.deadline.toDate())}
              </Typography>
            </Box>
          ))}

          {/* Chỉ hiển thị nút nếu tổng số task lớn hơn 2 */}
          {taskTime.length > 2 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                size="small"
                sx={{ mt: 1 }}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Không có bài tập nào sắp đến hạn.
        </Typography>
      )}
    </Paper>
  );
}

export default UpcomingTasks;
