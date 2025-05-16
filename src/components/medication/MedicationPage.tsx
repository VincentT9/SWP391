import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const MedicationPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Quản lý thuốc
        </Typography>
        <Typography variant="body1">
          Trang đang được phát triển. Chức năng quản lý thuốc sẽ sớm được cập nhật.
        </Typography>
      </Box>
    </Container>
  );
};

export default MedicationPage; 