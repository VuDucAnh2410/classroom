import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { MdPersonAdd } from "react-icons/md";
import { UserContext } from "../../contexts/userProvider";
import { SubjectContext } from "../../contexts/SubjectProvider";
import { EnrollmentsContext } from "../../contexts/EnrollmentsProvider";
import { useParams } from "react-router-dom";

const PersonListItem = ({ person }) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar>{person?.username?.charAt(0).toUpperCase()}</Avatar>
    </ListItemAvatar>
    <ListItemText primary={person?.username || "Không rõ"} />
  </ListItem>
);

function TabPeople() {
  const { id: subjectId } = useParams();
  const allUsers = useContext(UserContext) || [];
  const allSubjects = useContext(SubjectContext) || [];
  const allEnrollments = useContext(EnrollmentsContext) || [];

  // Tìm lớp học hiện tại trong danh sách tất cả các lớp
  const currentSubject = allSubjects.find((sub) => sub.id === subjectId);
  // Lấy ID của giáo viên từ thông tin lớp học
  const teacherId = currentSubject?.user_id;
  // Tìm đối tượng người dùng (giáo viên) đầy đủ từ ID đó
  const teacher = allUsers.find((user) => user.id === teacherId);
  // LOG 1: Kiểm tra xem ID lớp học có được truyền vào đúng không
  console.log("1. ID Lớp học nhận được (subjectId):", subjectId);
  // LOG 2: Kiểm tra xem có tìm thấy thông tin lớp học không
  console.log("2. Lớp học hiện tại tìm thấy:", currentSubject);
  // LOG 3: Kiểm tra ID của giáo viên
  console.log("3. ID của giáo viên từ lớp học:", teacherId);

  // LOG 4: Kiểm tra danh sách người dùng có sẵn chưa
  console.log("4. Toàn bộ danh sách người dùng (allUsers):", allUsers);
  // LOG 5: Kiểm tra kết quả tìm kiếm cuối cùng
  console.log("5. Kết quả tìm giáo viên (teacher):", teacher);
  // 3. Logic tìm học sinh
  // Lọc ra tất cả các lượt ghi danh (enrollment) thuộc về lớp này
  const studentEnrollments = allEnrollments.filter(
    (e) => e.sub_id === subjectId
  );
  // Từ đó, lấy ra danh sách ID của các học sinh
  const studentIds = studentEnrollments.map((e) => e.user_id);
  // Lọc danh sách người dùng để lấy thông tin đầy đủ của các học sinh
  // Đồng thời loại trừ giáo viên ra khỏi danh sách học sinh
  const students = allUsers.filter(
    (user) => studentIds.includes(user.id) && user.id !== teacherId
  );
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 2,
          borderColor: "primary.main",
          pb: 1,
        }}
      >
        <Typography variant="h5" color="primary.main">
          Giáo viên
        </Typography>
      </Box>
      <List>
        {teacher ? (
          <PersonListItem person={teacher} />
        ) : (
          <Typography sx={{ p: 2 }}>
            Không tìm thấy thông tin giáo viên.
          </Typography>
        )}
      </List>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: 2,
          borderColor: "primary.main",
          pb: 1,
          mt: 4,
        }}
      >
        <Typography variant="h5" color="primary.main">
          Học sinh
        </Typography>
        <IconButton title="Thêm học sinh">
          <MdPersonAdd />
        </IconButton>
      </Box>
      <List>
        {students.length > 0 ? (
          students.map((student) => (
            <PersonListItem key={student.id} person={student} />
          ))
        ) : (
          <Typography sx={{ p: 2 }}>Chưa có học sinh nào trong lớp.</Typography>
        )}
      </List>
    </Box>
  );
}

export default TabPeople;
