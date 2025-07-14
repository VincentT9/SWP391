import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import { toast } from "react-toastify";
import { format, addDays, parseISO, isToday as isTodayDateFns } from "date-fns";
import instance from "../../../utils/axiosConfig";

const BASE_API = process.env.REACT_APP_BASE_URL;

interface MedicationDiaryEntry {
  id: string;
  medicationReqId: string;
  status: number;
  description: string;
  createAt: string;
  createdBy: string;
}

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
  studentCode: string;
  studentName: string;
  medicalStaffId: string;
  medicalStaffName: string | null;
  medicalDiaries?: MedicationDiaryEntry[]; // Add this field to handle diary entries from API
}

interface MedicationAdministrationFormProps {
  medicationRequest: MedicationRequest;
  nurseName: string;
  onMedicationAdministered: (
    wasGiven: boolean,
    description: string
  ) => void;
}

const MedicationAdministrationForm: React.FC<MedicationAdministrationFormProps> = ({
  medicationRequest,
  nurseName,
  onMedicationAdministered,
}) => {
  const [description, setDescription] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notGivenDialogOpen, setNotGivenDialogOpen] = useState(false);
  const [givenDialogOpen, setGivenDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [isCompletedToday, setIsCompletedToday] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [todayDiaryCount, setTodayDiaryCount] = useState(0);

  // Function to check diary entries from medication request data (if available) or fetch from API
  const checkAndUpdateMedicationStatus = async (medicationRequestId: string) => {
    try {
      setCheckingStatus(true);
      
      let diaryEntries: MedicationDiaryEntry[] = [];
      
      // First, check if diary entries are already available in the medicationRequest prop
      if (medicationRequest.medicalDiaries && Array.isArray(medicationRequest.medicalDiaries)) {
        diaryEntries = medicationRequest.medicalDiaries;
      } else {
        // If not available in props, fetch from API
        const medicationResponse = await instance.get(
          `${BASE_API}/api/MedicationRequest/get-medication-request-by-id/${medicationRequestId}`
        );
        
        const medicationData = medicationResponse.data;
        diaryEntries = medicationData.medicalDiaries || [];
      }
      
      // Filter diary entries that were created today for this specific medication request
      const todayEntries = diaryEntries.filter(entry => {
        const entryDate = parseISO(entry.createAt);
        const today = new Date();
        
        // Check if the entry was created today (same date)
        return entryDate.getDate() === today.getDate() &&
               entryDate.getMonth() === today.getMonth() &&
               entryDate.getFullYear() === today.getFullYear();
      });

      // If there are any diary entries for today (regardless of status), medication is completed for today
      const hasEntriesForToday = todayEntries.length > 0;
      setIsCompletedToday(hasEntriesForToday);
      setTodayDiaryCount(todayEntries.length);
      
      if (hasEntriesForToday) {
        // Log details about each entry
        todayEntries.forEach((entry, index) => {
          const statusText = entry.status === 1 ? 'đã cho uống' : 'đã hủy';
          const createTime = format(parseISO(entry.createAt), 'HH:mm:ss');
        });
      }
      
      return hasEntriesForToday;
    } catch (error) {
      console.error("Error checking medication request details:", error);
      setIsCompletedToday(false);
      setTodayDiaryCount(0);
      return false;
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      if (medicationRequest.studentCode) {
        setLoadingStudent(true);
        try {
          const response = await instance.get(`/api/Student/get-student-by-student-code/${medicationRequest.studentCode}`);
          setStudent(response.data);
        } catch (error) {
          console.error('Error fetching student data:', error);
        } finally {
          setLoadingStudent(false);
        }
      }
    };

    fetchStudentData();
  }, [medicationRequest.studentCode]);

  // Check medication status on component mount and when medicationRequest changes
  useEffect(() => {
    // Debounce to prevent multiple calls
    const timeoutId = setTimeout(() => {
      if (medicationRequest.id) {
        checkAndUpdateMedicationStatus(medicationRequest.id);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [medicationRequest.id]);

  const handleGiveMedicationClick = () => {
    setGivenDialogOpen(true);
  };

  const handleNotGiveMedicationClick = () => {
    setNotGivenDialogOpen(true);
  };

  const handleGivenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create medication diary entry for administered medication
      const createResponse = await instance.post(`${BASE_API}/api/MedicaDiary/create`, {
        medicationReqId: medicationRequest.id,
        status: 1, // 1 for administered
        description: description
      });

      // Check status with current medication request ID (no additional API call needed here)
      await checkAndUpdateMedicationStatus(medicationRequest.id);

      toast.success("Đã ghi nhận lần cho uống thuốc thành công");

      // Reset form and close dialog first
      setDescription("");
      setGivenDialogOpen(false);

      // Call the parent callback AFTER successful creation and UI update
      setTimeout(() => {
        onMedicationAdministered(true, description);
      }, 100);
    } catch (error) {
      console.error("Error administering medication:", error);
      toast.error("Không thể cập nhật thông tin dùng thuốc. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotGivenSubmit = async () => {
    if (description.trim() === "") {
      toast.error("Vui lòng nhập lý do không cho uống thuốc.");
      return;
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create medication diary entry for not administered medication
      const createResponse = await instance.post(`${BASE_API}/api/MedicaDiary/create`, {
        medicationReqId: medicationRequest.id,
        status: 0, // 0 for not administered
        description: description
      });

      // Check status with current medication request ID
      await checkAndUpdateMedicationStatus(medicationRequest.id);

      toast.info("Đã ghi nhận thông tin hủy lần uống thuốc");

      // Reset form and close dialog first
      setDescription("");
      setNotGivenDialogOpen(false);

      // Call the parent callback AFTER successful creation and UI update
      setTimeout(() => {
        onMedicationAdministered(false, description);
      }, 100);
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
    <Card elevation={2} sx={{ mb: 3, border: isToday ? '1px solid #2ecc71' : 'none' }}>
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
              {loadingStudent ? (
                <CircularProgress size={80} />
              ) : (
                <Avatar
                  src={student?.image || '/default-avatar.png'}
                  alt={medicationRequest.studentName}
                  sx={{ width: 80, height: 80 }}
                />
              )}
              <Typography variant="subtitle1" align="center">
                {medicationRequest.studentName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
              >
                {student?.class && `${student.class} | `}
                {medicationRequest.studentCode}
              </Typography>
            </Stack>
          </Box>

          {/* Medication Information */}
          <Box sx={{ 
            width: { xs: '100%', md: '58.33%' }, 
            pl: { md: 2 } 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h6">
                Chi tiết thuốc
              </Typography>
              {checkingStatus ? (
                <CircularProgress size={20} />
              ) : isCompletedToday ? (
                <Chip 
                  label={`Hôm nay đã uống thuốc (${todayDiaryCount} lần ghi nhận)`} 
                  color="success" 
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              ) : null}
            </Box>

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
                  <span style={{ color: '#2ecc71', marginLeft: '8px' }}>
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
              {isCompletedToday ? (
                <Alert severity="info" sx={{ textAlign: 'center', fontSize: '0.875rem' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Hôm nay đã uống thuốc
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    Không thể thực hiện thêm thao tác
                  </Typography>
                </Alert>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleGiveMedicationClick}
                    disabled={isSubmitting || checkingStatus}
                  >
                    Đã cho uống thuốc
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleNotGiveMedicationClick}
                    disabled={isSubmitting || checkingStatus}
                  >
                    Hủy lần uống thuốc
                  </Button>
                </>
              )}
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
              id="description"
              label="Mô tả"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
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
            id="description"
            label="Lý do không cho uống thuốc"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
