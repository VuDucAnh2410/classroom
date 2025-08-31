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
import React, { useContext, useState } from "react"; // Đã có useState
import { MdPersonAdd } from "react-icons/md";
import { UserContext } from "../../contexts/userProvider";
import { SubjectContext } from "../../contexts/SubjectProvider";
import { EnrollmentsContext } from "../../contexts/EnrollmentsProvider";
import { useParams } from "react-router-dom";
import AddStudentModal from "./AddStudentModal"; // THÊM MỚI: Import modal

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  // THÊM MỚI: Hàm để mở và đóng modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Tìm giáo viên
  const currentSubject = allSubjects.find((sub) => sub.id === subjectId);
  const teacherId = currentSubject?.user_id;
  const teacher = allUsers.find((user) => user.id === teacherId);

  // Tìm học sinh
  // LƯU Ý QUAN TRỌNG: Hãy chắc chắn rằng trường trong collection 'enrollments' của bạn là 'sub_id'.
  // Nếu nó có tên khác (ví dụ: 'subject_id' hoặc 'class_id'), hãy thay đổi nó ở dòng dưới.
  const studentEnrollments = allEnrollments.filter(
    (e) => e.sub_id === subjectId // <-- KIỂM TRA LẠI TÊN TRƯỜNG NÀY
  );

  const studentIds = studentEnrollments.map((e) => e.user_id);

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
        {/* CẬP NHẬT: Thêm onClick để gọi hàm mở modal */}
        <IconButton title="Thêm học sinh" onClick={handleOpenModal}>
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

      {/* THÊM MỚI: Render Modal và truyền các props cần thiết */}
      <AddStudentModal
        open={isModalOpen}
        onClose={handleCloseModal}
        subjectId={subjectId}
        currentStudentIds={studentIds}
      />
    </Box>
  );
}

export default TabPeople;
