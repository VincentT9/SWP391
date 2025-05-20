import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Paper,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Student, HealthRecord } from "../../../models/types";

interface StudentHealthRecordViewProps {
  student: Student;
  healthRecord: HealthRecord | null;
  onBack: () => void;
}

const StudentHealthRecordView: React.FC<StudentHealthRecordViewProps> = ({
  student,
  healthRecord,
  onBack,
}) => {
  const renderAllergies = () => {
    if (!healthRecord || healthRecord.allergies.length === 0) {
      return <Typography>Không có dị ứng nào được ghi nhận</Typography>;
    }

    return healthRecord.allergies.map((allergy) => (
      <Box key={allergy.id} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="primary">
          {allergy.name} - Mức độ:{" "}
          {allergy.severity === "mild"
            ? "Nhẹ"
            : allergy.severity === "moderate"
            ? "Trung bình"
            : "Nặng"}
        </Typography>
        <Typography variant="body2">
          <strong>Triệu chứng:</strong> {allergy.symptoms}
        </Typography>
        <Typography variant="body2">
          <strong>Điều trị:</strong> {allergy.treatment}
        </Typography>
      </Box>
    ));
  };

  const renderChronicConditions = () => {
    if (!healthRecord || healthRecord.chronicConditions.length === 0) {
      return <Typography>Không có bệnh mãn tính nào được ghi nhận</Typography>;
    }

    return healthRecord.chronicConditions.map((condition) => (
      <Box key={condition.id} sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="primary">
          {condition.name}
        </Typography>
        <Typography variant="body2">
          <strong>Ngày chẩn đoán:</strong>{" "}
          {condition.diagnosisDate.toLocaleDateString("vi-VN")}
        </Typography>
        <Typography variant="body2">
          <strong>Ghi chú:</strong> {condition.notes}
        </Typography>
      </Box>
    ));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5">
          Hồ sơ sức khỏe: {student.lastName} {student.firstName}
        </Typography>
      </Box>

      {!healthRecord ? (
        <Typography>Học sinh này chưa có hồ sơ sức khỏe</Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thông tin cơ bản
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 2,
                }}
              >
                <Box sx={{ flexBasis: { xs: "100%", md: "45%" } }}>
                  <Typography variant="body1">
                    <strong>Họ và tên:</strong> {student.lastName}{" "}
                    {student.firstName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Lớp:</strong> {student.class}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ngày sinh:</strong>{" "}
                    {student.dateOfBirth.toLocaleDateString("vi-VN")}
                  </Typography>
                </Box>
                <Box sx={{ flexBasis: { xs: "100%", md: "45%" } }}>
                  <Typography variant="body1">
                    <strong>Chiều cao:</strong> {healthRecord.height} cm
                  </Typography>
                  <Typography variant="body1">
                    <strong>Cân nặng:</strong> {healthRecord.weight} kg
                  </Typography>
                  <Typography variant="body1">
                    <strong>Nhóm máu:</strong>{" "}
                    {healthRecord.bloodType || "Chưa có thông tin"}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Dị ứng
              </Typography>
              {renderAllergies()}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Bệnh mãn tính
              </Typography>
              {renderChronicConditions()}

              {healthRecord.visionAssessment && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Thị lực
                  </Typography>
                  <Typography variant="body1">
                    <strong>Đo ngày:</strong>{" "}
                    {healthRecord.visionAssessment.date.toLocaleDateString(
                      "vi-VN"
                    )}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Mắt trái:</strong>{" "}
                    {healthRecord.visionAssessment.leftEye}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Mắt phải:</strong>{" "}
                    {healthRecord.visionAssessment.rightEye}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Có đeo kính:</strong>{" "}
                    {healthRecord.visionAssessment.wearsCorrective
                      ? "Có"
                      : "Không"}
                  </Typography>
                </>
              )}

              {healthRecord.hearingAssessment && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Thính lực
                  </Typography>
                  <Typography variant="body1">
                    <strong>Đo ngày:</strong>{" "}
                    {healthRecord.hearingAssessment.date.toLocaleDateString(
                      "vi-VN"
                    )}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Tai trái:</strong>{" "}
                    {healthRecord.hearingAssessment.leftEar}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Tai phải:</strong>{" "}
                    {healthRecord.hearingAssessment.rightEar}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Paper>
  );
};

export default StudentHealthRecordView;
