import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import { ParentHealthRecordsDashboard } from "./parent";
import { NurseHealthRecordsDashboard } from "./nurse";

// In a real app, this would come from authentication context
const mockUserRole = "parent"; // Change to 'nurse' to see the nurse view
const mockUserId = mockUserRole === "parent" ? "5" : "3"; // Parent ID or Nurse ID

const HealthRecordsPage: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // In a real app, this would use React context or Redux for auth state
  useEffect(() => {
    // Simulate getting user role from auth system
    setUserRole(mockUserRole);
  }, []);

  const renderDashboardByRole = () => {
    switch (userRole) {
      case "parent":
        return <ParentHealthRecordsDashboard parentId={mockUserId} />;
      case "nurse":
        return <NurseHealthRecordsDashboard nurseId={mockUserId} />;
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

export default HealthRecordsPage;
