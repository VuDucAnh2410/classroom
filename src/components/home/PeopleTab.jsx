import React, { useContext, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { MdPersonAdd, MdMoreVert, MdDelete } from "react-icons/md";

import AddStudentModal from "./AddStudentModal";
import { UserContext } from "../contexts/userProvider";
import { EnrollmentsContext } from "../contexts/EnrollmentsProvider";
import { SubjectContext } from "../contexts/SubjectProvider";
import { addDocument, deleteDocument } from "../services/firebaseService";

function PeopleTab({ subjectId }) {
  const allUsers = useContext(UserContext);
  const allEnrollments = useContext(EnrollmentsContext);
  const allSubjects = useContext(SubjectContext);
  const [isAddStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const subject = allSubjects.find((s) => s.id === subjectId);
  const teacher = allUsers.find((u) => u.id === subject?.user_id);

  const studentEnrollments = allEnrollments.filter(
    (e) => e.sub_id === subjectId
  );
  const students = allUsers.filter((u) =>
    studentEnrollments.some((e) => e.user_id === u.id)
  );

  const handleMenuOpen = (event, student) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;

    const enrollmentToDelete = allEnrollments.find(
      (e) => e.sub_id === subjectId && e.user_id === selectedStudent.id
    );

    if (
      enrollmentToDelete &&
      window.confirm(
        `Bạn có chắc muốn xóa học sinh "${selectedStudent.username}" khỏi lớp?`
      )
    ) {
      try {
        await deleteDocument("enrollments", enrollmentToDelete.id);
        alert(`Đã xóa học sinh ${selectedStudent.username}.`);
      } catch (error) {
        alert("Đã xảy ra lỗi khi xóa.");
        console.error("Error deleting student:", error);
      }
    }
    handleMenuClose();
  };

  const handleAddStudent = async (email) => {
    const studentToAdd = allUsers.find(
      (user) => user.email.toLowerCase() === email
    );
    if (!studentToAdd) {
      return alert("Không tìm thấy người dùng với email này.");
    }
    if (studentToAdd.id === subject?.user_id) {
      return alert(
        "Bạn không thể thêm giáo viên của lớp với tư cách học sinh."
      );
    }
    const isAlreadyEnrolled = students.some(
      (student) => student.id === studentToAdd.id
    );
    if (isAlreadyEnrolled) {
      return alert("Học sinh này đã có trong lớp.");
    }
    try {
      await addDocument("enrollments", {
        user_id: studentToAdd.id,
        sub_id: subjectId,
        role: "student",
        enrolled_at: new Date().toISOString(),
      });
      alert(`Đã thêm học sinh ${studentToAdd.username || email} vào lớp.`);
      setAddStudentModalOpen(false);
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm học sinh.");
      console.log(error);
    }
  };

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
        {teacher && (
          <ListItem>
            <ListItemText
              primary={teacher.username}
              secondary={teacher.email}
            />
          </ListItem>
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
          Học sinh ({students.length})
        </Typography>
        <IconButton
          title="Thêm học sinh"
          onClick={() => setAddStudentModalOpen(true)}
        >
          <MdPersonAdd />
        </IconButton>
      </Box>
      <List>
        {students.map((student) => (
          <ListItem
            key={student.id}
            divider
            secondaryAction={
              <IconButton
                edge="end"
                onClick={(e) => handleMenuOpen(e, student)}
              >
                <MdMoreVert />
              </IconButton>
            }
          >
            <ListItemText
              primary={student.username}
              secondary={student.email}
            />
          </ListItem>
        ))}
        {students.length === 0 && (
          <Typography sx={{ p: 2, color: "text.secondary" }}>
            Chưa có học sinh nào trong lớp.
          </Typography>
        )}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDeleteStudent}>
          <MdDelete sx={{ mr: 1 }} /> Xóa khỏi lớp
        </MenuItem>
      </Menu>

      <AddStudentModal
        open={isAddStudentModalOpen}
        onClose={() => setAddStudentModalOpen(false)}
        onSubmit={handleAddStudent}
      />
    </Box>
  );
}

export default PeopleTab;
