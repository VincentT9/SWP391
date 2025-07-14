import React from "react";
import { Container, Typography, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PageHeader from "../common/PageHeader";

const DashboardPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <PageHeader 
          title="Bảng điều khiển"
          subtitle="Tổng quan về tình trạng y tế và các hoạt động của hệ thống"
        />
        <Typography variant="body1">
          Trang đang được phát triển. Chức năng bảng điều khiển sẽ sớm được cập
          nhật.
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage;
