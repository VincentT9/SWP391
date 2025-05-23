import React from "react";
import { Container, Typography, Box } from "@mui/material";

const DashboardPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Bảng điều khiển
        </Typography>
        <Typography variant="body1">
          Trang đang được phát triển. Chức năng bảng điều khiển sẽ sớm được cập
          nhật.
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage;
