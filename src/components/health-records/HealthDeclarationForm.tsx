import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { HealthRecord } from "../../models/types";
import axios from "axios";

// Định nghĩa kiểu dữ liệu Student từ API
interface Student {
  id: string;
  parentId: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  class: string;
  schoolYear: string;
  image: string;
}

// Thay đổi kiểu FormData thành kiểu HealthRecord
type FormData = HealthRecord;

const HealthDeclarationForm = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy state từ navigation
  const studentFromState = location.state; // Đọc dữ liệu học sinh từ state

  // Khởi tạo state với dữ liệu từ navigation nếu có
  const [studentCode, setStudentCode] = useState(
    studentFromState?.studentCode || ""
  );
  const [studentData, setStudentData] = useState<Student | null>(
    studentFromState
      ? {
          id: studentFromState.studentId,
          parentId: "",
          studentCode: studentFromState.studentCode,
          fullName: studentFromState.studentName,
          dateOfBirth: studentFromState.dateOfBirth,
          gender: 0,
          class: studentFromState.studentClass,
          schoolYear: "",
          image: "",
        }
      : null
  );
  const [loading, setLoading] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [searchingStudent, setSearchingStudent] = useState(false);
  const [searchError, setSearchError] = useState("");
  // const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      studentId: "",
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
    },
  });

  // Cập nhật defaultValues và setValue trong useForm
  useEffect(() => {
    if (studentFromState?.studentId) {
      setValue("studentId", studentFromState.studentId);
    }
  }, []);

  const searchStudent = async () => {
    if (!studentCode.trim()) {
      setSearchError("Vui lòng nhập mã học sinh");
      return;
    }

    setSearchingStudent(true);
    setSearchError("");
    setStudentData(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/Student/get-student-by-student-code/${studentCode}`
      );
      setStudentData(response.data);

      // Cập nhật studentId cho form
      setValue("studentId", response.data.id);

      // Hiển thị thông báo thành công
      toast.success(`Đã tìm thấy học sinh: ${response.data.fullName}`);
    } catch (error) {
      console.error("Error searching for student:", error);
      setSearchError("Không tìm thấy học sinh với mã này");
      setValue("studentId", "");
    } finally {
      setSearchingStudent(false);
    }
  };

  const handleStudentCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentCode(e.target.value);
    // Reset thông tin tìm kiếm khi người dùng thay đổi mã học sinh
    if (studentData) {
      setStudentData(null);
      setValue("studentId", "");
    }
    if (searchError) {
      setSearchError("");
    }
  };

  // Cập nhật onSubmit để gọi API thực tế
  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      // Chuẩn bị dữ liệu để gửi đến API
      const healthRecordData = {
        studentId: data.studentId,
        height: data.height?.toString() || "",
        weight: data.weight?.toString() || "",
        bloodType: data.bloodType || "",
        allergies: data.allergies || "",
        chronicDiseases: data.chronicDiseases || "",
        pastMedicalHistory: data.pastMedicalHistory || "",
        visionLeft: data.visionLeft || "",
        visionRight: data.visionRight || "",
        hearingLeft: data.hearingLeft || "",
        hearingRight: data.hearingRight || "",
        vaccinationHistory: data.vaccinationHistory || "",
        otherNotes: data.otherNotes || "",
      };

      console.log("Sending health record data:", healthRecordData);

      // Lấy token từ localStorage
      const token = localStorage.getItem("authToken");
      const authUserJson = localStorage.getItem("authUser");
      let parentId = null;

      if (authUserJson) {
        const authUser = JSON.parse(authUserJson);
        parentId = authUser.id;
      }

      // Gọi API để tạo mới hồ sơ sức khỏe
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/HealthRecord/create-health-record`,
        healthRecordData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Create health record response:", response.data);

      // Sau khi tạo hồ sơ thành công, cập nhật parentId cho student
      if (studentData && parentId) {
        // Chuẩn bị dữ liệu học sinh để cập nhật
        const studentUpdateData = {
          parentId: parentId,
          studentCode: studentData.studentCode,
          fullName: studentData.fullName,
          dateOfBirth: studentData.dateOfBirth,
          gender: studentData.gender,
          class: studentData.class,
          schoolYear: studentData.schoolYear || "",
          image: studentData.image || "",
        };

        console.log("Updating student with parent ID:", studentUpdateData);

        // Gọi API để cập nhật thông tin học sinh - sử dụng update-student endpoint
        const studentResponse = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/api/Student/update-student/${studentData.id}`,
          studentUpdateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Update student response:", studentResponse.data);
      }

      toast.success("Khai báo sức khỏe thành công!");
      navigate("/health-records");
    } catch (error) {
      console.error("Submit error:", error);

      // Xử lý lỗi chi tiết
      if (axios.isAxiosError(error) && error.response) {
        const statusCode = error.response.status;
        const errorMessage =
          error.response.data?.message || "Đã xảy ra lỗi khi gửi thông tin!";

        if (statusCode === 400) {
          toast.error(`Lỗi dữ liệu: ${errorMessage}`);
        } else if (statusCode === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        } else if (statusCode === 404) {
          toast.error("Không tìm thấy học sinh này!");
        } else {
          toast.error(`Đã xảy ra lỗi: ${errorMessage}`);
        }
      } else {
        toast.error("Đã xảy ra lỗi khi gửi thông tin!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmCancel = () => {
    setOpenConfirmDialog(false);
    navigate("/health-records");
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Khai báo sức khỏe học sinh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vui lòng điền đầy đủ thông tin sức khỏe của học sinh
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, p: 3 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {/* PHẦN 1: THÔNG TIN CƠ BẢN */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#1976d2", fontWeight: "bold" }}
                >
                  Thông tin cơ bản về sức khỏe
                </Typography>

                {/* Tìm kiếm học sinh bằng studentCode */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                    Nhập mã học sinh được nhà trường cung cấp để tìm kiếm và
                    liên kết với tài khoản của bạn
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 2,
                      alignItems: { xs: "stretch", sm: "flex-start" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Mã học sinh"
                      value={studentCode}
                      onChange={handleStudentCodeChange}
                      sx={{ flex: 2 }}
                      InputProps={{
                        endAdornment: searchingStudent ? (
                          <InputAdornment position="end">
                            <CircularProgress size={20} />
                          </InputAdornment>
                        ) : null,
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={searchStudent}
                      disabled={searchingStudent || !studentCode.trim()}
                      startIcon={<SearchIcon />}
                      sx={{ height: { sm: 56 }, minWidth: 120 }}
                    >
                      Tìm kiếm
                    </Button>
                  </Box>
                </Box>

                {/* Hiển thị lỗi nếu không tìm thấy học sinh */}
                {searchError && <Alert severity="error">{searchError}</Alert>}

                {/* Hiển thị thông tin học sinh nếu tìm thấy */}
                {studentData && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "#e3f2fd",
                      border: "1px solid #90caf9",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Thông tin học sinh
                    </Typography>
                    <Typography variant="body1">
                      <strong>Họ và tên:</strong> {studentData.fullName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Mã học sinh:</strong> {studentData.studentCode}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Lớp:</strong> {studentData.class}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Năm học:</strong> {studentData.schoolYear}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Ngày sinh:</strong>{" "}
                      {new Date(studentData.dateOfBirth).toLocaleDateString(
                        "vi-VN"
                      )}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
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

                {/* ... phần còn lại của form về height và weight ... */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name="height"
                      control={control}
                      rules={{
                        required: "Chiều cao là bắt buộc",
                        min: { value: 50, message: "Chiều cao phải > 50cm" },
                        max: { value: 250, message: "Chiều cao phải ≤ 250cm" },
                        validate: {
                          notZero: (value) =>
                            value > 0 || "Chiều cao phải lớn hơn 0",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Chiều cao (cm)"
                          type="text"
                          error={!!errors.height}
                          helperText={errors.height?.message}
                          onChange={(e) => {
                            // Xử lý như trước
                            let value = e.target.value
                              .replace(/[e+-]/g, "")
                              .replace(/[^0-9]/g, "");
                            if (value === "0") value = "";
                            if (value.length > 3) value = value.slice(0, 3);
                            const numValue = parseInt(value);
                            if (numValue > 250) value = "250";
                            field.onChange(value ? Number(value) : "");
                          }}
                          InputProps={{
                            inputProps: {
                              maxLength: 3,
                              inputMode: "numeric",
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name="weight"
                      control={control}
                      rules={{
                        required: "Cân nặng là bắt buộc",
                        min: { value: 10, message: "Cân nặng phải > 10kg" },
                        max: { value: 150, message: "Cân nặng phải ≤ 150kg" },
                        validate: {
                          notZero: (value) =>
                            value > 0 || "Cân nặng phải lớn hơn 0",
                        },
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          required
                          label="Cân nặng (kg)"
                          type="text"
                          error={!!errors.weight}
                          helperText={errors.weight?.message}
                          onChange={(e) => {
                            // Xử lý như trước
                            let value = e.target.value
                              .replace(/[e+-]/g, "")
                              .replace(/[^0-9]/g, "");
                            if (value === "0") value = "";
                            if (value.length > 3) value = value.slice(0, 3);
                            const numValue = parseInt(value);
                            if (numValue > 150) value = "150";
                            field.onChange(value ? Number(value) : "");
                          }}
                          InputProps={{
                            inputProps: {
                              maxLength: 3,
                              inputMode: "numeric",
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* PHẦN 2: THÔNG TIN DỊ ỨNG VÀ BỆNH MÃN TÍNH */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#ff9800", fontWeight: "bold", mb: 3 }}
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

              <Divider sx={{ my: 4 }} />

              {/* PHẦN 3: LỊCH SỬ Y TẾ */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#f44336", fontWeight: "bold", mb: 3 }}
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
                        rows={3}
                        placeholder="Liệt kê các loại vaccine đã tiêm và thời gian tiêm"
                      />
                    )}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* PHẦN 4: ĐÁNH GIÁ THỊ LỰC VÀ THÍNH LỰC */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#9c27b0", fontWeight: "bold", mb: 3 }}
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

              <Divider sx={{ my: 4 }} />

              {/* PHẦN 5: GHI CHÚ KHÁC */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleOpenConfirmDialog}
              startIcon={<ArrowBackIcon />}
            >
              Quay lại
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !studentData}
              startIcon={<SaveIcon />}
              sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#45a049" } }}
            >
              {loading ? "Đang lưu..." : "Hoàn thành khai báo"}
            </Button>
          </Box>

          {/* Dialog xác nhận */}
          <Dialog
            open={openConfirmDialog}
            onClose={handleCloseConfirmDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                minWidth: { xs: "90%", sm: "400px" },
              },
            }}
          >
            <DialogTitle
              id="alert-dialog-title"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#f8f9fa",
                borderBottom: "1px solid #e0e0e0",
                py: 2,
              }}
            >
              <WarningIcon color="warning" />
              {"Xác nhận hủy khai báo"}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              <DialogContentText id="alert-dialog-description">
                Bạn có chắc chắn muốn hủy khai báo sức khỏe này? Tất cả thông
                tin đã nhập sẽ bị mất và không thể khôi phục.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
              <Button
                onClick={handleCloseConfirmDialog}
                variant="outlined"
                sx={{
                  borderRadius: 1,
                  textTransform: "none",
                  px: 3,
                }}
              >
                Tiếp tục chỉnh sửa
              </Button>
              <Button
                onClick={handleConfirmCancel}
                variant="contained"
                color="error"
                sx={{
                  borderRadius: 1,
                  textTransform: "none",
                  px: 3,
                }}
                autoFocus
              >
                Xác nhận hủy
              </Button>
            </DialogActions>
          </Dialog>
        </form>
      </Paper>
    </Container>
  );
};

export default HealthDeclarationForm;
