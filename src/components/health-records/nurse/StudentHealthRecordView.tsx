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
  // Cập nhật để xử lý allergies là chuỗi thay vì mảng
  const renderAllergies = () => {
    if (!healthRecord || !healthRecord.allergies) {
      return <Typography>Không có dị ứng nào được ghi nhận</Typography>;
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">{healthRecord.allergies}</Typography>
      </Box>
    );
  };

  // Cập nhật để xử lý chronicDiseases là chuỗi thay vì mảng chronicConditions
  const renderChronicConditions = () => {
    if (!healthRecord || !healthRecord.chronicDiseases) {
      return <Typography>Không có bệnh mãn tính nào được ghi nhận</Typography>;
    }

    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">{healthRecord.chronicDiseases}</Typography>
      </Box>
    );
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

              {/* Cập nhật phần hiển thị thị lực */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Thị lực
              </Typography>
              <Typography variant="body1">
                <strong>Mắt trái:</strong>{" "}
                {healthRecord.visionLeft || "Chưa có thông tin"}
              </Typography>
              <Typography variant="body1">
                <strong>Mắt phải:</strong>{" "}
                {healthRecord.visionRight || "Chưa có thông tin"}
              </Typography>

              {/* Cập nhật phần hiển thị thính lực */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Thính lực
              </Typography>
              <Typography variant="body1">
                <strong>Tai trái:</strong>{" "}
                {healthRecord.hearingLeft || "Chưa có thông tin"}
              </Typography>
              <Typography variant="body1">
                <strong>Tai phải:</strong>{" "}
                {healthRecord.hearingRight || "Chưa có thông tin"}
              </Typography>

              {/* Thêm phần hiển thị tiền sử bệnh */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Tiền sử bệnh
              </Typography>
              <Typography variant="body1">
                {healthRecord.pastMedicalHistory || "Không có thông tin"}
              </Typography>

              {/* Thêm phần hiển thị lịch sử tiêm chủng */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Lịch sử tiêm chủng
              </Typography>
              <Typography variant="body1">
                {healthRecord.vaccinationHistory || "Không có thông tin"}
              </Typography>

              {/* Thêm phần hiển thị ghi chú bổ sung */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Ghi chú bổ sung
              </Typography>
              <Typography variant="body1">
                {healthRecord.otherNotes || "Không có ghi chú bổ sung"}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Paper>
  );
};

export default StudentHealthRecordView;
