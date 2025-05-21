import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HealthRecordForm from "./HealthRecordForm";
import { mockStudents, mockHealthRecords } from "../../../utils/mockData";
import { HealthRecord, Student } from "../../../models/types";

interface ParentHealthRecordsDashboardProps {
  parentId: string;
}

const ParentHealthRecordsDashboard: React.FC<
  ParentHealthRecordsDashboardProps
> = ({ parentId }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [studentList, setStudentList] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);

  useEffect(() => {
    // In a real app, we would fetch from an API
    // Filter students by parent ID
    const filteredStudents = mockStudents.filter(
      (student) => student.parentId === parentId
    );
    setStudentList(filteredStudents);

    if (filteredStudents.length > 0) {
      setSelectedStudent(filteredStudents[0]);
    }
  }, [parentId]);

  useEffect(() => {
    // Get the health record when student changes
    if (selectedStudent) {
      const record = mockHealthRecords.find(
        (rec) => rec.studentId === selectedStudent.id
      );
      setHealthRecord(record || null);
    }
  }, [selectedStudent]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedStudent(studentList[newValue]);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveHealthRecord = (record: HealthRecord) => {
    // In a real app, we would save to the database via API
    setHealthRecord(record);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

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

  if (studentList.length === 0) {
    return (
      <Typography>
        Không tìm thấy học sinh nào thuộc về phụ huynh này.
      </Typography>
    );
  }

  if (isEditing) {
    return (
      <HealthRecordForm
        studentId={selectedStudent?.id || ""}
        initialRecord={healthRecord}
        onSave={handleSaveHealthRecord}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hồ sơ sức khỏe học sinh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xem và cập nhật thông tin sức khỏe của con bạn
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {studentList.map((student) => (
            <Tab
              key={student.id}
              label={`${student.lastName} ${student.firstName} - Lớp ${student.class}`}
            />
          ))}
        </Tabs>
      </Paper>

      {selectedStudent && healthRecord && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
            >
              Cập nhật hồ sơ
            </Button>
          </Box>

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
                    <strong>Họ và tên:</strong> {selectedStudent.lastName}{" "}
                    {selectedStudent.firstName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Lớp:</strong> {selectedStudent.class}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Ngày sinh:</strong>{" "}
                    {selectedStudent.dateOfBirth.toLocaleDateString("vi-VN")}
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
    </>
  );
};

export default ParentHealthRecordsDashboard;
