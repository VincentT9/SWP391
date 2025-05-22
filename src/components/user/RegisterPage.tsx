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
  Paper,
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
// Import the background image if you're using the import method
// import bgImage from '../../assets/Picture2.png';

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
  { value: 'nurse', label: 'Y tá' },
  { value: 'student', label: 'Học sinh' },
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
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(https://musical-indigo-mongoose.myfilebase.com/ipfs/Qme1KPa7qkgoWKaacDmnFcDWw5znEm3QRUK7EiijmQrS4L)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 600,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#0066b3',
          color: 'white',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ color: 'white' }}>
          Đăng ký tài khoản
        </Typography>
        
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            width: '100%', 
            mt: 3, 
            mb: 4,
            '& .MuiStepLabel-label': {
              color: 'white',
            },
            '& .MuiStepIcon-root': {
              color: '#75c043',
            },
            '& .MuiStepIcon-root.Mui-active': {
              color: 'yellow',
            },
            '& .MuiStepIcon-root.Mui-completed': {
              color: 'white',
            }
          }}
        >
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
                  <Typography sx={{ mb: 1, color: 'white' }}>Họ:</Typography>
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
                        placeholder="Họ"
                        autoFocus
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                        variant="outlined"
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flexBasis: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                  <Typography sx={{ mb: 1, color: 'white' }}>Tên:</Typography>
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
                        placeholder="Tên"
                        autoComplete="family-name"
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                        variant="outlined"
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography sx={{ mb: 1, color: 'white' }}>Email:</Typography>
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
                        placeholder="Email"
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                        variant="outlined"
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography sx={{ mb: 1, color: 'white' }}>Mật khẩu:</Typography>
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
                        placeholder="Mật khẩu"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="new-password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                        variant="outlined"
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
                  <Typography sx={{ mb: 1, color: 'white' }}>Xác nhận mật khẩu:</Typography>
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
                        placeholder="Xác nhận mật khẩu"
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword?.message}
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                        variant="outlined"
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
                  <Typography sx={{ mb: 1, color: 'white' }}>Vai trò:</Typography>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Vai trò là bắt buộc' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        fullWidth
                        placeholder="Vai trò"
                        error={!!errors.role}
                        helperText={errors.role?.message}
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                        variant="outlined"
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
                  <Typography sx={{ mb: 1, color: 'white' }}>Số điện thoại:</Typography>
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
                        placeholder="Số điện thoại"
                        autoComplete="tel"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                        variant="outlined"
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Typography sx={{ mb: 1, color: 'white' }}>Địa chỉ:</Typography>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: 'Địa chỉ là bắt buộc' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        placeholder="Địa chỉ"
                        multiline
                        rows={3}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        sx={{ 
                          mb: 2,
                          backgroundColor: 'white',
                          borderRadius: 1,
                          '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                        }}
                        variant="outlined"
                      />
                    )}
                  />
                </Box>
              </Box>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Xác nhận thông tin
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'white' }}>
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
                        sx={{ 
                          color: 'white',
                          '&.Mui-checked': {
                            color: 'white',
                          },
                        }}
                        checked={field.value}
                      />
                    }
                    label="Tôi đồng ý với các điều khoản và chính sách bảo mật"
                    sx={{ color: 'white' }}
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
              sx={{ 
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ 
                backgroundColor: '#75c043',
                '&:hover': {
                  backgroundColor: '#65b033',
                }
              }}
            >
              {activeStep === steps.length - 1 ? 'Đăng ký' : 'Tiếp theo'}
            </Button>
          </Box>
          
          {activeStep === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box>
                <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'yellow' }}>
                  Đã có tài khoản? Đăng nhập
                </Link>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;