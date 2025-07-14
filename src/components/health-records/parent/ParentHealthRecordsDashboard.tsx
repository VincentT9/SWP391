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
import PageHeader from "../../common/PageHeader";

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

  // Cập nhật phần hiển thị dị ứng
  const renderAllergies = () => {
    if (!healthRecord || !healthRecord.allergies) {
      return <Typography>Không có dị ứng nào được ghi nhận</Typography>;
    }

    return (
      <Typography variant="body1">
        {healthRecord.allergies || "Không có dị ứng nào được ghi nhận"}
      </Typography>
    );
  };

  // Cập nhật phần hiển thị bệnh mãn tính
  const renderChronicConditions = () => {
    if (!healthRecord || !healthRecord.chronicDiseases) {
      return <Typography>Không có bệnh mãn tính nào được ghi nhận</Typography>;
    }

    return (
      <Typography variant="body1">
        {healthRecord.chronicDiseases ||
          "Không có bệnh mãn tính nào được ghi nhận"}
      </Typography>
    );
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
      <PageHeader 
        title="Hồ sơ sức khỏe học sinh" 
        subtitle="Xem và cập nhật thông tin sức khỏe của con bạn"
      />

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
                    <strong>Nhóm máu:</strong>{" "}
                    {healthRecord.bloodType || "Chưa xác định"}
                  </Typography>
                </Box>
                <Box sx={{ flexBasis: { xs: "100%", md: "45%" } }}>
                  <Typography variant="body1">
                    <strong>Chiều cao:</strong> {healthRecord.height || "--"} cm
                  </Typography>
                  <Typography variant="body1">
                    <strong>Cân nặng:</strong> {healthRecord.weight || "--"} kg
                  </Typography>
                  <Typography variant="body1">
                    <strong>BMI:</strong>{" "}
                    {healthRecord.height && healthRecord.weight
                      ? (
                          healthRecord.weight /
                          ((healthRecord.height / 100) *
                            (healthRecord.height / 100))
                        ).toFixed(1)
                      : "--"}
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

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Thị lực và thính lực
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Thị lực
                </Typography>
                <Typography variant="body2">
                  <strong>Mắt trái:</strong>{" "}
                  {healthRecord.visionLeft || "Chưa có thông tin"}
                </Typography>
                <Typography variant="body2">
                  <strong>Mắt phải:</strong>{" "}
                  {healthRecord.visionRight || "Chưa có thông tin"}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Thính lực
                </Typography>
                <Typography variant="body2">
                  <strong>Tai trái:</strong>{" "}
                  {healthRecord.hearingLeft || "Chưa có thông tin"}
                </Typography>
                <Typography variant="body2">
                  <strong>Tai phải:</strong>{" "}
                  {healthRecord.hearingRight || "Chưa có thông tin"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Lịch sử y tế
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Tiền sử bệnh
                </Typography>
                <Typography variant="body2">
                  {healthRecord.pastMedicalHistory || "Không có thông tin"}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  Lịch sử tiêm chủng
                </Typography>
                <Typography variant="body2">
                  {healthRecord.vaccinationHistory || "Không có thông tin"}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Ghi chú bổ sung
              </Typography>
              <Typography variant="body2">
                {healthRecord.otherNotes || "Không có ghi chú bổ sung"}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
};

export default ParentHealthRecordsDashboard;
