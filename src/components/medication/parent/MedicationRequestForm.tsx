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
  Divider,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addDays } from "date-fns";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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

  // Loại bỏ state medicationInfoType và giữ lại các state khác
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [components, setComponents] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate các trường bắt buộc
    if (
      !studentId ||
      !startDate ||
      !daysRequired ||
      !components ||
      !dosage ||
      !instructions
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
      hasReceipt: receiptImage !== null,
      components,
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
    setReceiptImage(null);
    setComponents("");

    // Notify parent component
    onRequestSubmitted();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptImage(e.target.files[0]);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gửi thuốc đến trường
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Vui lòng nhập thành phần thuốc để nhà trường có thể kiểm tra.
      </Alert>

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

        {/* Phần thông tin thuốc - bỏ RadioGroup, giữ lại phần nhập thông tin thuốc */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Thông tin thuốc
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {/* Phần nhập thành phần thuốc */}
          <Box sx={{ mt: 2, mb: 2 }}>
            {/* Thành phần thuốc */}
            <Box sx={{ mb: 2 }}>
              <TextField
                required
                fullWidth
                id="medication-components"
                label="Tên thuốc và thành phần"
                multiline
                rows={4}
                value={components}
                onChange={(e) => setComponents(e.target.value)}
                placeholder={`Ví dụ:
1. Panadol Extra: Paracetamol 500mg, Caffeine 65mg
2. Vitamin C DHG: Acid ascorbic 500mg
3. Thuốc ho Bảo Thanh: Cao khô lá thuốc, Bạc hà 10mg`}
                helperText={`Liệt kê tất cả các loại thuốc và thành phần chính. Mỗi thuốc ghi rõ tên và thành phần trên một dòng riêng.`}
              />
            </Box>

            {/* Liều lượng */}
            <Box sx={{ mb: 2 }}>
              <TextField
                required
                fullWidth
                id="dosage"
                label="Liều lượng và cách dùng"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Ví dụ: 1 viên sáng, 1 viên chiều; 5ml x 3 lần/ngày"
                helperText="Ghi rõ số lượng và tần suất sử dụng thuốc"
              />
            </Box>

            {/* Hướng dẫn sử dụng */}
            <Box sx={{ mb: 2 }}>
              <TextField
                required
                fullWidth
                id="instructions"
                label="Hướng dẫn sử dụng"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Ví dụ: Uống sau bữa ăn, không nhai viên thuốc, pha với nước ấm"
                helperText="Các lưu ý đặc biệt khi dùng thuốc cho con bạn"
              />
            </Box>
          </Box>

          {/* Phần chụp hóa đơn thuốc (Optional) */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Chụp hóa đơn thuốc (Tùy chọn)
            </Typography>

            <Box
              sx={{
                mt: 1,
                mb: 2,
                border: "1px dashed #ccc",
                p: 3,
                borderRadius: 1,
                textAlign: "center",
              }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="receipt-upload-button"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="receipt-upload-button">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                >
                  Tải lên hóa đơn thuốc
                </Button>
              </label>

              {receiptImage && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Đã chọn: {receiptImage.name}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={URL.createObjectURL(receiptImage)}
                      alt="Hóa đơn thuốc"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </Box>
                </Box>
              )}

              {!receiptImage && (
                <Typography variant="body2" color="textSecondary">
                  Bạn có thể chụp thêm hóa đơn thuốc để nhà trường tham khảo
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Thông tin thời gian */}
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
