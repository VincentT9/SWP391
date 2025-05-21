import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { NurseMedicalEventsDashboard } from "./nurse";
import { ParentMedicalEventsDashboard } from "./parent";

// In a real app, this would come from authentication context
const mockUserRole = "nurse"; // Change to 'parent' to see the parent view
const mockUserId = mockUserRole === "nurse" ? "3" : "5"; // Nurse ID or Parent ID
const mockUserName =
  mockUserRole === "nurse" ? "Nguyễn Thị Y Tá" : "Trần Văn Phụ Huynh";

const MedicalEventsPage: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // In a real app, this would use React context or Redux for auth state
  useEffect(() => {
    // Simulate getting user role from auth system
    setUserRole(mockUserRole);
  }, []);

  const renderDashboardByRole = () => {
    switch (userRole) {
      case "nurse":
        return (
          <NurseMedicalEventsDashboard
            nurseId={mockUserId}
            nurseName={mockUserName}
          />
        );
      case "parent":
        return <ParentMedicalEventsDashboard parentId={mockUserId} />;
      default:
        return (
          <Alert severity="warning">
            Bạn không có quyền truy cập chức năng này.
          </Alert>
        );
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {userRole ? (
          renderDashboardByRole()
        ) : (
          <Typography variant="body1">Đang tải...</Typography>
        )}
      </Box>
    </Container>
  );
};

export default MedicalEventsPage;
