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
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import instance from "../../../utils/axiosConfig";

interface MedicationRequestFormProps {
  parentId: string;
  onRequestSubmitted: () => void;
  studentOptions: { id: string; name: string }[];
  loading: boolean;
}

const MedicationRequestForm: React.FC<MedicationRequestFormProps> = ({
  parentId,
  onRequestSubmitted,
  studentOptions,
  loading,
}) => {
  const [studentId, setStudentId] = useState("");
  const [dosesPerDay, setDosesPerDay] = useState<number>(1);
  const [daysRequired, setDaysRequired] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [notes, setNotes] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [receiptImage, setReceiptImage] = useState<File | null>(null);
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);
  const [components, setComponents] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cập nhật hàm xử lý tải lên file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setReceiptImage(file);
      setUploadingImage(true);

      // Tạo FormData để gửi ảnh
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Gọi API tải lên ảnh
        const response = await instance.post("/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Lưu URL ảnh từ response
        console.log("Image uploaded successfully:", response.data);
        setReceiptImageUrl(response.data);
        setError(null);
      } catch (error) {
        console.error("Error uploading image:", error);
        setError("Không thể tải lên hình ảnh hóa đơn. Vui lòng thử lại.");
        setReceiptImage(null);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate các trường bắt buộc
    if (
      !studentId ||
      !startDate ||
      !daysRequired ||
      !components ||
      !dosesPerDay
    ) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the request payload with image URL
      const requestData = {
        studentId: studentId,
        medicationName: components,
        dosage: dosesPerDay,
        numberOfDayToTake: daysRequired,
        instructions: notes,
        // Sử dụng URL ảnh thay vì mảng base64
        imagesMedicalInvoice: receiptImageUrl ? [receiptImageUrl] : [],
        startDate: startDate?.toISOString(),
      };

      // Make the API call
      await instance.post(
        `/api/MedicationRequest/create-medication-request`,
        requestData
      );

      // Show success message
      setOpenSnackbar(true);

      // Reset form
      setStudentId("");
      setDosesPerDay(1);
      setDaysRequired(1);
      setStartDate(new Date());
      setNotes("");
      setReceiptImage(null);
      setReceiptImageUrl(null);
      setComponents("");

      // Notify parent component
      onRequestSubmitted();
    } catch (error) {
      console.error("Error creating medication request:", error);
      setError("Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Gửi thuốc đến trường
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        Vui lòng nhập thành phần thuốc để nhà trường có thể kiểm tra.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="student-select-label">Tên học sinh *</InputLabel>
            <Select
              labelId="student-select-label"
              id="student-select"
              value={studentId}
              label="Tên học sinh *"
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              {studentOptions.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Phần thông tin thuốc */}
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

            {/* Số lần uống trong ngày - Giữ nguyên */}
            <Box sx={{ mb: 2 }}>
              <TextField
                required
                fullWidth
                id="doses-per-day"
                label="Số lần uống trong ngày"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 10 } }}
                value={dosesPerDay}
                onChange={(e) => setDosesPerDay(parseInt(e.target.value))}
                helperText="Nhập số lần uống thuốc trong ngày (1-10 lần)"
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
                disabled={uploadingImage}
              />
              <label htmlFor="receipt-upload-button">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mb: 2 }}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "Đang tải lên..." : "Tải lên hóa đơn thuốc"}
                </Button>
              </label>

              {uploadingImage && (
                <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {receiptImage && receiptImageUrl && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    Đã tải lên: {receiptImage.name}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <img
                      src={receiptImageUrl}
                      alt="Hóa đơn thuốc"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </Box>
                </Box>
              )}

              {!receiptImage && !uploadingImage && (
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

        {/* Đổi Ghi chú thành Hướng dẫn sử dụng và ghi chú */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            id="notes"
            label="Hướng dẫn sử dụng và ghi chú"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ví dụ: Uống sau bữa ăn, không nhai viên thuốc, pha với nước ấm, uống trong bữa sáng..."
            helperText="Nhập các lưu ý đặc biệt khi dùng thuốc và các thông tin bổ sung khác"
          />
        </Box>

        <Box>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Gửi yêu cầu"}
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
