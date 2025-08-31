"use client"

import { useContext, useState } from "react"
import { IoIosClose } from "react-icons/io"
import { addDocument } from "../services/firebaseService"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from "@mui/material"
import { LoginContext } from "../contexts/AuthProvider"

const inner = {
  name: "",
  description: "",
  user_id: "",
}

const ModalAddSubject = ({ onClose, isOpen, parentId, classId }) => {
  const [errors, setErrors] = useState({ name: "" })
  const [subject, setSubject] = useState(inner)
  const { auth } = useContext(LoginContext)

  const handleChange = (e) => {
    setSubject((s) => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!validate()) {
      return
    }

    try {
      const subjectDoc = await addDocument("subjects", {
        ...subject,
        user_id: auth.id,
        classId: classId,
      })

      const nodeData = {
        name: subject.name,
        type: "file",
        user_id: auth.id,
        parentId: parentId, // Sử dụng parentId từ props
        classId: classId, // Sử dụng classId từ props
        subject_id: subjectDoc.id,
        description: subject.description,
        createdAt: new Date().toISOString(),
      }
      await addDocument("nodes", nodeData)

      setSubject(inner)
      onClose()
    } catch (error) {
      console.error("Error creating subject:", error)
    }
  }

  const validate = () => {
    const next = { name: "" }
    next.name = subject.name.trim() ? "" : "Vui lòng nhập tên môn học!"
    setErrors(next)
    return Object.values(next).every((m) => m === "")
  }

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Tạo môn học mới
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoIosClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          autoFocus
          required
          margin="dense"
          name="name"
          label="Tên môn học"
          fullWidth
          variant="outlined"
          value={subject.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          margin="dense"
          name="description"
          label="Mô tả môn học (Không bắt buộc)"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={subject.description}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Tạo
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalAddSubject
