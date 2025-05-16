import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const HealthCheckPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Kiểm tra sức khỏe
        </Typography>
        <Typography variant="body1">
          Trang đang được phát triển. Chức năng kiểm tra sức khỏe sẽ sớm được cập nhật.
        </Typography>
      </Box>
    </Container>
  );
};

export default HealthCheckPage; 