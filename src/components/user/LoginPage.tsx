import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Alert
} from '@mui/material';
import {
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = (data: FormData) => {
    // In a real application, this would make a call to the authentication API
    console.log('Login form submitted:', data);

    // For demonstration, we'll simulate a successful login for specific credentials
    if (data.email === 'admin@example.com' && data.password === 'password') {
      // Navigate to home page after successful login
      navigate('/');
    } else {
      setLoginError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
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
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
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
                margin="normal"
                required
                fullWidth
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
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
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} color="primary" />}
                label="Ghi nhớ đăng nhập"
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Đăng nhập
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Link component={RouterLink} to="#" variant="body2">
                Quên mật khẩu?
              </Link>
            </Box>
            <Box>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Chưa có tài khoản? Đăng ký"}
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Hệ thống quản lý y tế học đường
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage; 