import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid as MuiGrid,
} from "@mui/material";
import { Student } from "../../../models/types";

interface StudentSelectorProps {
  students: Student[];
  selectedStudentId: string;
  onSelectStudent: (studentId: string) => void;
}

const StudentSelector: React.FC<StudentSelectorProps> = ({
  students,
  selectedStudentId,
  onSelectStudent,
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chọn học sinh
      </Typography>
      <MuiGrid container spacing={2}>
        {students.map((student) => (
          <MuiGrid
            key={student.id}
            sx={{ width: { xs: "100%", sm: "50%", md: "33.33%" } }}
          >
            <Card
              sx={{
                cursor: "pointer",
                borderColor:
                  student.id === selectedStudentId ? "primary.main" : "divider",
                borderWidth: student.id === selectedStudentId ? 2 : 1,
                borderStyle: "solid",
                m: 1,
              }}
              onClick={() => onSelectStudent(student.id)}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                }}
              >
                <Avatar sx={{ width: 50, height: 50, bgcolor: "primary.main" }}>
                  {student.firstName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {student.lastName} {student.firstName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lớp {student.class}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </MuiGrid>
        ))}
      </MuiGrid>
    </Box>
  );
};

export default StudentSelector;
