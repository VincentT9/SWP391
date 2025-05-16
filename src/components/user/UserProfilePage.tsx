import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const UserProfilePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Trang cá nhân
        </Typography>
        <Typography variant="body1">
          Trang đang được phát triển. Chức năng trang cá nhân sẽ sớm được cập nhật.
        </Typography>
      </Box>
    </Container>
  );
};

export default UserProfilePage; 