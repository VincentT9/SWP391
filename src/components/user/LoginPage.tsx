import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Alert,
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../auth/AuthContext'; 

type FormData = {
  username: string;
  password: string;
  remember: boolean;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
   const { login } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      username: '',
      password: '',
      remember: false
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoginError(null); // Clear previous errors
      
      console.log('Login form submitted:', data);
      
      // Use the login function from AuthContext
      const success = await login(data.username, data.password);
      
      if (success) {
        console.log('Login successful');
        navigate('/'); // Navigate to dashboard on successful login
      } else {
        setLoginError('Tên truy cập hoặc mật khẩu không đúng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
          width: 400,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#0066b3',
          color: 'white',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <img src="https://musical-indigo-mongoose.myfilebase.com/ipfs/QmPfdMNtJhcNfztJtxK88SXCrqWm54KuSWHKBW4TNhPr3x" alt="FPTMED" width="200" />
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          
          <Typography sx={{ mb: 1 }}>Tên truy cập:</Typography>
          <Controller
            name="username"
            control={control}
            rules={{
              required: 'Tên truy cập là bắt buộc',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                id="username"
                placeholder="Tên truy cập"
                variant="outlined"
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
          
          <Typography sx={{ mb: 1 }}>Mật khẩu:</Typography>
          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Mật khẩu là bắt buộc',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Mật khẩu"
                variant="outlined"
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
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Controller
              name="remember"
              control={control}
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
                    />
                  }
                  label="Lưu thông tin"
                  sx={{ color: 'white' }}
                />
              )}
            />
            <RouterLink to="/forgot-password" style={{ color: 'white', textDecoration: 'none' }}>
              Quên mật khẩu
            </RouterLink>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ 
              mt: 1, 
              mb: 2, 
              py: 1.5,
              backgroundColor: '#75c043',
              '&:hover': {
                backgroundColor: '#65b033',
              }
            }}
          >
            Đăng nhập
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="white">
              Không có tài khoản? <RouterLink to="/register" style={{ color: 'yellow', textDecoration: 'none' }}>Đăng ký</RouterLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage; 