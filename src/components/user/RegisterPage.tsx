import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Box,
  Typography,
  Container,
  MenuItem,
  InputAdornment,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  phone: string;
  address: string;
  acceptTerms: boolean;
};

const roles = [
  { value: 'parent', label: 'Phụ huynh' },
  { value: 'nurse', label: 'Nhân viên y tế' },
  { value: 'teacher', label: 'Giáo viên' },
  { value: 'manager', label: 'Quản lý' },
];

const steps = ['Thông tin tài khoản', 'Thông tin cá nhân', 'Xác nhận'];

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'parent',
      phone: '',
      address: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = (data: FormData) => {
    // In a real application, this would make a call to the registration API
    console.log('Registration form submitted:', data);

    // For demonstration, we'll simulate a successful registration
    if (activeStep === steps.length - 1) {
      // Navigate to login page after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      handleNext();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng ký tài khoản
        </Typography>
        
        <Stepper activeStep={activeStep} sx={{ width: '100%', mt: 3, mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {registerError && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {registerError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
          {activeStep === 0 && (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: 'Họ là bắt buộc' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        autoComplete="given-name"
                        required
                        fullWidth
                        id="firstName"
                        label="Họ"
                        autoFocus
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: 'Tên là bắt buộc' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        id="lastName"
                        label="Tên"
                        autoComplete="family-name"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email là bắt buộc',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email không hợp lệ',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: 'Mật khẩu là bắt buộc',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
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
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: 'Vui lòng xác nhận mật khẩu',
                      validate: (value) => value === password || 'Mật khẩu không khớp',
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Xác nhận mật khẩu"
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfirmPassword}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Vai trò là bắt buộc' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        label="Vai trò"
                        error={!!errors.role}
                        helperText={errors.role?.message}
                      >
                        {roles.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: 'Số điện thoại là bắt buộc',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Số điện thoại không hợp lệ',
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Số điện thoại"
                        autoComplete="tel"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: 'Địa chỉ là bắt buộc' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label="Địa chỉ"
                        multiline
                        rows={3}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                      />
                    )}
                  />
                </Box>
              </Box>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Typography variant="h6" gutterBottom>
                Xác nhận thông tin
              </Typography>
              <Typography variant="body1" paragraph>
                Vui lòng kiểm tra lại thông tin đăng ký trước khi hoàn tất.
              </Typography>
              <Controller
                name="acceptTerms"
                control={control}
                rules={{ required: 'Bạn phải đồng ý với điều khoản' }}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        color="primary"
                        checked={field.value}
                      />
                    }
                    label="Tôi đồng ý với các điều khoản và chính sách bảo mật"
                  />
                )}
              />
              {errors.acceptTerms && (
                <Typography color="error" variant="caption">
                  {errors.acceptTerms.message}
                </Typography>
              )}
            </>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {activeStep === steps.length - 1 ? 'Đăng ký' : 'Tiếp theo'}
            </Button>
          </Box>
          
          {activeStep === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box>
                <Link component={RouterLink} to="/login" variant="body2">
                  Đã có tài khoản? Đăng nhập
                </Link>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ mt: 5, mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Hệ thống quản lý y tế học đường
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage; 