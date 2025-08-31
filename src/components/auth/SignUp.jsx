import React, { useContext, useState } from "react";
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Stack,
  Divider,
} from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { addDocument } from "../services/firebaseService";
import { UserContext } from "../contexts/userProvider";
import { Link } from "react-router-dom";

const inner = {
  username: "",
  email: "",
  password: "",
  confirm: "",
};
export default function SignUp() {
  const [values, setValues] = useState(inner);

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const users = useContext(UserContext);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
  };

  const validate = () => {
    const next = { username: "", email: "", password: "", confirm: "" };

    if (!values.username.trim()) next.username = "Vui lòng nhập tên tài khoản";
    if (!values.email.trim()) next.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(values.email))
      next.email = "Email không hợp lệ";
    else {
      const emailExits = users.some(
        (e) => e.email.toLowerCase() === values.email.toLowerCase()
      );
      if (emailExits) {
        next.email = "Email này đã được sử dụng. Vui lòng chọn email khác.";
      }
    }

    if (!values.password) next.password = "Vui lòng nhập mật khẩu";
    else if (values.password.length < 6)
      next.password = "Mật khẩu tối thiểu 6 ký tự";

    if (!values.confirm) next.confirm = "Vui lòng nhập lại mật khẩu";
    else if (values.confirm !== values.password)
      next.confirm = "Mật khẩu nhập lại không khớp";

    setErrors(next);
    return Object.values(next).every((m) => m === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const { confirm, ...newUser } = values;
    await addDocument("users", newUser);
    setValues();
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={1}
        sx={{ p: { xs: 0, sm: 0 }, borderRadius: "16px 16px 16px 16px" }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              flex: 1,
            }}
          >
            <img
              src="./image/Login.png"
              alt="Đăng ký tài khoản"
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "cover",
                borderRadius: "16px 0 0 16px",
              }}
            />
          </Box>

          <Stack
            className="p-10"
            spacing={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700}>
                Đăng ký tài khoản
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tạo tài khoản của bạn chỉ trong vài bước.
              </Typography>
            </Box>

            <TextField
              label="Tên tài khoản"
              placeholder="vd: ducan123"
              fullWidth
              value={values.username}
              onChange={handleChange("username")}
              error={Boolean(errors.username)}
              helperText={errors.username || " "}
            />

            <TextField
              label="Email"
              type="email"
              placeholder="you@example.com"
              fullWidth
              value={values.email}
              onChange={handleChange("email")}
              error={Boolean(errors.email)}
              helperText={errors.email || " "}
            />

            <TextField
              label="Mật khẩu"
              type={showPwd ? "text" : "password"}
              fullWidth
              value={values.password}
              onChange={handleChange("password")}
              error={Boolean(errors.password)}
              helperText={errors.password || " "}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd((s) => !s)}
                      edge="end"
                    >
                      {showPwd ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Nhập lại mật khẩu"
              type={showConfirm ? "text" : "password"}
              fullWidth
              value={values.confirm}
              onChange={handleChange("confirm")}
              error={Boolean(errors.confirm)}
              helperText={errors.confirm || " "}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm((s) => !s)}
                      edge="end"
                    >
                      {showConfirm ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disableElevation
              sx={{ borderRadius: 2, py: 1.2 }}
            >
              Tạo tài khoản
            </Button>

            <Divider />
            <Typography variant="caption" color="text.secondary" align="center">
              Đã có tài khoản?{" "}
              <Link
                component="button"
                // Logic Nav
                sx={{ fontWeight: 600 }}
              >
                Đăng nhập!
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}
