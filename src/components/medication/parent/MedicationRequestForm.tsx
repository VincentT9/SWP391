import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addDays } from "date-fns";

// For demo purposes - would be replaced with actual API calls
import { medicationRequests } from "../../../utils/mockData";

interface MedicationRequestFormProps {
  parentId: string;
  onRequestSubmitted: () => void;
  studentOptions: { id: string; name: string }[];
}

const MedicationRequestForm: React.FC<MedicationRequestFormProps> = ({
  parentId,
  onRequestSubmitted,
  studentOptions,
}) => {
  const [studentId, setStudentId] = useState("");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [daysRequired, setDaysRequired] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !studentId ||
      !medicationName ||
      !dosage ||
      !instructions ||
      !daysRequired ||
      !startDate
    ) {
      return;
    }

    // Create a new medication request
    const newRequest = {
      id: (medicationRequests.length + 1).toString(),
      studentId,
      studentName: studentOptions.find((s) => s.id === studentId)?.name || "",
      parentId,
      medicationName,
      dosage,
      instructions,
      daysRequired,
      startDate: startDate as Date,
      endDate: addDays(startDate as Date, daysRequired),
      status: "requested" as const,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In a real app, this would make an API call
    medicationRequests.push(newRequest);

    // Show success message
    setOpenSnackbar(true);

    // Reset form
    setStudentId("");
    setMedicationName("");
    setDosage("");
    setInstructions("");
    setDaysRequired(1);
    setStartDate(new Date());
    setNotes("");

    // Notify parent component
    onRequestSubmitted();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gửi thuốc đến trường
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth required>
            <InputLabel id="student-select-label">Tên học sinh</InputLabel>
            <Select
              labelId="student-select-label"
              id="student-select"
              value={studentId}
              label="Tên học sinh"
              onChange={(e) => setStudentId(e.target.value)}
            >
              {studentOptions.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            required
            fullWidth
            id="medication-name"
            label="Tên thuốc"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
          />

          <TextField
            required
            fullWidth
            id="dosage"
            label="Liều lượng"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Ví dụ: 500mg, 1 viên"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            required
            fullWidth
            id="instructions"
            label="Hướng dẫn sử dụng"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Ví dụ: Uống sau bữa ăn trưa"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            required
            fullWidth
            id="days-required"
            label="Số ngày cần uống"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 30 } }}
            value={daysRequired}
            onChange={(e) => setDaysRequired(parseInt(e.target.value))}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Ngày bắt đầu"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { fullWidth: true, required: true } }}
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            id="notes"
            label="Ghi chú"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Box>

        <Box>
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Gửi yêu cầu
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Yêu cầu gửi thuốc đã được gửi thành công!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default MedicationRequestForm;
