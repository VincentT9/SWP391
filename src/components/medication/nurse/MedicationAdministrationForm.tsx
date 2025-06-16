import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
} from "@mui/material";
import { toast } from "react-toastify";
import { format, addDays, parseISO } from "date-fns";

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  class: string;
  schoolYear: string;
  image: string;
}

interface MedicationRequest {
  id: string;
  medicationName: string;
  dosage: number;
  numberOfDayToTake: number;
  instructions: string;
  imagesMedicalInvoice: string[];
  startDate: string;
  endDate: string | null;
  status: number;
  student: Student;
  medicalStaff: any;
}

interface MedicationAdministrationFormProps {
  medicationRequest: MedicationRequest;
  nurseName: string;
  onMedicationAdministered: (
    wasGiven: boolean,
    data: {
      conditionBefore?: string;
      conditionAfter?: string;
      notes?: string;
      reasonForNotAdministering?: string;
    }
  ) => void;
}

const MedicationAdministrationForm: React.FC<MedicationAdministrationFormProps> = ({
  medicationRequest,
  nurseName,
  onMedicationAdministered,
}) => {
  const [conditionBefore, setConditionBefore] = useState("");
  const [conditionAfter, setConditionAfter] = useState("");
  const [notes, setNotes] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notGivenDialogOpen, setNotGivenDialogOpen] = useState(false);
  const [reasonForNotGiving, setReasonForNotGiving] = useState("");
  const [givenDialogOpen, setGivenDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGiveMedicationClick = () => {
    setGivenDialogOpen(true);
  };

  const handleNotGiveMedicationClick = () => {
    setNotGivenDialogOpen(true);
  };

  const handleGivenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!conditionBefore.trim() || !conditionAfter.trim()) {
      toast.error("Vui lòng điền đầy đủ thông tin tình trạng học sinh");
      return;
    }

    try {
      setIsSubmitting(true);
      await onMedicationAdministered(true, {
        conditionBefore,
        conditionAfter,
        notes,
      });

      // Reset form and close dialog
      setConditionBefore("");
      setConditionAfter("");
      setNotes("");
      setGivenDialogOpen(false);
    } catch (error) {
      console.error("Error administering medication:", error);
      toast.error("Không thể cập nhật thông tin dùng thuốc. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotGivenSubmit = async () => {
    if (reasonForNotGiving.trim() === "") {
      toast.error("Vui lòng nhập lý do không cho uống thuốc.");
      return;
    }

    try {
      setIsSubmitting(true);
      await onMedicationAdministered(false, {
        reasonForNotAdministering: reasonForNotGiving,
      });

      // Reset form and close dialog
      setReasonForNotGiving("");
      setNotGivenDialogOpen(false);
    } catch (error) {
      console.error("Error logging not given medication:", error);
      toast.error("Không thể cập nhật thông tin hủy dùng thuốc. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Calculate the end date based on startDate + numberOfDayToTake
  const startDate = parseISO(medicationRequest.startDate);
  const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const endDate = addDays(startDateOnly, medicationRequest.numberOfDayToTake - 1);
  const formattedEndDate = format(endDate, "dd/MM/yyyy");
  const formattedStartDate = format(startDateOnly, "dd/MM/yyyy");
  
  // Check if today is in the valid date range
  const today = new Date();
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isToday = todayDateOnly >= startDateOnly && todayDateOnly <= endDate;
  
  // Calculate days remaining
  const daysRemaining = Math.ceil((endDate.getTime() - todayDateOnly.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <Card elevation={2} sx={{ mb: 3, border: isToday ? '1px solid #4caf50' : 'none' }}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          {/* Student Information */}
          <Box sx={{ 
            width: { xs: '100%', md: '25%' }, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <Stack direction="column" spacing={2} alignItems="center">
              <Avatar
                src={medicationRequest.student.image}
                alt={medicationRequest.student.fullName}
                sx={{ width: 80, height: 80 }}
              />
              <Typography variant="subtitle1" align="center">
                {medicationRequest.student.fullName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
              >
                {medicationRequest.student.class} |{" "}
                {medicationRequest.student.studentCode}
              </Typography>
            </Stack>
          </Box>

          {/* Medication Information */}
          <Box sx={{ 
            width: { xs: '100%', md: '58.33%' }, 
            pl: { md: 2 } 
          }}>
            <Typography variant="h6" gutterBottom>
              Chi tiết thuốc
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body1">
                <strong>Tên thuốc:</strong> {medicationRequest.medicationName}
              </Typography>

              <Typography variant="body1">
                <strong>Liều lượng:</strong> {medicationRequest.dosage}
              </Typography>

              <Typography variant="body1">
                <strong>Hướng dẫn:</strong> {medicationRequest.instructions}
              </Typography>

              <Typography variant="body1">
                <strong>Ngày uống:</strong> {formattedStartDate} - {formattedEndDate}
              </Typography>

              <Typography variant="body1">
                <strong>Số ngày uống:</strong> {medicationRequest.numberOfDayToTake} 
                {isToday && daysRemaining > 0 && (
                  <span style={{ color: '#4caf50', marginLeft: '8px' }}>
                    (Còn {daysRemaining} ngày)
                  </span>
                )}
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ 
            width: { xs: '100%', md: '16.67%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Stack
              direction="column"
              spacing={2}
              justifyContent="center"
              height="100%"
            >
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleGiveMedicationClick}
              >
                Đã cho uống thuốc
              </Button>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={handleNotGiveMedicationClick}
              >
                Hủy lần uống thuốc
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>

      {/* Given Medication Dialog */}
      <Dialog
        open={givenDialogOpen}
        onClose={() => !isSubmitting && setGivenDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Cập nhật thông tin uống thuốc</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleGivenSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
          >
            <TextField
              fullWidth
              id="condition-before"
              label="Tình trạng học sinh trước khi uống thuốc"
              value={conditionBefore}
              onChange={(e) => setConditionBefore(e.target.value)}
              required
            />

            <TextField
              fullWidth
              id="condition-after"
              label="Tình trạng học sinh sau khi uống thuốc"
              value={conditionAfter}
              onChange={(e) => setConditionAfter(e.target.value)}
              required
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setGivenDialogOpen(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleGivenSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận đã cho uống thuốc"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Not Given Medication Dialog */}
      <Dialog
        open={notGivenDialogOpen}
        onClose={() => !isSubmitting && setNotGivenDialogOpen(false)}
      >
        <DialogTitle>Lý do hủy lần uống thuốc</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Lý do không cho uống thuốc"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={reasonForNotGiving}
            onChange={(e) => setReasonForNotGiving(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setNotGivenDialogOpen(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleNotGivenSubmit} 
            color="error"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Xác nhận hủy"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Đã cập nhật thông tin uống thuốc!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default MedicationAdministrationForm;
