import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Alert } from "@mui/material";
import ParentMedicationDashboard from "./parent/ParentMedicationDashboard";
import NurseMedicationDashboard from "./nurse/NurseMedicationDashboard";

// In a real app, this would come from authentication context
const mockUserRole = "nurse"; // Change to 'nurse' to see the nurse view
const mockUserId = "5"; // Parent ID or Nurse ID
const getMockUserName = (role: string) => {
  switch (role) {
    case 'parent':
      return 'Trần Văn Phụ Huynh';
    case 'nurse':
      return 'Nguyễn Thị Y Tá';
    case 'admin':
      return 'Lê Văn Quản Trị';
    case 'student':
      return 'Phạm Học Sinh';
    default:
      return 'Người dùng';
  }
};

const mockUserName = getMockUserName(mockUserRole);

const MedicationPage: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  // In a real app, this would use React context or Redux for auth state
  useEffect(() => {
    // Simulate getting user role from auth system
    setUserRole(mockUserRole);
  }, []);

  const renderDashboardByRole = () => {
    switch (userRole) {
      case "parent":
        return <ParentMedicationDashboard parentId={mockUserId} />;
      case "nurse":
        return (
          <NurseMedicationDashboard
            nurseId={mockUserId}
            nurseName={mockUserName}
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

export default MedicationPage;
