import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { Save as SaveIcon, Cancel as CancelIcon } from "@mui/icons-material";
import { HealthRecord, Student } from "../../../models/types";
import { mockStudents } from "../../../utils/mockData";

interface HealthRecordFormProps {
  studentId: string;
  initialRecord: HealthRecord | null;
  onSave: (record: HealthRecord) => void;
  onCancel: () => void;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  studentId,
  initialRecord,
  onSave,
  onCancel,
}) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HealthRecord>({
    defaultValues: {
      studentId: studentId,
      height: initialRecord?.height || 0,
      weight: initialRecord?.weight || 0,
      bloodType: initialRecord?.bloodType || "",
      allergies: initialRecord?.allergies || "",
      chronicDiseases: initialRecord?.chronicDiseases || "",
      pastMedicalHistory: initialRecord?.pastMedicalHistory || "",
      visionLeft: initialRecord?.visionLeft || "",
      visionRight: initialRecord?.visionRight || "",
      hearingLeft: initialRecord?.hearingLeft || "",
      hearingRight: initialRecord?.hearingRight || "",
      vaccinationHistory: initialRecord?.vaccinationHistory || "",
      otherNotes: initialRecord?.otherNotes || "",
    },
  });

  useEffect(() => {
    // Get student info
    const foundStudent = mockStudents.find((s) => s.id === studentId);
    if (foundStudent) {
      setStudent(foundStudent);
    }
  }, [studentId]);

  useEffect(() => {
    if (initialRecord) {
      reset({
        studentId: studentId,
        height: initialRecord.height || 0,
        weight: initialRecord.weight || 0,
        bloodType: initialRecord.bloodType || "",
        allergies: initialRecord.allergies || "",
        chronicDiseases: initialRecord.chronicDiseases || "",
        pastMedicalHistory: initialRecord.pastMedicalHistory || "",
        visionLeft: initialRecord.visionLeft || "",
        visionRight: initialRecord.visionRight || "",
        hearingLeft: initialRecord.hearingLeft || "",
        hearingRight: initialRecord.hearingRight || "",
        vaccinationHistory: initialRecord.vaccinationHistory || "",
        otherNotes: initialRecord.otherNotes || "",
      });
    }
  }, [initialRecord, reset, studentId]);

  const onSubmit = async (data: HealthRecord) => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave(data);
      toast.success("Hồ sơ sức khỏe đã được cập nhật thành công!");
    } catch (error) {
      console.error("Error saving health record:", error);
      toast.error("Không thể cập nhật hồ sơ sức khỏe!");
    } finally {
      setLoading(false);
    }
  };

  if (!student) {
    return <Typography>Không tìm thấy thông tin học sinh.</Typography>;
  }

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Cập nhật hồ sơ sức khỏe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {student.lastName} {student.firstName} - Lớp {student.class}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#1976d2", fontWeight: "bold" }}
              >
                Thông tin cơ bản
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 3,
                  mb: 3,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name="height"
                    control={control}
                    rules={{
                      min: { value: 50, message: "Chiều cao phải > 50cm" },
                      max: { value: 250, message: "Chiều cao phải ≤ 250cm" },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Chiều cao (cm)"
                        type="number"
                        error={!!errors.height}
                        helperText={errors.height?.message}
                        InputProps={{ inputProps: { min: 50, max: 250 } }}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Controller
                    name="weight"
                    control={control}
                    rules={{
                      min: { value: 10, message: "Cân nặng phải > 10kg" },
                      max: { value: 150, message: "Cân nặng phải ≤ 150kg" },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Cân nặng (kg)"
                        type="number"
                        error={!!errors.weight}
                        helperText={errors.weight?.message}
                        InputProps={{ inputProps: { min: 10, max: 150 } }}
                      />
                    )}
                  />
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Controller
                  name="bloodType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Nhóm máu</InputLabel>
                      <Select {...field} label="Nhóm máu">
                        <MenuItem value="">Chưa xác định</MenuItem>
                        <MenuItem value="A+">A+</MenuItem>
                        <MenuItem value="A-">A-</MenuItem>
                        <MenuItem value="B+">B+</MenuItem>
                        <MenuItem value="B-">B-</MenuItem>
                        <MenuItem value="AB+">AB+</MenuItem>
                        <MenuItem value="AB-">AB-</MenuItem>
                        <MenuItem value="O+">O+</MenuItem>
                        <MenuItem value="O-">O-</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* PHẦN 2: THÔNG TIN DỊ ỨNG VÀ BỆNH MÃN TÍNH */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#ff9800", fontWeight: "bold" }}
              >
                Thông tin dị ứng và bệnh mãn tính
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Thông tin dị ứng"
                      multiline
                      rows={2}
                      placeholder="Nhập thông tin dị ứng (VD: Tôm, cá, hải sản, phấn hoa...)"
                      helperText="Liệt kê các chất gây dị ứng, ngăn cách bằng dấu phẩy"
                    />
                  )}
                />

                <Controller
                  name="chronicDiseases"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Bệnh mãn tính"
                      multiline
                      rows={2}
                      placeholder="Nhập thông tin bệnh mãn tính (VD: Hen suyễn, tiểu đường...)"
                      helperText="Liệt kê các bệnh mãn tính, ngăn cách bằng dấu phẩy"
                    />
                  )}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* PHẦN 3: LỊCH SỬ Y TẾ */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#f44336", fontWeight: "bold" }}
              >
                Lịch sử y tế
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Controller
                  name="pastMedicalHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tiền sử bệnh"
                      multiline
                      rows={3}
                      placeholder="Nhập thông tin về tiền sử bệnh tật, phẫu thuật hoặc những vấn đề sức khỏe đáng chú ý trong quá khứ"
                    />
                  )}
                />

                <Controller
                  name="vaccinationHistory"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Lịch sử tiêm chủng"
                      multiline
                      rows={2}
                      placeholder="Liệt kê các loại vaccine đã tiêm và thời gian tiêm"
                    />
                  )}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* PHẦN 4: ĐÁNH GIÁ THỊ LỰC VÀ THÍNH LỰC */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#9c27b0", fontWeight: "bold" }}
              >
                Đánh giá thị lực và thính lực
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography variant="subtitle1">Thị lực</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name="visionLeft"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Thị lực mắt trái"
                          placeholder="VD: 10/10 hoặc 20/20"
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name="visionRight"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Thị lực mắt phải"
                          placeholder="VD: 10/10 hoặc 20/20"
                        />
                      )}
                    />
                  </Box>
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                  Thính lực
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name="hearingLeft"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Thính lực tai trái"
                          placeholder="VD: Bình thường, Giảm nhẹ, Giảm trung bình..."
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name="hearingRight"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Thính lực tai phải"
                          placeholder="VD: Bình thường, Giảm nhẹ, Giảm trung bình..."
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* PHẦN 5: GHI CHÚ KHÁC */}
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#4caf50", fontWeight: "bold" }}
              >
                Ghi chú khác
              </Typography>

              <Controller
                name="otherNotes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Ghi chú thêm"
                    multiline
                    rows={4}
                    placeholder="Thông tin bổ sung về sức khỏe của học sinh..."
                  />
                )}
              />
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={onCancel}
            startIcon={<CancelIcon />}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={<SaveIcon />}
          >
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default HealthRecordForm;
