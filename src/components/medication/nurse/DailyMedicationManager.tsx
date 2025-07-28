import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  Divider,
} from "@mui/material";
import { format, parseISO, isToday, differenceInDays } from "date-fns";
import { toast } from "react-toastify";
import instance from "../../../utils/axiosConfig";

const BASE_API = process.env.REACT_APP_BASE_URL;

interface DailyDosageEntry {
  medicationRequestId: string;
  medicationName: string;
  studentName: string;
  studentCode: string;
  totalDosesPerDay: number;
  remainingDosesToday: number;
  completedDosesToday: number;
  startDate: string;
  endDate: string;
  instructions: string;
  isCompleteForToday: boolean;
  daysRemaining: number;
}

interface MedicationDiaryEntry {
  id: string;
  medicationReqId: string;
  status: number;
  description: string;
  createAt: string;
  createdBy: string;
}

interface DailyMedicationManagerProps {
  nurseId: string;
  nurseName: string;
  medicationRequests: any[];
  onMedicationAdministered: () => void;
}

const DailyMedicationManager: React.FC<DailyMedicationManagerProps> = ({
  nurseId,
  nurseName,
  medicationRequests,
  onMedicationAdministered,
}) => {
  const [dailyDosages, setDailyDosages] = useState<DailyDosageEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] =
    useState<DailyDosageEntry | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (medicationRequests.length > 0) {
      calculateDailyDosages();
    }
  }, [medicationRequests]);

  const calculateDailyDosages = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const dailyEntries: DailyDosageEntry[] = [];

      for (const request of medicationRequests) {
        // Fetch diary entries for this medication request
        const diaryResponse = await instance.get(
          `${BASE_API}/api/MedicaDiary/medication-request/${request.id}`
        );

        const diaryEntries: MedicationDiaryEntry[] = diaryResponse.data || [];

        // Count doses administered today
        const todayEntries = diaryEntries.filter((entry) => {
          const entryDate = parseISO(entry.createAt);
          return isToday(entryDate) && entry.status === 1; // status 1 = administered
        });

        const completedDosesToday = todayEntries.length;
        const totalDosesPerDay = request.dosage; // Assuming dosage is doses per day
        const remainingDosesToday = Math.max(
          0,
          totalDosesPerDay - completedDosesToday
        );

        // Calculate days remaining
        const startDate = parseISO(request.startDate);
        const endDate = new Date(startDate);
        // Add full numberOfDayToTake days for display
        endDate.setDate(endDate.getDate() + request.numberOfDayToTake);

        // For calculating days remaining, use the actual medication period end date (subtract 1)
        const medicationEndDate = new Date(endDate);
        medicationEndDate.setDate(medicationEndDate.getDate() - 1);
        const daysRemaining = Math.max(
          0,
          differenceInDays(medicationEndDate, today) + 1
        );

        const dailyEntry: DailyDosageEntry = {
          medicationRequestId: request.id,
          medicationName: request.medicationName,
          studentName: request.studentName,
          studentCode: request.studentCode,
          totalDosesPerDay: totalDosesPerDay,
          remainingDosesToday: remainingDosesToday,
          completedDosesToday: completedDosesToday,
          startDate: request.startDate,
          endDate: format(endDate, "yyyy-MM-dd"),
          instructions: request.instructions,
          isCompleteForToday: remainingDosesToday === 0,
          daysRemaining: daysRemaining,
        };

        dailyEntries.push(dailyEntry);
      }

      setDailyDosages(dailyEntries);
    } catch (error) {
      console.error("Error calculating daily dosages:", error);
      // toast.error("Không thể tải thông tin liều lượng hàng ngày.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdministerDose = (medication: DailyDosageEntry) => {
    setSelectedMedication(medication);
    setAdminDialogOpen(true);
  };

  const handleSubmitAdministration = async () => {
    if (!selectedMedication || !description.trim()) {
      toast.error("Vui lòng nhập mô tả");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create medication diary entry
      await instance.post(`${BASE_API}/api/MedicaDiary/create`, {
        medicationReqId: selectedMedication.medicationRequestId,
        status: 1, // 1 for administered
        description: description,
      });

      toast.success("Đã ghi nhận lần cho uống thuốc");

      // Refresh data
      await calculateDailyDosages();
      onMedicationAdministered();

      // Reset form
      setDescription("");
      setAdminDialogOpen(false);
      setSelectedMedication(null);
    } catch (error) {
      console.error("Error administering medication:", error);
      toast.error("Không thể ghi nhận thông tin cho uống thuốc.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotAdministered = async () => {
    if (!selectedMedication || !description.trim()) {
      toast.error("Vui lòng nhập lý do không cho uống thuốc");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create medication diary entry with status 0 (not administered)
      await instance.post(`${BASE_API}/api/MedicaDiary/create`, {
        medicationReqId: selectedMedication.medicationRequestId,
        status: 0, // 0 for not administered
        description: description,
      });

      toast.info("Đã ghi nhận thông tin hủy lần uống thuốc");

      // Reset form
      setDescription("");
      setAdminDialogOpen(false);
      setSelectedMedication(null);
    } catch (error) {
      console.error("Error logging not administered:", error);
      toast.error("Không thể ghi nhận thông tin hủy uống thuốc.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressColor = (remaining: number, total: number) => {
    const percentage = ((total - remaining) / total) * 100;
    if (percentage === 100) return "success";
    if (percentage >= 50) return "primary";
    return "warning";
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Quản lý liều lượng hàng ngày ({format(new Date(), "dd/MM/yyyy")})
      </Typography>

      {dailyDosages.length === 0 ? (
        <Alert severity="info">
          Hôm nay không có học sinh nào cần uống thuốc.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {dailyDosages.map((medication) => (
            <Card key={medication.medicationRequestId} elevation={2}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" component="div">
                      {medication.studentName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mã số: {medication.studentCode}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: "right" }}>
                    {medication.isCompleteForToday ? (
                      <Chip label="Hoàn thành hôm nay" color="success" />
                    ) : medication.daysRemaining === 0 ? (
                      <Chip label="Đã hết hạn" color="error" />
                    ) : (
                      <Chip
                        label={`Còn ${medication.daysRemaining} ngày`}
                        color="primary"
                      />
                    )}
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle1" gutterBottom>
                  <strong>{medication.medicationName}</strong>
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {medication.instructions}
                </Typography>

                <Box sx={{ mt: 2, mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="body2">
                      Tiến độ hôm nay: {medication.completedDosesToday}/
                      {medication.totalDosesPerDay} liều
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(
                        (medication.completedDosesToday /
                          medication.totalDosesPerDay) *
                          100
                      )}
                      %
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={
                      (medication.completedDosesToday /
                        medication.totalDosesPerDay) *
                      100
                    }
                    color={getProgressColor(
                      medication.remainingDosesToday,
                      medication.totalDosesPerDay
                    )}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Từ {format(parseISO(medication.startDate), "dd/MM/yyyy")}{" "}
                    đến {format(parseISO(medication.endDate), "dd/MM/yyyy")}
                  </Typography>

                  {!medication.isCompleteForToday &&
                    medication.daysRemaining > 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleAdministerDose(medication)}
                        size="small"
                      >
                        Cho uống thuốc
                      </Button>
                    )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Administration Dialog */}
      <Dialog
        open={adminDialogOpen}
        onClose={() => setAdminDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Cho uống thuốc - {selectedMedication?.studentName}
        </DialogTitle>
        <DialogContent>
          {selectedMedication && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Thuốc:</strong> {selectedMedication.medicationName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Chỉ dẫn:</strong> {selectedMedication.instructions}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Đã cho uống hôm nay:</strong>{" "}
                {selectedMedication.completedDosesToday}/
                {selectedMedication.totalDosesPerDay} liều
              </Typography>

              <TextField
                autoFocus
                margin="dense"
                label="Mô tả tình trạng học sinh và ghi chú"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAdminDialogOpen(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleNotAdministered}
            color="warning"
            disabled={isSubmitting}
          >
            Không cho uống
          </Button>
          <Button
            onClick={handleSubmitAdministration}
            variant="contained"
            disabled={isSubmitting || !description.trim()}
          >
            {isSubmitting ? <CircularProgress size={20} /> : "Đã cho uống"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DailyMedicationManager;
