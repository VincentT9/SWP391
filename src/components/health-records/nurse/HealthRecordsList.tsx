import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Student, HealthRecord } from "../../../models/types";

interface HealthRecordsListProps {
  students: Student[];
  healthRecords: HealthRecord[];
  onSelectStudent: (student: Student) => void;
}

const HealthRecordsList: React.FC<HealthRecordsListProps> = ({
  students,
  healthRecords,
  onSelectStudent,
}) => {
  // Function to check if a student has health record
  const hasHealthRecord = (studentId: string): boolean => {
    return healthRecords.some((record) => record.studentId === studentId);
  };

  // Function to get student's health status summary
  const getHealthSummary = (studentId: string): string => {
    const record = healthRecords.find((r) => r.studentId === studentId);

    if (!record) return "Không có thông tin";

    const issues = [];

    if (record.allergies) {
      issues.push("Dị ứng");
    }

    if (record.chronicDiseases) {
      issues.push("Bệnh mãn tính");
    }

    return issues.length > 0 ? issues.join(", ") : "Khỏe mạnh";
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Họ và tên</TableCell>
            <TableCell>Lớp</TableCell>
            <TableCell>Ngày sinh</TableCell>
            <TableCell>Tình trạng sức khỏe</TableCell>
            <TableCell>Hồ sơ</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>
                {student.lastName} {student.firstName}
              </TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>
                {student.dateOfBirth.toLocaleDateString("vi-VN")}
              </TableCell>
              <TableCell>{getHealthSummary(student.id)}</TableCell>
              <TableCell>
                {hasHealthRecord(student.id) ? (
                  <Chip
                    label="Đã có"
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                ) : (
                  <Chip
                    label="Chưa có"
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                )}
              </TableCell>
              <TableCell>
                <Tooltip title="Xem hồ sơ">
                  <IconButton
                    color="primary"
                    onClick={() => onSelectStudent(student)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HealthRecordsList;
