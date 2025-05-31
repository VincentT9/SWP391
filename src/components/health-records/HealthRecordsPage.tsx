import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Person as PersonIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  Bloodtype as BloodtypeIcon,
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
} from "@mui/icons-material";
import { mockHealthRecords, mockStudents } from "../../utils/mockData";

const HealthRecordsPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Get the student and health record for the selected tab
  const student = mockStudents[selectedTab];
  const healthRecord = mockHealthRecords.find(
    (record) => record.studentId === student.id
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "success";
      case "moderate":
        return "warning";
      case "severe":
        return "error";
      default:
        return "default";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "mild":
        return "Nhẹ";
      case "moderate":
        return "Trung bình";
      case "severe":
        return "Nặng";
      default:
        return "Không xác định";
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Hồ sơ sức khỏe học sinh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xem và quản lý thông tin sức khỏe của học sinh
        </Typography>
      </Box>

      {/* Student Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 500,
              textTransform: "none",
            },
          }}
        >
          {mockStudents.map((student, index) => (
            <Tab
              key={student.id}
              label={`${student.lastName} ${student.firstName} - Lớp ${student.class}`}
              sx={{ minHeight: 60 }}
            />
          ))}
        </Tabs>
      </Paper>

      {healthRecord ? (
        // Thẻ duy nhất chứa tất cả thông tin học sinh
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            {/* Thông tin cơ bản học sinh */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56, mr: 2 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {student.lastName} {student.firstName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Lớp {student.class} •{" "}
                  {student.dateOfBirth.toLocaleDateString("vi-VN")}
                </Typography>
              </Box>
            </Box>

            {/* Các chỉ số sức khỏe cơ bản */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Chỉ số sức khỏe
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  "& > *": {
                    flex: {
                      xs: "1 1 100%",
                      sm: "1 1 calc(50% - 8px)",
                      md: "1 1 calc(25% - 12px)",
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <HeightIcon sx={{ color: "#1976d2", mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Chiều cao
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {healthRecord.height} cm
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <WeightIcon sx={{ color: "#1976d2", mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Cân nặng
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {healthRecord.weight} kg
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <BloodtypeIcon sx={{ color: "#d32f2f", mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nhóm máu
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {healthRecord.bloodType || "Chưa xác định"}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <HospitalIcon sx={{ color: "#4caf50", mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      BMI
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {(
                        healthRecord.weight /
                        Math.pow(healthRecord.height / 100, 2)
                      ).toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Dị ứng */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <WarningIcon sx={{ color: "#ff9800", mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Dị ứng ({healthRecord.allergies.length})
                </Typography>
              </Box>

              {healthRecord.allergies.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {healthRecord.allergies.map((allergy) => (
                    <Typography
                      key={allergy.id}
                      variant="body2"
                      sx={{ p: 1, bgcolor: "#fff3e0", borderRadius: 1 }}
                    >
                      <strong>{allergy.name}</strong> (
                      {getSeverityText(allergy.severity)}) - {allergy.symptoms}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Không có dị ứng nào được ghi nhận
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Bệnh mãn tính */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <HospitalIcon sx={{ color: "#f44336", mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Bệnh mãn tính ({healthRecord.chronicConditions.length})
                </Typography>
              </Box>

              {healthRecord.chronicConditions.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {healthRecord.chronicConditions.map((condition) => (
                    <Typography
                      key={condition.id}
                      variant="body2"
                      sx={{ p: 1, bgcolor: "#ffebee", borderRadius: 1 }}
                    >
                      <strong>{condition.name}</strong> - {condition.notes} (từ{" "}
                      {condition.diagnosisDate.toLocaleDateString("vi-VN")})
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Không có bệnh mãn tính nào được ghi nhận
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <HospitalIcon sx={{ fontSize: 64, color: "#bdbdbd", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy hồ sơ sức khỏe
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Hãy khai báo sức khỏe cho học sinh này
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/health-declaration")}
            >
              Khai báo sức khỏe
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {healthRecord && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => (window.location.href = "/health-declaration")}
          >
            Khai báo sức khỏe mới
          </Button>
          <Button variant="contained" color="primary">
            Cập nhật hồ sơ
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default HealthRecordsPage;
