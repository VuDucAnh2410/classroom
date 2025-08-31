import * as React from "react";
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
} from "@mui/material";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { UserContext } from "../contexts/userProvider";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/AuthProvider";

export default function LoginPage() {
  const navigate = useNavigate(); // Điều hướng
  const [values, setValues] = React.useState({
    email: "",
    password: "",
  });

  const users = useContext(UserContext);

  const { handelLogin } = useContext(LoginContext);

  const [showPwd, setShowPwd] = React.useState(false);
  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
  };

  const validate = () => {
    const next = { email: "", password: "" };

    if (!values.email.trim()) next.email = "Vui lòng nhập email";
    else if (!/^\S+@\S+\.\S+$/.test(values.email))
      next.email = "Email không hợp lệ";

    if (!values.password) next.password = "Vui lòng nhập mật khẩu";

    setErrors(next);
    return Object.values(next).some((m) => m !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("vfvs");
      return;
    }
    const userLogin = users.find(
      (e) => e.email == values.email && e.password == values.password
    );
    if (!userLogin) {
      alert("ten dang nhap or mat khau sai");
      return;
    }

    handelLogin(userLogin);

    navigate("/");
  };
  return (
    <div className="h-[100vh] flex justify-center items-center" >
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
            <Typography variant="h5" fontWeight={700} textAlign="center">
              Đăng nhập
            </Typography>

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

            <Button
              type="submit"
              variant="contained"
              size="large"
              disableElevation
              sx={{ borderRadius: 2, py: 1.2 }}
            >
              Đăng nhập
            </Button>

            <Typography variant="caption" color="text.secondary" align="center">
              Đã có tài khoản?{" "}
              <Link
                className="text-blue-600"
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
  </div>
  );
}
