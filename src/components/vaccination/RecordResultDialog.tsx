import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Divider,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import instance from "../../utils/axiosConfig";

interface RecordResultDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentName: string;
  scheduleDetailId: string;
  campaignType: number; // 0 for vaccination, 1 for health checkup
}

const RecordResultDialog: React.FC<RecordResultDialogProps> = ({
  open,
  onClose,
  onSuccess,
  studentName,
  scheduleDetailId,
  campaignType,
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

      await instance.post("/api/VaccResult/create-vacc-result", payload);

      toast.success("Đã ghi nhận kết quả tiêm phòng thành công");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting vaccination result:", error);
      toast.error("Không thể lưu kết quả tiêm phòng. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Modify the health submit function to include validation
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
        height: parseFloat(healthForm.height) || 0,
        weight: parseFloat(healthForm.weight) || 0,
        visionLeftResult: healthForm.visionLeftResult,
        visionRightResult: healthForm.visionRightResult,
        hearingLeftResult: healthForm.hearingLeftResult,
        hearingRightResult: healthForm.hearingRightResult,
        bloodPressureSys: parseInt(healthForm.bloodPressureSys) || 0,
        bloodPressureDia: parseInt(healthForm.bloodPressureDia) || 0,
        heartRate: parseInt(healthForm.heartRate) || 0,
        dentalCheckupResult: healthForm.dentalCheckupResult,
        otherResults: healthForm.otherResults,
        abnormalSigns: healthForm.abnormalSigns,
        recommendations: healthForm.recommendations,
      };

      await instance.post("/api/HealthCheckupResult", payload);

      toast.success("Đã ghi nhận kết quả khám sức khỏe thành công");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error submitting health checkup result:", error);
      toast.error("Không thể lưu kết quả khám sức khỏe. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {campaignType === 0
          ? "Ghi nhận kết quả tiêm phòng"
          : "Ghi nhận kết quả khám sức khỏe"}
      </DialogTitle>

      <DialogContent>
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={campaignType === 0 ? handleVaccSubmit : handleHealthSubmit}
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} /> : "Lưu kết quả"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordResultDialog;
