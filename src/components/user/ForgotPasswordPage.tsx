import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import instance from "../../utils/axiosConfig";
import { sub } from "date-fns";

type FormData = {
  username: string;
  email: string;
};

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Gọi API để lấy thông tin user theo username
      const userResponse = await instance.get(
        `/api/User/get-user-by-username/${data.username}`
      );

      // Kiểm tra dữ liệu trả về từ API
      const userData = userResponse.data;

      // Kiểm tra xem username và email có thuộc cùng một người dùng không
      if (
        userData &&
        userData.email &&
        userData.email.toLowerCase().trim() === data.email.toLowerCase().trim()
      ) {
        // Username và email khớp - thuộc cùng 1 người dùng
        const emailData = {
          subject: "Khôi phục mật khẩu - FPTMED",
          recipient: data.email,
          body: `Khôi phục mật khẩu - FPTMED

Xin chào ${userData.fullName || userData.username || data.username},

Bạn đã yêu cầu khôi phục mật khẩu cho tài khoản:
• Tên đăng nhập: ${userData.username || data.username}
• Email: ${userData.email}

MẬT KHẨU CỦA BẠN: ${userData.password || "Liên hệ admin"}

Vui lòng đăng nhập và đổi mật khẩu ngay lập tức vì lý do bảo mật.

Trân trọng,
FPTMED Team`,
        };

        await instance.post("/api/Auth/send-email", emailData);

        setSuccessMessage(
          "Mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư để lấy mật khẩu và đăng nhập. Bạn sẽ được chuyển về trang đăng nhập trong 5 giây."
        );
        toast.success("Đã gửi mật khẩu vào email của bạn!");

        // Chuyển về trang đăng nhập sau 5 giây
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      } else {
        // Username và email không khớp - không thuộc cùng 1 người dùng
        setErrorMessage(
          "Thông tin người dùng không đúng. Username và email không thuộc cùng một tài khoản."
        );
        toast.error("Thông tin của người dùng không đúng!");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);

      if (error.response?.status === 404) {
        toast.error("Thông tin của người dùng không đúng!");
      } else if (error.response?.status === 400) {
        toast.error("Thông tin của người dùng không đúng!");
      } else {
        toast.error("Thông tin người dùng không đúng");
      }
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
          width: 400,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#2980b9",
          color: "white",
        }}
      >
        <Box sx={{ mb: 4 }}>
          <img
            src="https://musical-indigo-mongoose.myfilebase.com/ipfs/QmPfdMNtJhcNfztJtxK88SXCrqWm54KuSWHKBW4TNhPr3x"
            alt="FPTMED"
            width="200"
          />
        </Box>

        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Quên mật khẩu
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 3, textAlign: "center", opacity: 0.9 }}
        >
          Nhập tên đăng nhập và email để nhận mật khẩu qua email
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
        >
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Typography sx={{ mb: 1 }}>Tên đăng nhập:</Typography>
          <Controller
            name="username"
            control={control}
            rules={{
              required: "Tên đăng nhập là bắt buộc",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="username"
                placeholder="Nhập tên đăng nhập của tài khoản"
                variant="outlined"
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={loading || !!successMessage}
                sx={{
                  mb: 2,
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              />
            )}
          />

          <Typography sx={{ mb: 1 }}>Email:</Typography>
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
                type="email"
                id="email"
                placeholder="Nhập email của cùng tài khoản"
                variant="outlined"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={loading || !!successMessage}
                sx={{
                  mb: 3,
                  backgroundColor: "white",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading || !!successMessage}
            sx={{
              mt: 1,
              mb: 2,
              py: 1.5,
              backgroundColor: "#2ecc71",
              "&:hover": {
                backgroundColor: "#27ae60",
              },
              "&:disabled": {
                backgroundColor: "#bdc3c7",
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Đang gửi email...
              </Box>
            ) : (
              "Gửi mật khẩu"
            )}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="white">
              Nhớ mật khẩu?{" "}
              <RouterLink
                to="/login"
                style={{ color: "yellow", textDecoration: "none" }}
              >
                Đăng nhập
              </RouterLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordPage;
