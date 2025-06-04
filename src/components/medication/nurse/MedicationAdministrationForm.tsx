import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  // Paper,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
// import { format } from "date-fns";
import { MedicationRequest, MedicationLog } from "../../../models/types";
import { toast } from "react-toastify";

// Mock data import - would be replaced with API calls
import { medicationLogs } from "../../../utils/mockData";

interface MedicationAdministrationFormProps {
  medicationRequest: MedicationRequest;
  nurseName: string;
  onMedicationAdministered: () => void;
}

const MedicationAdministrationForm: React.FC<
  MedicationAdministrationFormProps
> = ({ medicationRequest, nurseName, onMedicationAdministered }) => {
  const [conditionBefore, setConditionBefore] = useState("");
  const [conditionAfter, setConditionAfter] = useState("");
  const [notes, setNotes] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new medication log
    const newLog: MedicationLog = {
      id: (medicationLogs.length + 1).toString(),
      medicationRequestId: medicationRequest.id,
      studentId: medicationRequest.studentId,
      medicationName: medicationRequest.medicationName,
      administeredAt: new Date(),
      administeredBy: nurseName,
      dosage: medicationRequest.dosage,
      studentConditionBefore: conditionBefore,
      studentConditionAfter: conditionAfter,
      notes,
    };

    // In a real app, this would make an API call
    medicationLogs.push(newLog);

    // Show success message
    setOpenSnackbar(true);
    toast.success("Đã cập nhật thông tin dùng thuốc!");

    // Reset form
    setConditionBefore("");
    setConditionAfter("");
    setNotes("");

    // Notify parent component
    onMedicationAdministered();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Chi tiết thuốc
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
              <Typography variant="body2">
                <strong>Học sinh:</strong> {medicationRequest.studentName}
              </Typography>
            </Box>
            <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
              <Typography variant="body2">
                <strong>Tên thuốc:</strong> {medicationRequest.medicationName}
              </Typography>
            </Box>
            <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
              <Typography variant="body2">
                <strong>Liều lượng:</strong> {medicationRequest.dosage}
              </Typography>
            </Box>
            <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
              <Typography variant="body2">
                <strong>Hướng dẫn:</strong> {medicationRequest.instructions}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Nhật ký uống thuốc
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            fullWidth
            id="condition-before"
            label="Tình trạng học sinh trước khi uống thuốc"
            value={conditionBefore}
            onChange={(e) => setConditionBefore(e.target.value)}
          />

          <TextField
            fullWidth
            id="condition-after"
            label="Tình trạng học sinh sau khi uống thuốc"
            value={conditionAfter}
            onChange={(e) => setConditionAfter(e.target.value)}
          />

          <TextField
            fullWidth
            id="notes"
            label="Ghi chú"
            multiline
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Box sx={{ mt: 1 }}>
            <Button variant="contained" color="primary" type="submit">
              Xác nhận đã cho uống thuốc
            </Button>
          </Box>
        </Box>
      </CardContent>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Đã ghi nhận thông tin uống thuốc!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MedicationAdministrationForm;
