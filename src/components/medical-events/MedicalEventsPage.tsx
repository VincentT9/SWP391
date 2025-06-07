import React from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { NurseMedicalEventsDashboard } from "./nurse";
import { ParentMedicalEventsDashboard } from "./parent";
import { useAuth } from '../auth/AuthContext';

const MedicalEventsPage: React.FC = () => {
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
      case "MedicalStaff":
        return (
          <NurseMedicalEventsDashboard
            nurseId={user.id}
            nurseName={user.name}
          />
        );
      case "Parent":
        return <ParentMedicalEventsDashboard parentId={user.id} />;
      case "Admin":
        return (
          <NurseMedicalEventsDashboard
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

  // Show loading if user is not yet loaded
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

export default MedicalEventsPage;