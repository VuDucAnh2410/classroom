"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  CircularProgress, // Thêm import
} from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { IoIosClose } from "react-icons/io";
import { SubjectContext } from "../../contexts/SubjectProvider";
import { addDocument } from "../../services/firebaseService";
import { LoginContext } from "../../contexts/AuthProvider";
import { EnrollmentsContext } from "../../contexts/EnrollmentsProvider"; // Thêm import

const JoinClassModal = ({ isOpen, onClose }) => {
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading

  // Lấy dữ liệu từ contexts
  const subjects = useContext(SubjectContext);
  const enrollments = useContext(EnrollmentsContext); // Thêm context
  const { auth } = useContext(LoginContext);

  // Reset state khi modal được mở
  useEffect(() => {
    if (isOpen) {
      setClassCode("");
      setError("");
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Reset lỗi mỗi khi submit
    setError("");

    if (!classCode.trim()) {
      setError("Vui lòng nhập mã lớp học");
      return;
    }

    setIsLoading(true);

    try {
      // KIỂM TRA 1: Mã lớp có tồn tại không?
      const subjectToJoin = subjects.find((e) => e.id === classCode.trim());
      if (!subjectToJoin) {
        setError("Mã lớp học không tồn tại. Vui lòng kiểm tra lại.");
        setIsLoading(false);
        return;
      }

      // KIỂM TRA 2: Người dùng có phải là giáo viên của lớp này không?
      if (subjectToJoin.user_id === auth.id) {
        setError("Bạn không thể tham gia lớp học do chính mình tạo.");
        setIsLoading(false);
        return;
      }

      // KIỂM TRA 3: Người dùng đã tham gia lớp này chưa?
      const isAlreadyEnrolled = enrollments.some(
        (en) => en.class_id === subjectToJoin.id && en.user_id === auth.id
      );
      if (isAlreadyEnrolled) {
        setError("Bạn đã tham gia lớp học này rồi.");
        setIsLoading(false);
        return;
      }

      // Nếu tất cả kiểm tra đều qua, tiến hành thêm enrollment
      await addDocument("enrollments", {
        user_id: auth.id,
        class_id: subjectToJoin.id,
        joined_at: new Date(), // Thêm thông tin ngày tham gia
      });

      onClose(); // Đóng modal sau khi thành công
    } catch (err) {
      console.error("Lỗi khi tham gia lớp học:", err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false); // Luôn tắt loading dù thành công hay thất bại
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Tham gia lớp học
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <IoIosClose size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Nhập mã lớp học mà giáo viên đã cung cấp
        </Typography>

        <TextField
          autoFocus
          required
          margin="dense"
          label="Mã lớp học"
          placeholder="Ví dụ: aBcXyZ"
          fullWidth
          variant="outlined"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={isLoading} // Vô hiệu hóa khi đang tải
        />
      </DialogContent>

      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={onClose} disabled={isLoading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isLoading}
          startIcon={
            isLoading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isLoading ? "Đang xử lý..." : "Tham gia"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinClassModal;
