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
  InputAdornment,
  IconButton,
  Alert,
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  username: string;
  password: string;
  confirmPassword: string;
  phone: string;
  acceptTerms: boolean;
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      phone: '',
      acceptTerms: false,
    },
  });

  const password = watch('password');
  const username = watch('username');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setRegisterError(null);

    try {
      // Add role as parent by default, use username as name
      const registerData = {
        ...data,
        firstName: username, // Sử dụng username làm tên
        lastName: '',
        name: username, // Tên hiển thị
        role: 'parent', // Mặc định là parent
      };

      console.log('Registration form submitted:', registerData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message and navigate to login
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');

    } catch (error) {
      console.error('Registration error:', error);
      setRegisterError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
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
          width: { xs: '90%', sm: 490 }, // Giảm từ 550 xuống 480 - vừa đủ cho text
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#0066b3',
          color: 'white',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: '#75c043' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ color: 'white', mb: 1 }}>
          Đăng ký tài khoản
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', mb: 3, textAlign: 'center' }}>
          Đăng ký tài khoản phụ huynh để theo dõi sức khỏe con em
        </Typography>
        
        {registerError && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {registerError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          {/* Tên đăng nhập */}
          <Typography sx={{ mb: 1, color: 'white' }}>Tên đăng nhập:</Typography>
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Tên đăng nhập là bắt buộc',
              minLength: {
                value: 3,
                message: 'Tên đăng nhập phải có ít nhất 3 ký tự',
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Tên đăng nhập chỉ chứa chữ cái, số và dấu gạch dưới',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Tên đăng nhập (sẽ được dùng làm tên hiển thị)"
                error={!!errors.username}
                helperText={errors.username?.message}
                sx={{ 
                  mb: 2,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              />
            )}
          />

          {/* Mật khẩu */}
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
                fullWidth
                placeholder="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{ 
                  mb: 2,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
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

          {/* Xác nhận mật khẩu */}
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
                fullWidth
                placeholder="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                sx={{ 
                  mb: 2,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
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

          {/* Số điện thoại */}
          <Typography sx={{ mb: 1, color: 'white' }}>Số điện thoại:</Typography>
          <Controller
            name="phone"
            control={control}
            rules={{
              required: 'Số điện thoại là bắt buộc',
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: 'Số điện thoại không hợp lệ (10-11 số)',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="Số điện thoại"
                error={!!errors.phone}
                helperText={errors.phone?.message}
                sx={{ 
                  mb: 2,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              />
            )}
          />

          {/* Checkbox đồng ý - Giữ nguyên font như cũ, form rộng hơn để text trên 1 dòng */}
          <Controller
            name="acceptTerms"
            control={control}
            rules={{ required: 'Bạn phải đồng ý với điều khoản' }}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    sx={{ 
                      color: 'white',
                      '&.Mui-checked': {
                        color: 'white',
                      },
                    }}
                  />
                }
                label="Tôi đồng ý với các điều khoản và chính sách bảo mật"
                sx={{ color: 'white', mb: 2 }}
              />
            )}
          />
          {errors.acceptTerms && (
            <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2, mt: -1 }}>
              {errors.acceptTerms.message}
            </Typography>
          )}

          {/* Nút đăng ký */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{ 
              mt: 1,
              mb: 2,
              py: 1.5,
              backgroundColor: '#75c043',
              '&:hover': {
                backgroundColor: '#65b033',
              },
              '&:disabled': {
                backgroundColor: '#cccccc',
              }
            }}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>

          {/* Link đăng nhập - ở giữa */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="white">
              Đã có tài khoản? <Link component={RouterLink} to="/login" sx={{ color: 'yellow', textDecoration: 'none' }}>Đăng nhập</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;