import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Lock as LockIcon,
  Upload as UploadIcon,
  HelpOutline as HelpOutlineIcon,
} from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { useAuth } from "../auth/AuthContext";
import { format } from "date-fns";
import axios from "../../utils/axiosConfig";
import PageHeader from "../common/PageHeader";

// Interface cho Student từ API
interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number; // 0: Nam, 1: Nữ, 2: Khác
  class: string;
  schoolYear: string;
  image: string | null;
  healthRecord: any | null; // Không cần hiển thị phần này
}

// Cập nhật danh sách các lớp có sẵn
const classes = ["10A1", "10A2", "11A1", "11A2", "12A1", "12A2", "12A3"];

// Cập nhật danh sách các năm học
const schoolYears = ["2023-2024", "2024-2025", "2025-2026"];

const StudentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState<string>("");

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    studentId: null as string | null,
  });

  // Thêm các states và refs
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showExcelHelp, setShowExcelHelp] = useState(false);

  // Helper function để hiển thị giới tính
  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0:
        return "Nam";
      case 1:
        return "Nữ";
      case 2:
        return "Khác";
      default:
        return "Không xác định";
    }
  };

  // Helper function để hiển thị trạng thái học sinh
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "active":
        return { label: "Đang học", color: "success" };
      case "inactive":
        return { label: "Tạm nghỉ", color: "default" };
      case "graduated":
        return { label: "Đã tốt nghiệp", color: "primary" };
      default:
        return { label: "Đang học", color: "success" };
    }
  };

  // Lấy BASE URL từ .env
  const BASE_API = process.env.REACT_APP_BASE_URL;

  // Fetch danh sách học sinh từ API
  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_API}/api/Student/get-all-students`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();


      // Xử lý data - có thể là array hoặc single object
      const studentsData = Array.isArray(data) ? data : [data];
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students:", error);
      // setError("Chưa có dữ liệu học sinh hoặc có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Chỉ fetch khi user đã được authenticate và là admin
    if (user && user.isAuthenticated && user.role?.toLowerCase() === "admin") {
      fetchStudents();
    }
  }, [user]);

  // Loading state while checking authentication
  if (authLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang kiểm tra quyền truy cập...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Check if user is authenticated
  if (!user || !user.isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6">Chưa đăng nhập</Typography>
            <Typography>Vui lòng đăng nhập để truy cập trang này.</Typography>
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            startIcon={<LockIcon />}
          >
            Đăng nhập
          </Button>
        </Box>
      </Container>
    );
  }

  // Check admin permission
  if (user.role?.toLowerCase() !== "admin") {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert
            severity="error"
            sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Typography variant="h6">Truy cập bị từ chối</Typography>
            <Typography>
              Bạn không có quyền truy cập trang quản lý học sinh. Chỉ quản trị
              viên mới có thể truy cập.
            </Typography>
          </Alert>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
            <Button variant="contained" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  // Format date function to display nicely
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const handleOpenDialog = (studentData?: Student) => {
    setSelectedStudent(studentData || null);
    if (studentData) {
      // Editing existing student
      setFormData({
        studentCode: studentData.studentCode,
        fullName: studentData.fullName,
        dateOfBirth: studentData.dateOfBirth,
        gender: studentData.gender,
        class: studentData.class,
        schoolYear: studentData.schoolYear,
      });
    } else {
      // Adding new student
      setFormData({
        studentCode: "",
        fullName: "",
        dateOfBirth: null,
        gender: 0,
        class: "",
        schoolYear: "2023-2024",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent(null);
    setFormData({});
  };

  // Cập nhật hàm handleSave để sử dụng API thực tế
  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.studentCode || !formData.fullName || !formData.class) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      const token = localStorage.getItem("authToken");

      // Nếu là cập nhật học sinh
      if (selectedStudent) {
        setLoading(true);

        // Chuẩn bị dữ liệu theo đúng định dạng API yêu cầu
        const updateData = {
          parentId: null, // Tạm thời để null
          studentCode: formData.studentCode,
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          class: formData.class,
          schoolYear: formData.schoolYear,
          image: formData.image || null,
        };

        const response = await fetch(
          `${BASE_API}/api/Student/update-student/${selectedStudent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Cập nhật dữ liệu học sinh trong state
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === selectedStudent.id
              ? { ...student, ...updateData }
              : student
          )
        );

        toast.success("Cập nhật thông tin học sinh thành công!");
      } else {
        // Phần thêm mới học sinh có thể thêm sau khi có API
        toast.info("Chức năng thêm mới đang được phát triển");
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Có lỗi xảy ra khi lưu thông tin học sinh!");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDialog({
      open: true,
      studentId: id,
    });
  };

  // Cập nhật hàm handleConfirmDelete để sử dụng API thực tế
  const handleConfirmDelete = async () => {
    if (confirmDialog.studentId) {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");

        const response = await fetch(
          `${BASE_API}/api/Student/delete-student/${confirmDialog.studentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Xóa học sinh khỏi state
        setStudents((prevStudents) =>
          prevStudents.filter(
            (student) => student.id !== confirmDialog.studentId
          )
        );

        toast.success("Xóa học sinh thành công!");
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Có lỗi xảy ra khi xóa học sinh!");
      } finally {
        setConfirmDialog({ open: false, studentId: null });
        setLoading(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, studentId: null });
  };

  // Hàm xử lý import Excel
  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      setLoading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `/api/Student/import-student-from-excel`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Overwrite Content-Type for form data
          },
        }
      );

      toast.success(response.data.message || "Import học sinh thành công!");

      // Làm mới danh sách học sinh sau khi import
      fetchStudents();
    } catch (error) {
      console.error("Error importing Excel:", error);
      toast.error(
        "Có lỗi xảy ra khi nhập dữ liệu từ Excel. Vui lòng kiểm tra lại file."
      );
    } finally {
      setLoading(false);
      // Reset file input để có thể upload lại cùng file nếu cần
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Hàm để kích hoạt click vào file input
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            
            <PageHeader 
              title="Quản lý học sinh" 
              subtitle="Quản lý thông tin học sinh trong hệ thống"
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchStudents}
            disabled={loading}
          >
            Làm mới
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Danh sách học sinh ({students.length})
                {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  onClick={triggerFileInput}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  Import Excel
                </Button>
                <IconButton
                  color="info"
                  onClick={() => setShowExcelHelp(true)}
                  size="small"
                  title="Xem hướng dẫn import"
                >
                  <HelpOutlineIcon />
                </IconButton>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept=".xlsx, .xls"
                  onChange={handleImportExcel}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#45a049" } }}
                  disabled={loading}
                >
                  Thêm học sinh
                </Button>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(41, 128, 185, 0.05)" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Mã học sinh
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Họ tên</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Giới tính</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Lớp</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Năm học</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Đang tải dữ liệu...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Không có dữ liệu học sinh
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id} hover>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {student.studentCode}
                        </TableCell>
                        <TableCell>{student.fullName}</TableCell>
                        <TableCell>{formatDate(student.dateOfBirth)}</TableCell>
                        <TableCell>{getGenderText(student.gender)}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.schoolYear}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenDialog(student)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                            title="Chỉnh sửa"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(student.id)}
                            color="error"
                            size="small"
                            title="Xóa"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog for Add/Edit Student */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedStudent
              ? "Chỉnh sửa thông tin học sinh"
              : "Thêm học sinh mới"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <TextField
                    label="Mã học sinh"
                    value={formData.studentCode || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, studentCode: e.target.value })
                    }
                    fullWidth
                    required
                    disabled={!!selectedStudent} // Disable studentId field during update
                  />
                </Box>

                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <TextField
                    label="Họ và tên"
                    value={formData.fullName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    fullWidth
                    required
                  />
                </Box>

                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Ngày sinh"
                      value={
                        formData.dateOfBirth
                          ? new Date(formData.dateOfBirth)
                          : null
                      }
                      onChange={(newDate) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: newDate ? newDate.toISOString() : null,
                        })
                      }
                      slotProps={{
                        textField: { fullWidth: true, required: true },
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <FormControl fullWidth required>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      value={formData.gender ?? 0}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      label="Giới tính"
                    >
                      <MenuItem value={0}>Nam</MenuItem>
                      <MenuItem value={1}>Nữ</MenuItem>
                      <MenuItem value={2}>Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <TextField
                    fullWidth
                    required
                    label="Lớp"
                    value={formData.class || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, class: e.target.value })
                    }
                    placeholder="Ví dụ: 12A1, 11B2, 10C3"
                    helperText="Nhập tên lớp học"
                  />
                </Box>

                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "240px" }}>
                  <TextField
                    fullWidth
                    required
                    label="Năm học"
                    value={formData.schoolYear || "2023-2024"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, schoolYear: value });
                    }}
                    placeholder="Ví dụ: 2023-2024"
                    helperText="Nhập năm học theo định dạng: YYYY-YYYY"
                    error={formData.schoolYear && !/^\d{4}-\d{4}$/.test(formData.schoolYear)}
                  />
                </Box>
              </Box>

              {selectedStudent && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Mã học sinh không thể thay đổi sau khi tạo.
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleSave} variant="contained">
              {selectedStudent ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa học sinh này?</Typography>
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              Lưu ý: Hành động này không thể hoàn tác.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Hủy</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog hướng dẫn sử dụng Excel */}
        <Dialog
          open={showExcelHelp}
          onClose={() => setShowExcelHelp(false)}
          maxWidth="md"
        >
          <DialogTitle>Hướng dẫn import học sinh từ Excel</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              File Excel cần có cấu trúc như sau:
            </Typography>
            <Box sx={{ my: 2 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên cột</TableCell>
                      <TableCell>Mô tả</TableCell>
                      <TableCell>Ví dụ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>StudentCode</TableCell>
                      <TableCell>Mã học sinh (bắt buộc)</TableCell>
                      <TableCell>STU031</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>FullName</TableCell>
                      <TableCell>Họ tên học sinh (bắt buộc)</TableCell>
                      <TableCell>Nguyễn Quốc Hưng</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>DateOfBirth</TableCell>
                      <TableCell>Ngày sinh (định dạng yyyy-MM-dd)</TableCell>
                      <TableCell>2004-08-13</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Gender</TableCell>
                      <TableCell>Giới tính (Male/Female/Other)</TableCell>
                      <TableCell>Male</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Class</TableCell>
                      <TableCell>Lớp (bắt buộc)</TableCell>
                      <TableCell>11B1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>SchoolYear</TableCell>
                      <TableCell>Năm học</TableCell>
                      <TableCell>2024-2025</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">Lưu ý:</Typography>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: "24px" }}>
                <li>File Excel phải có các cột như bảng trên (đúng tên cột)</li>
                <li>
                  Giới tính sẽ được chuyển đổi tự động (Male=0, Female=1,
                  Other=2)
                </li>
                <li>Hàng đầu tiên được xem là tiêu đề và sẽ bị bỏ qua</li>
                <li>
                  Hệ thống sẽ bỏ qua các dòng không có đủ thông tin bắt buộc
                </li>
              </ul>
            </Alert>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Mẫu file Excel:
              </Typography>
              <TableContainer
                sx={{
                  mt: 1,
                  border: "1px solid rgba(224, 224, 224, 1)",
                }}
              >
                <Table size="small">
                  <TableHead sx={{ bgcolor: "rgba(41, 128, 185, 0.05)" }}>
                    <TableRow>
                      <TableCell>StudentCode</TableCell>
                      <TableCell>FullName</TableCell>
                      <TableCell>DateOfBirth</TableCell>
                      <TableCell>Gender</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>SchoolYear</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>STU031</TableCell>
                      <TableCell>Nguyễn Quốc Hưng</TableCell>
                      <TableCell>2004-08-13</TableCell>
                      <TableCell>Male</TableCell>
                      <TableCell>11B1</TableCell>
                      <TableCell>2024-2025</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>STU032</TableCell>
                      <TableCell>Nguyễn Bình Lâm</TableCell>
                      <TableCell>2005-10-05</TableCell>
                      <TableCell>Male</TableCell>
                      <TableCell>12A3</TableCell>
                      <TableCell>2023-2024</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowExcelHelp(false)}>Đóng</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default StudentManagementPage;
