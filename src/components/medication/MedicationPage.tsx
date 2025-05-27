import React from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import ParentMedicationDashboard from "./parent/ParentMedicationDashboard";
import NurseMedicationDashboard from "./nurse/NurseMedicationDashboard";
import { useAuth } from '../auth/AuthContext';

const MedicationPage: React.FC = () => {
  const { user } = useAuth();

  const renderDashboardByRole = () => {
    if (!user?.isAuthenticated) {
      return (
        <Alert severity="error">
          Bạn cần đăng nhập để truy cập chức năng này.
        </Alert>
      );
    }

    switch (user.role) {
      case "parent":
        return <ParentMedicationDashboard parentId={user.id} />;
      case "nurse":
        return (
          <NurseMedicationDashboard
            nurseId={user.id}
            nurseName={user.name}
          />
        );
      case "admin":
        return (
          <NurseMedicationDashboard
            nurseId={user.id}
            nurseName={user.name}
          />
        );
      case "student":
        return (
          <Alert severity="info">
            Học sinh không có quyền quản lý thuốc. Vui lòng liên hệ y tá hoặc phụ huynh.
          </Alert>
        );
      default:
        return (
          <Alert severity="warning">
            Bạn không có quyền truy cập chức năng này.
          </Alert>
        );
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="body1">Đang tải thông tin người dùng...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {renderDashboardByRole()}
      </Box>
    </Container>
  );
};

export default MedicationPage;