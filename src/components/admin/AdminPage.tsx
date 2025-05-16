import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản trị hệ thống
        </Typography>
        <Typography variant="body1">
          Trang đang được phát triển. Chức năng quản trị hệ thống sẽ sớm được cập nhật.
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminPage; 