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
  IconButton,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import instance from "../../utils/axiosConfig";

// Define form data types for each step
type EmailFormData = {
  email: string;
};

type OtpFormData = {
  otp: string;
};

type PasswordFormData = {
  newPassword: string;
  confirmPassword: string;
};

const ForgotPassword = () => {
  // States for managing the workflow
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Initialize form controls for each step
  const emailForm = useForm<EmailFormData>({
    defaultValues: { email: "" },
  });

  const otpForm = useForm<OtpFormData>({
    defaultValues: { otp: "" },
  });

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // Step 1: Request OTP by sending email
  const requestOtp = async (data: EmailFormData) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Call the forgot-password API to send OTP
      await instance.post("/api/Auth/forgot-password", { email: data.email });

      // Store email for later steps
      setEmail(data.email);

      setSuccessMessage(
        "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư để lấy mã OTP."
      );
      toast.success("Đã gửi mã OTP vào email của bạn!");

      // Move to OTP verification step
      setActiveStep(1);
    } catch (error: any) {
      console.error("Forgot password error:", error);

      if (error.response?.status === 404) {
        setErrorMessage("Không tìm thấy tài khoản với email này!");
        toast.error("Không tìm thấy tài khoản với email này!");
      } else if (error.response?.status === 400) {
        setErrorMessage(
          "Email không hợp lệ hoặc không tồn tại trong hệ thống!"
        );
        toast.error("Email không hợp lệ!");
      } else {
        setErrorMessage("Đã xảy ra lỗi khi gửi mã OTP. Vui lòng thử lại sau!");
        toast.error("Đã xảy ra lỗi khi gửi mã OTP!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async (data: OtpFormData) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Call the verify-otp API
      await instance.post("/api/Auth/verify-otp", {
        email: email,
        otp: data.otp,
      });

      // Store OTP for the next step
      setOtp(data.otp);

      setSuccessMessage("Mã OTP đã được xác thực thành công!");
      toast.success("Mã OTP hợp lệ!");

      // Move to reset password step
      setActiveStep(2);
    } catch (error: any) {
      console.error("OTP verification error:", error);

      if (error.response?.status === 400) {
        setErrorMessage("Mã OTP không chính xác hoặc đã hết hạn!");
        toast.error("Mã OTP không chính xác hoặc đã hết hạn!");
      } else {
        setErrorMessage("Đã xảy ra lỗi khi xác thực mã OTP. Vui lòng thử lại!");
        toast.error("Đã xảy ra lỗi khi xác thực mã OTP!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const resetPassword = async (data: PasswordFormData) => {
    // Validate password match
    if (data.newPassword !== data.confirmPassword) {
      setErrorMessage("Mật khẩu và xác nhận mật khẩu không khớp!");
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Call the reset-password API
      await instance.post("/api/Auth/reset-password", {
        email: email,
        otp: otp,
        newPassword: data.newPassword,
      });

      setSuccessMessage(
        "Mật khẩu đã được đặt lại thành công! Bạn sẽ được chuyển về trang đăng nhập trong 5 giây."
      );
      toast.success("Mật khẩu đã được đặt lại thành công!");

      // Redirect to login page after 5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error: any) {
      console.error("Password reset error:", error);

      if (error.response?.status === 400) {
        setErrorMessage("Thông tin không hợp lệ. Mã OTP có thể đã hết hạn!");
        toast.error("Thông tin không hợp lệ. Mã OTP có thể đã hết hạn!");
      } else {
        setErrorMessage(
          "Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại!"
        );
        toast.error("Đã xảy ra lỗi khi đặt lại mật khẩu!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle toggling password visibility
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const steps = ["Nhập Email", "Xác thực OTP", "Đặt lại mật khẩu"];

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

        <Box sx={{ width: "100%", mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>
                  <Typography variant="caption" color="white">
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, width: "100%" }}>
            {successMessage}
          </Alert>
        )}

        {/* Step 1: Email form */}
        {activeStep === 0 && (
          <Box
            component="form"
            onSubmit={emailForm.handleSubmit(requestOtp)}
            sx={{ width: "100%" }}
          >
            <Typography sx={{ mb: 1 }}>Email:</Typography>
            <Controller
              name="email"
              control={emailForm.control}
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
                  placeholder="Nhập email của tài khoản"
                  variant="outlined"
                  error={!!emailForm.formState.errors.email}
                  helperText={emailForm.formState.errors.email?.message}
                  disabled={loading}
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
              disabled={loading}
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
                  Đang gửi...
                </Box>
              ) : (
                "Gửi mã OTP"
              )}
            </Button>
          </Box>
        )}

        {/* Step 2: OTP Verification form */}
        {activeStep === 1 && (
          <Box
            component="form"
            onSubmit={otpForm.handleSubmit(verifyOtp)}
            sx={{ width: "100%" }}
          >
            <Typography sx={{ mb: 1 }}>Mã OTP:</Typography>
            <Controller
              name="otp"
              control={otpForm.control}
              rules={{
                required: "Mã OTP là bắt buộc",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Mã OTP chỉ bao gồm các số",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="otp"
                  placeholder="Nhập mã OTP từ email của bạn"
                  variant="outlined"
                  error={!!otpForm.formState.errors.otp}
                  helperText={otpForm.formState.errors.otp?.message}
                  disabled={loading}
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
              disabled={loading}
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
                  Đang xác thực...
                </Box>
              ) : (
                "Xác thực OTP"
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setActiveStep(0)}
              sx={{
                mb: 2,
                py: 1.5,
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  opacity: 0.9,
                },
              }}
            >
              Quay lại
            </Button>
          </Box>
        )}

        {/* Step 3: Reset Password form */}
        {activeStep === 2 && (
          <Box
            component="form"
            onSubmit={passwordForm.handleSubmit(resetPassword)}
            sx={{ width: "100%" }}
          >
            <Typography sx={{ mb: 1 }}>Mật khẩu mới:</Typography>
            <Controller
              name="newPassword"
              control={passwordForm.control}
              rules={{
                required: "Mật khẩu mới là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Nhập mật khẩu mới"
                  variant="outlined"
                  error={!!passwordForm.formState.errors.newPassword}
                  helperText={
                    passwordForm.formState.errors.newPassword?.message
                  }
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: "#2980b9" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    backgroundColor: "white",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  }}
                />
              )}
            />

            <Typography sx={{ mb: 1 }}>Xác nhận mật khẩu:</Typography>
            <Controller
              name="confirmPassword"
              control={passwordForm.control}
              rules={{
                required: "Xác nhận mật khẩu là bắt buộc",
                validate: (value) =>
                  value === passwordForm.getValues("newPassword") ||
                  "Mật khẩu không khớp",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Nhập lại mật khẩu mới"
                  variant="outlined"
                  error={!!passwordForm.formState.errors.confirmPassword}
                  helperText={
                    passwordForm.formState.errors.confirmPassword?.message
                  }
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: "#2980b9" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
              disabled={loading}
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
                  Đang đặt lại mật khẩu...
                </Box>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={() => setActiveStep(1)}
              sx={{
                mb: 2,
                py: 1.5,
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "white",
                  opacity: 0.9,
                },
              }}
            >
              Quay lại
            </Button>
          </Box>
        )}

        <Box sx={{ textAlign: "center", mt: 2 }}>
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
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
