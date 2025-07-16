import React, { useState, useCallback, useEffect } from "react";
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

  const [submitting, setSubmitting] = useState(false); // Add validation state
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

    // Clear previous error for this field
    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    setVaccForm((prev) => ({ ...prev, [name]: value }));

    // Validate form after changes
    validateVaccinationForm();
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

      // Specific validations for height and weight
      if (name === "height" && value) {
        if (numValue < 50) {
          setFormErrors((prev) => ({
            ...prev,
            [name]: "Chiều cao quá thấp (tối thiểu 50cm)",
          }));
        } else if (numValue > 250) {
          setFormErrors((prev) => ({
            ...prev,
            [name]: "Chiều cao quá cao (tối đa 250cm)",
          }));
        }
      }

      if (name === "weight" && value) {
        if (numValue < 10) {
          setFormErrors((prev) => ({
            ...prev,
            [name]: "Cân nặng quá thấp (tối thiểu 10kg)",
          }));
        } else if (numValue > 200) {
          setFormErrors((prev) => ({
            ...prev,
            [name]: "Cân nặng quá cao (tối đa 200kg)",
          }));
        }
      }
    }

    setHealthForm((prev) => ({ ...prev, [name]: value }));

    // Trigger validation after value change
    if (campaignType === 0) {
      validateVaccinationForm();
    } else {
      validateHealthForm();
    }
  };
  // Submit vaccination results
  const handleVaccSubmit = async () => {
    // Validate form before submission
    if (!validateVaccinationForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      markAllRequiredFields();
      return;
    }

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
  }; // Modify handleHealthSubmit to store result ID for potential consultation
  const handleHealthSubmit = async () => {
    // First perform a full validation of the form
    if (!validateHealthForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      markAllRequiredFields();
      return;
    }

    // Kiểm tra scheduleDetailId
    if (!scheduleDetailId) {
      console.error("Missing scheduleDetailId:", scheduleDetailId);
      toast.error(
        "Lỗi: Thiếu thông tin lịch khám. Vui lòng thử làm mới trang."
      );
      return;
    }

    try {
      setSubmitting(true);

      // Chuyển đổi đúng định dạng và kiểm tra dữ liệu trước khi gửi
      const payload = {
        scheduleDetailId,
        height:
          healthForm.height && healthForm.height.trim() !== ""
            ? parseFloat(healthForm.height)
            : null,
        weight:
          healthForm.weight && healthForm.weight.trim() !== ""
            ? parseFloat(healthForm.weight)
            : null,
        visionLeftResult: healthForm.visionLeftResult || "",
        visionRightResult: healthForm.visionRightResult || "",
        hearingLeftResult: healthForm.hearingLeftResult || "",
        hearingRightResult: healthForm.hearingRightResult || "",
        bloodPressureSys:
          healthForm.bloodPressureSys &&
          healthForm.bloodPressureSys.trim() !== ""
            ? parseFloat(healthForm.bloodPressureSys)
            : null,
        bloodPressureDia:
          healthForm.bloodPressureDia &&
          healthForm.bloodPressureDia.trim() !== ""
            ? parseFloat(healthForm.bloodPressureDia)
            : null,
        heartRate:
          healthForm.heartRate && healthForm.heartRate.trim() !== ""
            ? parseFloat(healthForm.heartRate)
            : null,
        dentalCheckupResult: healthForm.dentalCheckupResult || "",
        otherResults: healthForm.otherResults || "",
        abnormalSigns: healthForm.abnormalSigns || "",
        recommendations: healthForm.recommendations || "",
      };

      // Log payload trước khi gửi để debug
      console.log("Sending payload to API:", JSON.stringify(payload));

      // Kiểm tra lại dữ liệu payload một lần nữa
      if (
        payload.scheduleDetailId === null ||
        payload.scheduleDetailId === undefined
      ) {
        throw new Error("Missing scheduleDetailId in payload");
      }

      // Kiểm tra các trường số có đúng định dạng không
      const numericFields = [
        "height",
        "weight",
        "bloodPressureSys",
        "bloodPressureDia",
        "heartRate",
      ];
      for (const field of numericFields) {
        if (
          payload[field as keyof typeof payload] !== null &&
          (typeof payload[field as keyof typeof payload] !== "number" ||
            isNaN(payload[field as keyof typeof payload] as number))
        ) {
          throw new Error(`Invalid numeric value for ${field}`);
        }
      }

      // Gọi API với timeout dài hơn để xử lý các vấn đề mạng
      const response = await instance.post(
        "/api/HealthCheckupResult",
        payload,
        {
          timeout: 15000, // Tăng timeout lên 15 giây
        }
      );

      // Log response nhận về
      console.log("API response received:", response);

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
    } catch (error: any) {
      console.error("Error submitting health checkup result:", error);

      // Hiển thị thông báo lỗi chi tiết hơn
      let errorMessage = "Không thể lưu kết quả khám sức khỏe. ";

      if (error.response) {
        // Server trả về response với mã lỗi
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        if (error.response.status === 500) {
          errorMessage += "Đã thực hiện ghi nhận kết quả";

          // Log thêm chi tiết nếu có
          if (error.response.data) {
            console.error(
              "Error details:",
              JSON.stringify(error.response.data)
            );
          }
        } else if (error.response.data && error.response.data.message) {
          errorMessage += error.response.data.message;
        } else if (
          error.response.data &&
          typeof error.response.data === "string"
        ) {
          errorMessage += error.response.data;
        } else {
          errorMessage += `Lỗi: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request đã được gửi nhưng không nhận được response
        console.error("No response received:", error.request);
        errorMessage +=
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng.";
      } else {
        // Có lỗi khi thiết lập request
        console.error("Error message:", error.message);
        errorMessage += error.message || "Lỗi không xác định.";
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Add new function to handle consultation creation
  const handleCreateConsultation = async () => {
    try {
      setIsSubmittingConsultation(true);

      // Get current user ID (medical staff) from authUser JSON object
      const authUserStr = localStorage.getItem("authUser");
      let medicalStaffId = null;

      if (authUserStr) {
        try {
          const authUser = JSON.parse(authUserStr);
          medicalStaffId = authUser.id;
        } catch (parseError) {
          console.error("Error parsing authUser:", parseError);
        }
      }

      if (!medicalStaffId) {
        toast.error(
          "Không tìm thấy thông tin nhân viên y tế. Vui lòng đăng nhập lại."
        );
        return;
      }

      // Kiểm tra resultId và đảm bảo nó là null nếu rỗng
      const validResultId =
        resultId && resultId.trim() !== "" ? resultId : null;

      const payload = {
        healthCheckupResultId: campaignType === 1 ? validResultId : null,
        vaccinationResultId: campaignType === 0 ? validResultId : null,
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
  }; // Validate vaccination form
  const validateVaccinationForm = useCallback(() => {
    // Check if the required dosage field is filled
    const missingFields: { [key: string]: string } = {};

    if (!vaccForm.dosageGiven || vaccForm.dosageGiven.trim() === "") {
      missingFields.dosageGiven = "Liều lượng đã tiêm là trường bắt buộc";
    }

    // Update form errors with missing required fields
    if (Object.keys(missingFields).length > 0) {
      setFormErrors((prev) => ({
        ...prev,
        ...missingFields,
      }));
      return false;
    }

    return true;
  }, [vaccForm.dosageGiven]); // Validate health checkup form
  const validateHealthForm = useCallback(() => {
    // Define required fields - adjust as needed based on your requirements
    const required = [
      "height",
      "weight",
      "bloodPressureSys",
      "bloodPressureDia",
      "heartRate",
    ];

    // Store current errors
    const currentErrors: { [key: string]: string } = {};

    // Kiểm tra các trường bắt buộc
    required.forEach((field) => {
      const value = healthForm[field as keyof HealthFormData];
      if (!value || value.trim() === "") {
        currentErrors[field] = `Trường này là bắt buộc`;
      }
    });

    // Validate numeric fields with better type checking and reasonable value ranges
    if (healthForm.height && healthForm.height.trim() !== "") {
      const heightValue = parseFloat(healthForm.height);
      if (isNaN(heightValue)) {
        currentErrors.height = "Chiều cao phải là số";
      } else if (heightValue < 30) {
        currentErrors.height = "Chiều cao quá thấp (tối thiểu 30cm)";
      } else if (heightValue > 250) {
        currentErrors.height = "Chiều cao quá cao (tối đa 250cm)";
      }
    }

    if (healthForm.weight && healthForm.weight.trim() !== "") {
      const weightValue = parseFloat(healthForm.weight);
      if (isNaN(weightValue)) {
        currentErrors.weight = "Cân nặng phải là số";
      } else if (weightValue < 2) {
        currentErrors.weight = "Cân nặng quá thấp (tối thiểu 2kg)";
      } else if (weightValue > 200) {
        currentErrors.weight = "Cân nặng quá cao (tối đa 200kg)";
      }
    }

    // Validate blood pressure and heart rate
    if (
      healthForm.bloodPressureSys &&
      healthForm.bloodPressureSys.trim() !== ""
    ) {
      const bpSys = parseFloat(healthForm.bloodPressureSys);
      if (isNaN(bpSys)) {
        currentErrors.bloodPressureSys = "Huyết áp tâm thu phải là số";
      } else if (bpSys < 50 || bpSys > 250) {
        currentErrors.bloodPressureSys =
          "Huyết áp tâm thu không hợp lệ (50-250 mmHg)";
      }
    }

    if (
      healthForm.bloodPressureDia &&
      healthForm.bloodPressureDia.trim() !== ""
    ) {
      const bpDia = parseFloat(healthForm.bloodPressureDia);
      if (isNaN(bpDia)) {
        currentErrors.bloodPressureDia = "Huyết áp tâm trương phải là số";
      } else if (bpDia < 30 || bpDia > 150) {
        currentErrors.bloodPressureDia =
          "Huyết áp tâm trương không hợp lệ (30-150 mmHg)";
      }
    }

    if (healthForm.heartRate && healthForm.heartRate.trim() !== "") {
      const hr = parseFloat(healthForm.heartRate);
      if (isNaN(hr)) {
        currentErrors.heartRate = "Nhịp tim phải là số";
      } else if (hr < 30 || hr > 250) {
        currentErrors.heartRate = "Nhịp tim không hợp lệ (30-250 nhịp/phút)";
      }
    }

    // Update form errors with all current errors
    setFormErrors(currentErrors);

    // Check if all required fields are filled and no errors exist
    const allRequiredFilled = required.every(
      (field) =>
        healthForm[field as keyof HealthFormData] &&
        healthForm[field as keyof HealthFormData].trim() !== ""
    );

    const hasNoErrors = Object.keys(currentErrors).length === 0;

    return allRequiredFilled && hasNoErrors;
  }, [healthForm]);
  // Thêm useEffect để reset form errors khi component được mở
  useEffect(() => {
    if (open) {
      // Reset form errors khi mở form
      setFormErrors({});
    }
  }, [open]);

  // Get current date for date picker min date
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to start of day

  // Thêm hàm đánh dấu tất cả các trường bắt buộc
  const markAllRequiredFields = () => {
    if (campaignType === 0) {
      // Đánh dấu các trường bắt buộc cho form tiêm chủng
      const missingFields: { [key: string]: string } = {};

      if (!vaccForm.dosageGiven || vaccForm.dosageGiven.trim() === "") {
        missingFields.dosageGiven = "Liều lượng đã tiêm là trường bắt buộc";
      }

      if (Object.keys(missingFields).length > 0) {
        setFormErrors((prev) => ({
          ...prev,
          ...missingFields,
        }));
      }
    } else {
      // Đánh dấu các trường bắt buộc cho form khám sức khỏe
      const required = [
        "height",
        "weight",
        "bloodPressureSys",
        "bloodPressureDia",
        "heartRate",
      ];

      const missingFields: { [key: string]: string } = {};

      required.forEach((field) => {
        const value = healthForm[field as keyof HealthFormData];
        if (!value || value.trim() === "") {
          missingFields[field] = `Trường này là bắt buộc`;
        }
      });

      if (Object.keys(missingFields).length > 0) {
        setFormErrors((prev) => ({
          ...prev,
          ...missingFields,
        }));
      }
    }
  };

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
                {" "}
                <TextField
                  fullWidth
                  label="Liều lượng đã tiêm"
                  name="dosageGiven"
                  value={vaccForm.dosageGiven}
                  onChange={handleVaccChange}
                  margin="normal"
                  required
                  error={!!formErrors.dosageGiven}
                  helperText={formErrors.dosageGiven}
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
            </Button>{" "}
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
