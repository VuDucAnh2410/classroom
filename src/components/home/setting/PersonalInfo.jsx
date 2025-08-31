// src/components/home/settings/PersonalInfo.jsx

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    name: "Ducan",
    email: "ducan04@gmail.com",
    phone: "0931926260",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: "primary.main" }}>
          D
        </Avatar>
        <Box>
          <Typography variant="h5">Ducan</Typography>
          <Button size="small" variant="outlined" sx={{ mt: 1 }}>
            Đổi ảnh đại diện
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Thông tin cá nhân
      </Typography>
      <TextField
        label="Tên"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Số điện thoại"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" sx={{ mt: 2 }}>
        Lưu
      </Button>
    </Box>
  );
};

export default PersonalInfo;
