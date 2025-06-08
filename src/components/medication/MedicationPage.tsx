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
      case "Parent":
        return <ParentMedicationDashboard parentId={user.id} />;
      case "MedicalStaff":
        return (
          <NurseMedicationDashboard
            nurseId={user.id}
            nurseName={user.name}
          />
        );
      case "Admin":
        return (
          <NurseMedicationDashboard
            nurseId={user.id}
            nurseName={user.name}
          />
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