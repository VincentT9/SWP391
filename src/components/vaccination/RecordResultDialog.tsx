import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  InputAdornment,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { toast } from "react-toastify";
import instance from "../../utils/axiosConfig";

interface RecordResultDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentName: string;
  scheduleDetailId: string;
  campaignType: number; // 0: Vaccination, 1: Health checkup
  studentId?: string; // Add studentId prop for consultation creation
}

const RecordResultDialog: React.FC<RecordResultDialogProps> = ({
  open,
  onClose,
  onSuccess,
  studentName,
  scheduleDetailId,
  campaignType,
  studentId,
}) => {
  // Vaccination form state
  const [vaccForm, setVaccForm] = useState({
    dosageGiven: "",
    sideEffects: "",
    notes: "",
  });

  // Health checkup form state
  type HealthFormData = {
    height: string;
    weight: string;
    visionLeftResult: string;
    visionRightResult: string;
    hearingLeftResult: string;
    hearingRightResult: string;
    bloodPressureSys: string;
    bloodPressureDia: string;
    heartRate: string;
    dentalCheckupResult: string;
    otherResults: string;
    abnormalSigns: string;
    recommendations: string;
  };

  const [healthForm, setHealthForm] = useState<HealthFormData>({
    height: "",
    weight: "",
    visionLeftResult: "",
    visionRightResult: "",
    hearingLeftResult: "",
    hearingRightResult: "",
    bloodPressureSys: "",
    bloodPressureDia: "",
    heartRate: "",
    dentalCheckupResult: "",
    otherResults: "",
    abnormalSigns: "",
    recommendations: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Add validation state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // New state for consultation feature
  const [showConsultation, setShowConsultation] = useState<boolean>(false);
  const [consultationData, setConsultationData] = useState({
    scheduledDate: new Date(),
    consultationNotes: "",
    status: 0, // Default to Scheduled (0)
  });
  const [isSubmittingConsultation, setIsSubmittingConsultation] =
    useState<boolean>(false);
  const [resultId, setResultId] = useState<string>("");

  // Handle vaccination form changes
  const handleVaccChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVaccForm((prev) => ({ ...prev, [name]: value }));
  };

  // Update the handleHealthChange function to validate inputs
  const handleHealthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Clear previous error for this field
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    // Add validation for numeric fields
    if (
      [
        "height",
        "weight",
        "bloodPressureSys",
        "bloodPressureDia",
        "heartRate",
      ].includes(name)
    ) {
      const numValue = parseFloat(value);
      // Check if value is negative or not a number
      if (value && (isNaN(numValue) || numValue < 0)) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "Giá trị không được âm",
        }));
      }
    }

    setHealthForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit vaccination results
  const handleVaccSubmit = async () => {
    try {
      setSubmitting(true);

      const payload = {
        scheduleDetailId,
        dosageGiven: vaccForm.dosageGiven,
        sideEffects: vaccForm.sideEffects,
        notes: vaccForm.notes,
      };

      const response = await instance.post(
        "/api/VaccResult/create-vacc-result",
        payload
      );

      // Store the returned ID for consultation creation
      if (response.data && response.data.id) {
        setResultId(response.data.id);
      }

      toast.success("Đã ghi nhận kết quả tiêm phòng thành công");

      // Don't close the dialog yet if there are side effects that might need consultation
      if (vaccForm.sideEffects && vaccForm.sideEffects.trim() !== "") {
        setShowConsultation(true);
      } else {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting vaccination result:", error);
      toast.error("Không thể lưu kết quả tiêm phòng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Modify handleHealthSubmit to store result ID for potential consultation
  const handleHealthSubmit = async () => {
    // Validate all numeric fields before submission
    const errors: { [key: string]: string } = {};

    // Define numeric fields with proper typing
    const numericFields: { key: keyof HealthFormData; label: string }[] = [
      { key: "height", label: "Chiều cao" },
      { key: "weight", label: "Cân nặng" },
      { key: "bloodPressureSys", label: "Huyết áp tâm thu" },
      { key: "bloodPressureDia", label: "Huyết áp tâm trương" },
      { key: "heartRate", label: "Nhịp tim" },
    ];

    // Check each numeric field with proper typing
    numericFields.forEach((field) => {
      const value = parseFloat(healthForm[field.key]);
      if (healthForm[field.key] && (isNaN(value) || value < 0)) {
        errors[field.key] = `${field.label} không được âm`;
      }
    });

    // If there are errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        scheduleDetailId,
        height: healthForm.height ? parseFloat(healthForm.height) : null,
        weight: healthForm.weight ? parseFloat(healthForm.weight) : null,
        bloodPressureSys: healthForm.bloodPressureSys
          ? parseFloat(healthForm.bloodPressureSys)
          : null,
        bloodPressureDia: healthForm.bloodPressureDia
          ? parseFloat(healthForm.bloodPressureDia)
          : null,
        heartRate: healthForm.heartRate
          ? parseFloat(healthForm.heartRate)
          : null,
        dentalCheckupResult: healthForm.dentalCheckupResult,
        otherResults: healthForm.otherResults,
      };

      const response = await instance.post(
        "/api/HealthCheckupResult/create-health-result",
        payload
      );

      // Store the returned ID for consultation creation
      if (response.data && response.data.id) {
        setResultId(response.data.id);
      }

      toast.success("Đã ghi nhận kết quả khám sức khỏe thành công");

      // Don't close the dialog if there are abnormal results that might need consultation
      const hasAbnormalResults =
        (healthForm.otherResults && healthForm.otherResults.trim() !== "") ||
        (healthForm.dentalCheckupResult &&
          healthForm.dentalCheckupResult.includes("cần điều trị")) ||
        (healthForm.bloodPressureSys &&
          parseFloat(healthForm.bloodPressureSys) > 130) ||
        (healthForm.bloodPressureDia &&
          parseFloat(healthForm.bloodPressureDia) > 80);

      if (hasAbnormalResults) {
        setShowConsultation(true);
      } else {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting health checkup result:", error);
      toast.error("Không thể lưu kết quả khám sức khỏe. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Add new function to handle consultation creation
  const handleCreateConsultation = async () => {
    try {
      setIsSubmittingConsultation(true);

      // Get current user ID (medical staff)
      const medicalStaffId = localStorage.getItem("userId");

      if (!medicalStaffId) {
        toast.error(
          "Không tìm thấy thông tin nhân viên y tế. Vui lòng đăng nhập lại."
        );
        return;
      }

      const payload = {
        healthCheckupResultId: campaignType === 1 ? resultId : null,
        vaccinationResultId: campaignType === 0 ? resultId : null,
        studentId: studentId,
        medicalStaffId: medicalStaffId,
        scheduledDate: consultationData.scheduledDate.toISOString(),
        consultationNotes: consultationData.consultationNotes,
        status: consultationData.status, // Use the selected status
      };

      await instance.post("/api/MedicalConsultation", payload);
      toast.success("Đã tạo tư vấn y khoa thành công");

      // Finally close the dialog
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating medical consultation:", error);
      toast.error("Không thể tạo tư vấn y khoa. Vui lòng thử lại.");
    } finally {
      setIsSubmittingConsultation(false);
    }
  };

  // Add handler for consultation data changes
  const handleConsultationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConsultationData({
      ...consultationData,
      [name]: value,
    });
  };

  // Add handler for date changes
  const handleConsultationDateChange = (date: Date | null) => {
    if (date) {
      setConsultationData({
        ...consultationData,
        scheduledDate: date,
      });
    }
  };

  // Add handler for consultation status changes
  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setConsultationData({
      ...consultationData,
      status: event.target.value as number,
    });
  };

  // Get current date for date picker min date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to start of day

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        id="record-result-dialog-title"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {campaignType === 0
            ? `Ghi nhận kết quả tiêm phòng - ${studentName}`
            : `Ghi nhận kết quả khám sức khỏe - ${studentName}`}
        </Typography>

        {/* Create Medical Consultation button moved to top right */}
        {!showConsultation && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowConsultation(true)}
            size="small"
          >
            Tạo tư vấn y khoa
          </Button>
        )}
      </DialogTitle>

      <DialogContent>
        {/* Show either the results form or the consultation form */}
        {!showConsultation ? (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Học sinh: <strong>{studentName}</strong>
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {campaignType === 0 ? (
              // Vaccination form
              <Box>
                <TextField
                  fullWidth
                  label="Liều lượng đã tiêm"
                  name="dosageGiven"
                  value={vaccForm.dosageGiven}
                  onChange={handleVaccChange}
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Tác dụng phụ (nếu có)"
                  name="sideEffects"
                  value={vaccForm.sideEffects}
                  onChange={handleVaccChange}
                  margin="normal"
                  multiline
                  rows={3}
                />

                <TextField
                  fullWidth
                  label="Ghi chú"
                  name="notes"
                  value={vaccForm.notes}
                  onChange={handleVaccChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Box>
            ) : (
              // Health checkup form
              <Box>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Chiều cao"
                    name="height"
                    type="number"
                    value={healthForm.height}
                    onChange={handleHealthChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">cm</InputAdornment>
                      ),
                      inputProps: { min: 0 }, // Add HTML5 validation to prevent negative inputs
                    }}
                    error={!!formErrors.height}
                    helperText={formErrors.height}
                  />

                  <TextField
                    fullWidth
                    label="Cân nặng"
                    name="weight"
                    type="number"
                    value={healthForm.weight}
                    onChange={handleHealthChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">kg</InputAdornment>
                      ),
                      inputProps: { min: 0 }, // Add HTML5 validation to prevent negative inputs
                    }}
                    error={!!formErrors.weight}
                    helperText={formErrors.weight}
                  />
                </Box>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Thị lực
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Thị lực mắt trái"
                    name="visionLeftResult"
                    value={healthForm.visionLeftResult}
                    onChange={handleHealthChange}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Thị lực mắt phải"
                    name="visionRightResult"
                    value={healthForm.visionRightResult}
                    onChange={handleHealthChange}
                    margin="normal"
                  />
                </Box>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Thính lực
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Thính lực tai trái"
                    name="hearingLeftResult"
                    value={healthForm.hearingLeftResult}
                    onChange={handleHealthChange}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    label="Thính lực tai phải"
                    name="hearingRightResult"
                    value={healthForm.hearingRightResult}
                    onChange={handleHealthChange}
                    margin="normal"
                  />
                </Box>

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Huyết áp và nhịp tim
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Huyết áp tâm thu"
                    name="bloodPressureSys"
                    type="number"
                    value={healthForm.bloodPressureSys}
                    onChange={handleHealthChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">mmHg</InputAdornment>
                      ),
                      inputProps: { min: 0 }, // Add HTML5 validation to prevent negative inputs
                    }}
                    error={!!formErrors.bloodPressureSys}
                    helperText={formErrors.bloodPressureSys}
                  />

                  <TextField
                    fullWidth
                    label="Huyết áp tâm trương"
                    name="bloodPressureDia"
                    type="number"
                    value={healthForm.bloodPressureDia}
                    onChange={handleHealthChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">mmHg</InputAdornment>
                      ),
                      inputProps: { min: 0 }, // Add HTML5 validation to prevent negative inputs
                    }}
                    error={!!formErrors.bloodPressureDia}
                    helperText={formErrors.bloodPressureDia}
                  />

                  <TextField
                    fullWidth
                    label="Nhịp tim"
                    name="heartRate"
                    type="number"
                    value={healthForm.heartRate}
                    onChange={handleHealthChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">bpm</InputAdornment>
                      ),
                      inputProps: { min: 0 }, // Add HTML5 validation to prevent negative inputs
                    }}
                    error={!!formErrors.heartRate}
                    helperText={formErrors.heartRate}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Kết quả khám răng miệng"
                  name="dentalCheckupResult"
                  value={healthForm.dentalCheckupResult}
                  onChange={handleHealthChange}
                  margin="normal"
                  multiline
                  rows={2}
                />

                <TextField
                  fullWidth
                  label="Kết quả khám khác"
                  name="otherResults"
                  value={healthForm.otherResults}
                  onChange={handleHealthChange}
                  margin="normal"
                  multiline
                  rows={2}
                />

                <TextField
                  fullWidth
                  label="Dấu hiệu bất thường"
                  name="abnormalSigns"
                  value={healthForm.abnormalSigns}
                  onChange={handleHealthChange}
                  margin="normal"
                  multiline
                  rows={2}
                />

                <TextField
                  fullWidth
                  label="Khuyến nghị"
                  name="recommendations"
                  value={healthForm.recommendations}
                  onChange={handleHealthChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Box>
            )}
          </>
        ) : (
          // Consultation form
          <Box>
            <Typography variant="h6" gutterBottom>
              Tạo tư vấn y khoa
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Tạo lịch tư vấn y khoa cho học sinh {studentName} dựa trên kết quả{" "}
              {campaignType === 0 ? "tiêm phòng" : "khám sức khỏe"}.
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ngày tư vấn"
                  value={consultationData.scheduledDate}
                  onChange={handleConsultationDateChange}
                  format="dd/MM/yyyy"
                  minDate={today} // Prevent past dates
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "normal",
                    },
                  }}
                />
              </LocalizationProvider>

              {/* Status selection dropdown */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="consultation-status-label">
                  Trạng thái
                </InputLabel>
                <Select
                  labelId="consultation-status-label"
                  value={consultationData.status}
                  label="Trạng thái"
                  onChange={handleStatusChange}
                >
                  <MenuItem value={0}>Đã lên lịch</MenuItem>
                  <MenuItem value={1}>Hoàn thành</MenuItem>
                  <MenuItem value={2}>Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Nội dung tư vấn"
              name="consultationNotes"
              multiline
              rows={4}
              value={consultationData.consultationNotes}
              onChange={handleConsultationChange}
              margin="normal"
              placeholder="Nhập nội dung cần tư vấn, chẩn đoán sơ bộ hoặc các lưu ý y tế..."
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        {!showConsultation ? (
          // Result form actions
          <>
            <Button onClick={onClose} disabled={submitting}>
              Hủy
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={
                campaignType === 0 ? handleVaccSubmit : handleHealthSubmit
              }
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={20} /> : null}
            >
              {submitting ? "Đang lưu..." : "Lưu kết quả"}
            </Button>
            {/* Remove the button from here since it's now at the top right */}
          </>
        ) : (
          // Consultation form actions
          <>
            <Button
              onClick={() => {
                onSuccess();
                onClose();
              }}
              disabled={isSubmittingConsultation}
            >
              Bỏ qua
            </Button>
            <Button
              onClick={() => setShowConsultation(false)}
              disabled={isSubmittingConsultation}
            >
              Quay lại
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateConsultation}
              disabled={isSubmittingConsultation}
              startIcon={
                isSubmittingConsultation ? <CircularProgress size={20} /> : null
              }
            >
              {isSubmittingConsultation ? "Đang tạo..." : "Tạo tư vấn"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RecordResultDialog;
