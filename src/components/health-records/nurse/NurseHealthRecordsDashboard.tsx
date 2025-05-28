import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { mockStudents, mockHealthRecords } from "../../../utils/mockData";
import { Student, HealthRecord } from "../../../models/types";
import { HealthRecordsList, StudentHealthRecordView } from ".";

interface NurseHealthRecordsDashboardProps {
  nurseId: string;
}

const NurseHealthRecordsDashboard: React.FC<
  NurseHealthRecordsDashboardProps
> = ({ nurseId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [healthRecord, setHealthRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch from an API
    setStudents(mockStudents);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Get the health record when student changes
    if (selectedStudent) {
      const record = mockHealthRecords.find(
        (rec) => rec.studentId === selectedStudent.id
      );
      setHealthRecord(record || null);
    } else {
      setHealthRecord(null);
    }
  }, [selectedStudent]);

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
  };

  const filteredStudents = students.filter((student) => {
    const fullName = `${student.lastName} ${student.firstName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      student.class.toLowerCase().includes(searchLower) ||
      student.grade.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Quản lý hồ sơ sức khỏe học sinh
      </Typography>

      {selectedStudent ? (
        <StudentHealthRecordView
          student={selectedStudent}
          healthRecord={healthRecord}
          onBack={handleBackToList}
        />
      ) : (
        <>
          <Paper sx={{ p: 2, mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Tìm kiếm học sinh theo tên, lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {filteredStudents.length === 0 ? (
            <Alert severity="info">
              Không tìm thấy học sinh phù hợp với từ khóa tìm kiếm.
            </Alert>
          ) : (
            <HealthRecordsList
              students={filteredStudents}
              healthRecords={mockHealthRecords}
              onSelectStudent={handleStudentSelect}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default NurseHealthRecordsDashboard;
