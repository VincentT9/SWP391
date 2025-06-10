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
  Close as CloseIcon,
  Visibility as VisionIcon,
  Hearing as HearingIcon,
  Event as EventIcon,
  Notes as NotesIcon,
} from "@mui/icons-material";
import { mockHealthRecords, mockStudents } from "../../utils/mockData";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// ===== KHAI BÁO KIỂU DỮ LIỆU =====
// Định nghĩa kiểu BloodType cho nhóm máu
type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "";

// Định nghĩa kiểu cho hồ sơ sức khỏe mới
type HealthRecord = {
  id?: string;
  studentId: string;
  height: number;
  weight: number;
  bloodType?: string;
  allergies: string;
  chronicDiseases: string; // Đổi từ chronicConditions
  pastMedicalHistory: string;
  visionLeft: string;
  visionRight: string;
  hearingLeft: string;
  hearingRight: string;
  vaccinationHistory: string;
  otherNotes: string;
  lastUpdated?: Date;
};

const HealthRecordsPage = () => {
  const navigate = useNavigate();
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
  ) as HealthRecord | undefined;

  // ===== QUẢN LÝ FORM CẬP NHẬT =====
  // State lưu trữ dữ liệu đang chỉnh sửa - cập nhật theo cấu trúc mới
  const [updatedRecord, setUpdatedRecord] = useState<HealthRecord>({
    studentId: student?.id || "",
    height: 0,
    weight: 0,
    bloodType: "",
    allergies: "",
    chronicDiseases: "",
    pastMedicalHistory: "",
    visionLeft: "",
    visionRight: "",
    hearingLeft: "",
    hearingRight: "",
    vaccinationHistory: "",
    otherNotes: "",
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
        ...healthRecord,
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
          ...updatedRecord,
          lastUpdated: new Date(), // Cập nhật thời gian chỉnh sửa
        };

        // Hiển thị thông báo thành công
        toast.success("Hồ sơ sức khỏe đã được cập nhật thành công!");
      }
    }

    // Đóng dialog sau khi hoàn thành
    setUpdateDialogOpen(false);
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
                  Dị ứng
                </Typography>
              </Box>

              {/* Hiển thị thông tin dị ứng hoặc thông báo không có */}
              {healthRecord.allergies ? (
                <Box sx={{ p: 2, bgcolor: "#fff3e0", borderRadius: 1 }}>
                  <Typography variant="body1">
                    {healthRecord.allergies}
                  </Typography>
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
                  Bệnh mãn tính
                </Typography>
              </Box>

              {/* Hiển thị thông tin bệnh mãn tính hoặc thông báo không có */}
              {healthRecord.chronicDiseases ? (
                <Box sx={{ p: 2, bgcolor: "#ffebee", borderRadius: 1 }}>
                  <Typography variant="body1">
                    {healthRecord.chronicDiseases}
                  </Typography>
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

            <Divider sx={{ my: 3 }} />

            {/* ===== THỊ LỰC VÀ THÍNH LỰC ===== */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                Thị lực và thính lực
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
                    },
                  },
                }}
              >
                {/* Thị lực */}
                <Box sx={{ bgcolor: "#e3f2fd", p: 2, borderRadius: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <VisionIcon sx={{ color: "#1976d2", mr: 1 }} />
                    <Typography variant="subtitle2">Thị lực</Typography>
                  </Box>
                  <Box sx={{ ml: 4 }}>
                    <Typography variant="body2">
                      <strong>Mắt trái:</strong>{" "}
                      {healthRecord.visionLeft || "Chưa có thông tin"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Mắt phải:</strong>{" "}
                      {healthRecord.visionRight || "Chưa có thông tin"}
                    </Typography>
                  </Box>
                </Box>

                {/* Thính lực */}
                <Box sx={{ bgcolor: "#e8f5e9", p: 2, borderRadius: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <HearingIcon sx={{ color: "#4caf50", mr: 1 }} />
                    <Typography variant="subtitle2">Thính lực</Typography>
                  </Box>
                  <Box sx={{ ml: 4 }}>
                    <Typography variant="body2">
                      <strong>Tai trái:</strong>{" "}
                      {healthRecord.hearingLeft || "Chưa có thông tin"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Tai phải:</strong>{" "}
                      {healthRecord.hearingRight || "Chưa có thông tin"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* ===== LỊCH SỬ Y TẾ ===== */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventIcon sx={{ color: "#9c27b0", mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Lịch sử y tế
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Tiền sử bệnh
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f3e5f5", borderRadius: 1 }}>
                  <Typography variant="body2">
                    {healthRecord.pastMedicalHistory || "Không có thông tin"}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Lịch sử tiêm chủng
                </Typography>
                <Box sx={{ p: 2, bgcolor: "#f3e5f5", borderRadius: 1 }}>
                  <Typography variant="body2">
                    {healthRecord.vaccinationHistory || "Không có thông tin"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* ===== GHI CHÚ BỔ SUNG ===== */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <NotesIcon sx={{ color: "#4caf50", mr: 1 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  Ghi chú bổ sung
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: "#f1f8e9", borderRadius: 1 }}>
                <Typography variant="body2">
                  {healthRecord.otherNotes || "Không có ghi chú bổ sung"}
                </Typography>
              </Box>
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
              onClick={() => navigate("/health-declaration")}
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
            onClick={() => navigate("/health-declaration")}
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
                value={updatedRecord.bloodType || ""}
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

          {/* ===== PHẦN QUẢN LÝ DỊ ỨNG & BỆNH MÃN TÍNH ===== */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Dị ứng & Bệnh mãn tính
            </Typography>

            <TextField
              label="Thông tin dị ứng"
              multiline
              rows={2}
              fullWidth
              placeholder="Nhập thông tin dị ứng (VD: Tôm, cá, hải sản, phấn hoa...)"
              helperText="Liệt kê các chất gây dị ứng, ngăn cách bằng dấu phẩy"
              value={updatedRecord.allergies}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  allergies: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Bệnh mãn tính"
              multiline
              rows={2}
              fullWidth
              placeholder="Nhập thông tin bệnh mãn tính (VD: Hen suyễn, tiểu đường...)"
              helperText="Liệt kê các bệnh mãn tính, ngăn cách bằng dấu phẩy"
              value={updatedRecord.chronicDiseases}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  chronicDiseases: e.target.value,
                })
              }
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ===== PHẦN THỊ LỰC & THÍNH LỰC ===== */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Thị lực & Thính lực
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Thị lực
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                label="Thị lực mắt trái"
                fullWidth
                placeholder="VD: 10/10 hoặc 20/20"
                value={updatedRecord.visionLeft}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    visionLeft: e.target.value,
                  })
                }
              />
              <TextField
                label="Thị lực mắt phải"
                fullWidth
                placeholder="VD: 10/10 hoặc 20/20"
                value={updatedRecord.visionRight}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    visionRight: e.target.value,
                  })
                }
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Thính lực
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Thính lực tai trái"
                fullWidth
                placeholder="VD: Bình thường, Giảm nhẹ, Giảm trung bình..."
                value={updatedRecord.hearingLeft}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    hearingLeft: e.target.value,
                  })
                }
              />
              <TextField
                label="Thính lực tai phải"
                fullWidth
                placeholder="VD: Bình thường, Giảm nhẹ, Giảm trung bình..."
                value={updatedRecord.hearingRight}
                onChange={(e) =>
                  setUpdatedRecord({
                    ...updatedRecord,
                    hearingRight: e.target.value,
                  })
                }
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ===== PHẦN LỊCH SỬ Y TẾ ===== */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Lịch sử y tế
            </Typography>

            <TextField
              label="Tiền sử bệnh"
              multiline
              rows={3}
              fullWidth
              placeholder="Nhập thông tin về tiền sử bệnh tật, phẫu thuật hoặc những vấn đề sức khỏe đáng chú ý trong quá khứ"
              value={updatedRecord.pastMedicalHistory}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  pastMedicalHistory: e.target.value,
                })
              }
              sx={{ mb: 2 }}
            />

            <TextField
              label="Lịch sử tiêm chủng"
              multiline
              rows={2}
              fullWidth
              placeholder="Liệt kê các loại vaccine đã tiêm và thời gian tiêm"
              value={updatedRecord.vaccinationHistory}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  vaccinationHistory: e.target.value,
                })
              }
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ===== PHẦN GHI CHÚ BỔ SUNG ===== */}
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Ghi chú bổ sung
            </Typography>

            <TextField
              label="Ghi chú thêm"
              multiline
              rows={4}
              fullWidth
              placeholder="Thông tin bổ sung về sức khỏe của học sinh..."
              value={updatedRecord.otherNotes}
              onChange={(e) =>
                setUpdatedRecord({
                  ...updatedRecord,
                  otherNotes: e.target.value,
                })
              }
            />
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
