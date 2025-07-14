import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  acceptTerms: boolean;
};

// API Configuration from .env
const API_REGISTER_URL = process.env.REACT_APP_REGISTER_API;



const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      acceptTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setRegisterError(null);

    try {
      const response = await fetch(API_REGISTER_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.email,
        }),
      });

      // Đọc response body một lần duy nhất
      const responseData = await response.text();

      if (!response.ok) {
        let errorMessage = `Đăng ký thất bại (${response.status})`;

        // Kiểm tra các lỗi nghiệp vụ cụ thể
        if (responseData.includes("Username already exists")) {
          errorMessage =
            "Tên đăng nhập đã tồn tại. Vui lòng chọn tên đăng nhập khác.";
        } else if (responseData.includes("Email already exists")) {
          errorMessage =
            "Email đã được sử dụng. Vui lòng dùng email khác hoặc thử khôi phục mật khẩu.";
        } else {
          // Thử parse như JSON nếu có thể
          try {
            const errorObj = JSON.parse(responseData);
            errorMessage = errorObj?.message || errorMessage;
          } catch {
            // Nếu không phải JSON, hiển thị dưới dạng user-friendly
            if (responseData) {
              errorMessage =
                "Đăng ký không thành công. Vui lòng kiểm tra thông tin đăng ký.";
            }
          }
        }

        setRegisterError(errorMessage);
        return;
      }

      // Xử lý thành công

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:
          "url(https://musical-indigo-mongoose.myfilebase.com/ipfs/Qme1KPa7qkgoWKaacDmnFcDWw5znEm3QRUK7EiijmQrS4L)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: "90%", sm: 490 },
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#2980b9",
          color: "white",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "#2ecc71" }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ color: "white", mb: 1 }}>
          Đăng ký tài khoản
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "white", mb: 3, textAlign: "center" }}
        >
          Đăng ký tài khoản phụ huynh để theo dõi sức khỏe con em
        </Typography>

        {registerError && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {registerError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          {/* Username */}
          <Typography sx={{ mb: 1, color: "white" }}>Tên đăng nhập:</Typography>
          <Controller
            name="username"
            control={control}
            rules={{
              required: "Tên đăng nhập là bắt buộc",
              minLength: {
                value: 3,
                message: "Tên đăng nhập phải có ít nhất 3 ký tự",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Tên đăng nhập"
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              />
            )}
          />

          {/* Email */}
          <Typography sx={{ mb: 1, color: "white" }}>Email:</Typography>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email là bắt buộc",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Email"
                type="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              />
            )}
          />

          {/* Password */}
          <Typography sx={{ mb: 1, color: "white" }}>Mật khẩu:</Typography>
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Mật khẩu là bắt buộc",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Mật khẩu"
                type={showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Confirm Password */}
          <Typography sx={{ mb: 1, color: "white" }}>
            Xác nhận mật khẩu:
          </Typography>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Vui lòng xác nhận mật khẩu",
              validate: (value) => value === password || "Mật khẩu không khớp",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Xác nhận mật khẩu"
                type={showConfirmPassword ? "text" : "password"}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Terms Checkbox */}
          <Controller
            name="acceptTerms"
            control={control}
            rules={{ required: "Bạn phải đồng ý với điều khoản" }}
            render={({ field }) => (
              <>
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      sx={{
                        color: "white",
                        "&.Mui-checked": { color: "white" },
                      }}
                    />
                  }
                  label="Tôi đồng ý với các điều khoản và chính sách bảo mật"
                  sx={{ color: "white", mb: 2 }}
                />
                {errors.acceptTerms && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ display: "block", mb: 2, mt: -1 }}
                  >
                    {errors.acceptTerms.message}
                  </Typography>
                )}
              </>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              backgroundColor: "#2ecc71",
              "&:hover": { backgroundColor: "#27ae60" },
              "&:disabled": { backgroundColor: "#bdc3c7" },
            }}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>

          {/* Login Link */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="white">
              Đã có tài khoản?{" "}
              <Link
                component={RouterLink}
                to="/login"
                sx={{ color: "yellow", textDecoration: "none" }}
              >
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
