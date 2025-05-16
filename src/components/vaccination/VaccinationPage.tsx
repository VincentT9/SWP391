import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const VaccinationPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Tiêm chủng
        </Typography>
        <Typography variant="body1">
          Trang đang được phát triển. Chức năng quản lý tiêm chủng sẽ sớm được cập nhật.
        </Typography>
      </Box>
    </Container>
  );
};

export default VaccinationPage; 