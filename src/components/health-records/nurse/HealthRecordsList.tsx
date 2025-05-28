import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
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
  // Helper function to get health record status
  const getHealthRecordStatus = (studentId: string) => {
    const record = healthRecords.find(
      (record) => record.studentId === studentId
    );
    return record ? "Có" : "Không";
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Mã học sinh</TableCell>
            <TableCell>Họ và tên</TableCell>
            <TableCell>Lớp</TableCell>
            <TableCell>Khối</TableCell>
            <TableCell>Hồ sơ sức khỏe</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.id}
              hover
              onClick={() => onSelectStudent(student)}
              sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
            >
              <TableCell>{student.id}</TableCell>
              <TableCell>
                {student.lastName} {student.firstName}
              </TableCell>
              <TableCell>{student.class}</TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell>
                <Chip
                  label={getHealthRecordStatus(student.id)}
                  color={
                    getHealthRecordStatus(student.id) === "Có"
                      ? "success"
                      : "default"
                  }
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HealthRecordsList;
