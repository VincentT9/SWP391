import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Button,
  Divider,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Person as PersonIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  Bloodtype as BloodtypeIcon,
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { mockHealthRecords, mockStudents } from "../../utils/mockData";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { toast } from "react-toastify";

// ===== KHAI BÁO KIỂU DỮ LIỆU =====
// Định nghĩa kiểu BloodType cho nhóm máu
type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "";

const HealthRecordsPage = () => {
  // ===== QUẢN LÝ STATE =====
  // State cho việc chọn học sinh trên tab
  const [selectedTab, setSelectedTab] = useState(0);
  // State cho dialog cập nhật hồ sơ
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  // ===== LẤY DỮ LIỆU HỒ SƠ =====
  // Lấy thông tin học sinh được chọn
  const student = mockStudents[selectedTab];
  // Tìm hồ sơ sức khỏe tương ứng với học sinh
  const healthRecord = mockHealthRecords.find(
    (record) => record.studentId === student.id
  );

  // ===== QUẢN LÝ FORM CẬP NHẬT =====
  // State lưu trữ dữ liệu đang chỉnh sửa
  const [updatedRecord, setUpdatedRecord] = useState({
    height: 0,
    weight: 0,
    bloodType: "" as BloodType,
    allergies: [] as any[],
    chronicConditions: [] as any[],
  });

  // ===== XỬ LÝ CHUYỂN TAB HỌC SINH =====
  // Xử lý khi người dùng chuyển tab học sinh
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // ===== XỬ LÝ DIALOG CẬP NHẬT =====
  // Khởi tạo form khi mở dialog cập nhật
  const handleOpenUpdateDialog = () => {
    if (healthRecord) {
      setUpdatedRecord({
        height: healthRecord.height,
        weight: healthRecord.weight,
        bloodType: (healthRecord.bloodType || "") as BloodType,
        allergies: [...healthRecord.allergies],
        chronicConditions: [...healthRecord.chronicConditions],
      });
    }
    setUpdateDialogOpen(true);
  };

  // Đóng dialog cập nhật
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  // ===== XỬ LÝ CẬP NHẬT HỒ SƠ =====
  // Lưu dữ liệu khi người dùng xác nhận cập nhật
  const handleUpdateHealthRecord = () => {
    if (healthRecord) {
      const recordIndex = mockHealthRecords.findIndex(
        (record) => record.id === healthRecord.id
      );

      if (recordIndex !== -1) {
        // Cập nhật dữ liệu mới vào hồ sơ
        mockHealthRecords[recordIndex] = {
          ...mockHealthRecords[recordIndex],
          height: updatedRecord.height,
          weight: updatedRecord.weight,
          bloodType:
            updatedRecord.bloodType === ""
              ? undefined
              : updatedRecord.bloodType,
          allergies: updatedRecord.allergies,
          chronicConditions: updatedRecord.chronicConditions,
          lastUpdated: new Date(), // Cập nhật thời gian chỉnh sửa
        };

        // Hiển thị thông báo thành công
        toast.success("Hồ sơ sức khỏe đã được cập nhật thành công!");
      }
    }

    // Đóng dialog sau khi hoàn thành
    setUpdateDialogOpen(false);
  };

  // ===== QUẢN LÝ DỊ ỨNG =====
  // Thêm một dị ứng mới
  const handleAddAllergy = () => {
    const newAllergies = [...updatedRecord.allergies];
    newAllergies.push({
      id: `new-allergy-${Date.now()}`,
      name: "",
      severity: "mild",
      symptoms: "",
    });
    setUpdatedRecord({ ...updatedRecord, allergies: newAllergies });
  };

  // Xóa một dị ứng
  const handleRemoveAllergy = (index: number) => {
    const newAllergies = [...updatedRecord.allergies];
    newAllergies.splice(index, 1);
    setUpdatedRecord({ ...updatedRecord, allergies: newAllergies });
  };

  // Cập nhật thông tin một dị ứng
  const handleAllergyChange = (index: number, field: string, value: any) => {
    const newAllergies = [...updatedRecord.allergies];
    newAllergies[index] = { ...newAllergies[index], [field]: value };
    setUpdatedRecord({ ...updatedRecord, allergies: newAllergies });
  };

  // ===== QUẢN LÝ BỆNH MÃN TÍNH =====
  // Thêm một bệnh mãn tính mới
  const handleAddChronicCondition = () => {
    const newConditions = [...updatedRecord.chronicConditions];
    newConditions.push({
      id: `new-condition-${Date.now()}`,
      name: "",
      diagnosisDate: new Date(),
      notes: "",
    });
    setUpdatedRecord({ ...updatedRecord, chronicConditions: newConditions });
  };

  // Xóa một bệnh mãn tính
  const handleRemoveChronicCondition = (index: number) => {
    const newConditions = [...updatedRecord.chronicConditions];
    newConditions.splice(index, 1);
    setUpdatedRecord({ ...updatedRecord, chronicConditions: newConditions });
  };

  // Cập nhật thông tin một bệnh mãn tính
  const handleChronicConditionChange = (
    index: number,
    field: string,
    value: any
  ) => {
    const newConditions = [...updatedRecord.chronicConditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setUpdatedRecord({ ...updatedRecord, chronicConditions: newConditions });
  };

  // ===== HIỂN THỊ TEXT =====
  // Chuyển đổi cấp độ nghiêm trọng thành text hiển thị
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "mild":
        return "Nhẹ";
      case "moderate":
        return "Trung bình";
      case "severe":
        return "Nặng";
      default:
        return "Không xác định";
    }
  };

  return (
    <Container maxWidth="lg">
      {/* ===== HEADER TRANG ===== */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Hồ sơ sức khỏe học sinh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xem và quản lý thông tin sức khỏe của học sinh
        </Typography>
      </Box>

      {/* ===== DANH SÁCH TAB HỌC SINH ===== */}
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 500,
              textTransform: "none",
            },
          }}
        >
          {mockStudents.map((student, index) => (
            <Tab
              key={student.id}
              label={`${student.lastName} ${student.firstName} - Lớp ${student.class}`}
              sx={{ minHeight: 60 }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* ===== HIỂN THỊ HỒ SƠ SỨC KHỎE ===== */}
      {healthRecord ? (
        // Card chứa thông tin sức khỏe
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 3 }}>
            {/* ===== THÔNG TIN HỌC SINH ===== */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#1976d2", width: 56, height: 56, mr: 2 }}>
                <PersonIcon fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {student.lastName} {student.firstName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Lớp {student.class} •{" "}
                  {student.dateOfBirth.toLocaleDateString("vi-VN")}
                </Typography>
              </Box>
            </Box>

            {/* ===== CHỈ SỐ SỨC KHỎE CƠ BẢN ===== */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Chỉ số sức khỏe
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  "& > *": {
                    flex: {
                      xs: "1 1 100%",
                      sm: "1 1 calc(50% - 8px)",
                      md: "1 1 calc(25% - 12px)",
                    },
                  },
                }}
              >
                {/* Hiển thị chiều cao */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <HeightIcon sx={{ color: "#1976d2", mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Chiều cao
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {healthRecord.height} cm
                    </Typography>
                  </Box>
                </Box>

                {/* Hiển thị cân nặng */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <WeightIcon sx={{ color: "#1976d2", mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Cân nặng
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {healthRecord.weight} kg
                    </Typography>
                  </Box>
                </Box>

                {/* Hiển thị nhóm máu */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <BloodtypeIcon sx={{ color: "#d32f2f", mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Nhóm máu
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {healthRecord.bloodType || "Chưa xác định"}
                    </Typography>
                  </Box>
                </Box>

                {/* Hiển thị BMI */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 1,
                  }}
                >
                  <HospitalIcon sx={{ color: "#4caf50", mr: 1 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      BMI
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {(
                        healthRecord.weight /
                        Math.pow(healthRecord.height / 100, 2)
                      ).toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* ===== THÔNG TIN DỊ ỨNG ===== */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <WarningIcon sx={{ color: "#ff9800", mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Dị ứng ({healthRecord.allergies.length})
                </Typography>
              </Box>

              {/* Danh sách dị ứng hoặc thông báo không có */}
              {healthRecord.allergies.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {healthRecord.allergies.map((allergy) => (
                    <Typography
                      key={allergy.id}
                      variant="body2"
                      sx={{ p: 1, bgcolor: "#fff3e0", borderRadius: 1 }}
                    >
                      <strong>{allergy.name}</strong> (
                      {getSeverityText(allergy.severity)}) - {allergy.symptoms}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Không có dị ứng nào được ghi nhận
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* ===== THÔNG TIN BỆNH MÃN TÍNH ===== */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <HospitalIcon sx={{ color: "#f44336", mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Bệnh mãn tính ({healthRecord.chronicConditions.length})
                </Typography>
              </Box>

              {/* Danh sách bệnh mãn tính hoặc thông báo không có */}
              {healthRecord.chronicConditions.length > 0 ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {healthRecord.chronicConditions.map((condition) => (
                    <Typography
                      key={condition.id}
                      variant="body2"
                      sx={{ p: 1, bgcolor: "#ffebee", borderRadius: 1 }}
                    >
                      <strong>{condition.name}</strong> - {condition.notes} (từ{" "}
                      {condition.diagnosisDate.toLocaleDateString("vi-VN")})
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                  >
                    Không có bệnh mãn tính nào được ghi nhận
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        /* ===== HIỂN THỊ KHI KHÔNG CÓ HỒ SƠ ===== */
        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <HospitalIcon sx={{ fontSize: 64, color: "#bdbdbd", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy hồ sơ sức khỏe
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Hãy khai báo sức khỏe cho học sinh này
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => (window.location.href = "/health-declaration")}
            >
              Khai báo sức khỏe
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ===== CÁC NÚT HÀNH ĐỘNG ===== */}
      {healthRecord && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => (window.location.href = "/health-declaration")}
          >
            Khai báo sức khỏe mới
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenUpdateDialog}
          >
            Cập nhật hồ sơ
          </Button>
        </Box>
      )}

      {/* ===== DIALOG CẬP NHẬT HỒ SƠ ===== */}
      <Dialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        maxWidth="md"
        fullWidth
      >
        {/* Header dialog */}
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Cập nhật hồ sơ sức khỏe</Typography>
          <IconButton onClick={handleCloseUpdateDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Nội dung dialog */}
        <DialogContent dividers>
          {/* Thông tin học sinh */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Thông tin học sinh
            </Typography>
            <Typography>
              {student?.lastName} {student?.firstName} - Lớp {student?.class}
            </Typography>
          </Box>

          {/* Form cập nhật chỉ số sức khỏe cơ bản */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
              Chỉ số sức khỏe cơ bản
            </Typography>

            {/* Trường nhập chiều cao và cân nặng */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Chiều cao (cm)"
                type="number"
                value={updatedRecord.height}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    height: Number(e.target.value),
                  })
                }
                InputProps={{ inputProps: { min: 0, max: 250 } }}
                fullWidth
              />

              <TextField
                label="Cân nặng (kg)"
                type="number"
                value={updatedRecord.weight}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    weight: Number(e.target.value),
                  })
                }
                InputProps={{ inputProps: { min: 0, max: 150 } }}
                fullWidth
              />
            </Box>

            {/* Dropdown chọn nhóm máu */}
            <FormControl fullWidth>
              <InputLabel id="blood-type-label">Nhóm máu</InputLabel>
              <Select
                labelId="blood-type-label"
                value={updatedRecord.bloodType}
                label="Nhóm máu"
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    bloodType: e.target.value as BloodType,
                  })
                }
              >
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
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ===== PHẦN QUẢN LÝ DỊ ỨNG ===== */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Dị ứng
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddAllergy}
                variant="outlined"
                size="small"
              >
                Thêm dị ứng
              </Button>
            </Box>

            {/* Hiển thị khi không có dị ứng */}
            {updatedRecord.allergies.length === 0 && (
              <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                Không có dị ứng nào được ghi nhận
              </Typography>
            )}

            {/* Form nhập thông tin dị ứng */}
            {updatedRecord.allergies.map((allergy, index) => (
              <Box
                key={allergy.id || index}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "#f9f9f9",
                  borderRadius: 1,
                  position: "relative",
                }}
              >
                {/* Nút xóa dị ứng */}
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleRemoveAllergy(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                {/* Nhập tên dị ứng */}
                <TextField
                  label="Tên dị ứng"
                  value={allergy.name}
                  onChange={(e) =>
                    handleAllergyChange(index, "name", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  size="small"
                />

                {/* Nhập mức độ và triệu chứng */}
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Mức độ</InputLabel>
                    <Select
                      value={allergy.severity}
                      label="Mức độ"
                      onChange={(e) =>
                        handleAllergyChange(index, "severity", e.target.value)
                      }
                    >
                      <MenuItem value="mild">Nhẹ</MenuItem>
                      <MenuItem value="moderate">Trung bình</MenuItem>
                      <MenuItem value="severe">Nặng</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Triệu chứng"
                    value={allergy.symptoms}
                    onChange={(e) =>
                      handleAllergyChange(index, "symptoms", e.target.value)
                    }
                    fullWidth
                    size="small"
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ===== PHẦN QUẢN LÝ BỆNH MÃN TÍNH ===== */}
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Bệnh mãn tính
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddChronicCondition}
                variant="outlined"
                size="small"
              >
                Thêm bệnh mãn tính
              </Button>
            </Box>

            {/* Hiển thị khi không có bệnh mãn tính */}
            {updatedRecord.chronicConditions.length === 0 && (
              <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                Không có bệnh mãn tính nào được ghi nhận
              </Typography>
            )}

            {/* Form nhập thông tin bệnh mãn tính */}
            {updatedRecord.chronicConditions.map((condition, index) => (
              <Box
                key={condition.id || index}
                sx={{
                  mb: 2,
                  p: 2,
                  bgcolor: "#f9f9f9",
                  borderRadius: 1,
                  position: "relative",
                }}
              >
                {/* Nút xóa bệnh mãn tính */}
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 8, right: 8 }}
                  onClick={() => handleRemoveChronicCondition(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                {/* Nhập tên bệnh */}
                <TextField
                  label="Tên bệnh"
                  value={condition.name}
                  onChange={(e) =>
                    handleChronicConditionChange(index, "name", e.target.value)
                  }
                  fullWidth
                  margin="normal"
                  size="small"
                />

                {/* Nhập ngày chẩn đoán và ghi chú */}
                <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày chẩn đoán"
                      value={condition.diagnosisDate}
                      onChange={(date) =>
                        handleChronicConditionChange(
                          index,
                          "diagnosisDate",
                          date
                        )
                      }
                      slotProps={{
                        textField: { fullWidth: true, size: "small" },
                      }}
                    />
                  </LocalizationProvider>

                  <TextField
                    label="Ghi chú"
                    value={condition.notes}
                    onChange={(e) =>
                      handleChronicConditionChange(
                        index,
                        "notes",
                        e.target.value
                      )
                    }
                    fullWidth
                    size="small"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>

        {/* ===== PHẦN NÚT HÀNH ĐỘNG DIALOG ===== */}
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseUpdateDialog} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleUpdateHealthRecord}
            variant="contained"
            color="primary"
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HealthRecordsPage;
