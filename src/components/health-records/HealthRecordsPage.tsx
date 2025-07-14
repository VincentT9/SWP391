import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
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
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InfoIcon from "@mui/icons-material/Info";
import instance from "../../utils/axiosConfig";

// ===== KHAI BÁO KIỂU DỮ LIỆU =====
// Định nghĩa kiểu BloodType cho nhóm máu
type BloodType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | "";

// Định nghĩa kiểu API Health Record
interface ApiHealthRecord {
  id: string;
  height?: string | number;
  weight?: string | number;
  bloodType?: string;
  allergies: string;
  chronicDiseases: string;
  pastMedicalHistory: string;
  visionLeft: string;
  visionRight: string;
  hearingLeft: string;
  hearingRight: string;
  vaccinationHistory: string;
  otherNotes: string;
}

// Định nghĩa kiểu API Student
interface ApiStudent {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  class: string;
  schoolYear: string;
  image: string;
  healthRecord: ApiHealthRecord | null;
}

// Định nghĩa kiểu API User
interface ApiUser {
  id: string;
  username: string;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  userRole: number | string;
  image: string | null;
  students: ApiStudent[];
}

// Định nghĩa kiểu cho hồ sơ sức khỏe mới (giữ lại để tương thích với code hiện tại)
type HealthRecord = {
  id?: string;
  studentId: string;
  height: number;
  weight: number;
  bloodType?: string;
  allergies: string;
  chronicDiseases: string;
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
  // State cho API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [students, setStudents] = useState<ApiStudent[]>([]);

  // State cho việc chọn học sinh trên tab
  const [selectedTab, setSelectedTab] = useState(0);
  // State cho dialog cập nhật hồ sơ
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  // ===== FETCH DATA FROM API =====
  // Extract fetchData outside useEffect to make it available throughout the component
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy token từ localStorage
      const token = localStorage.getItem("authToken");

      // Lấy thông tin user từ localStorage
      const authUserJson = localStorage.getItem("authUser");
      if (!authUserJson) {
        setError(
          "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
        );
        setLoading(false);
        return;
      }

      try {
        const authUser = JSON.parse(authUserJson);
        const userId = authUser.id;


        if (!userId) {
          setError(
            "Thông tin người dùng không hợp lệ. Vui lòng đăng nhập lại."
          );
          setLoading(false);
          return;
        }

        // Gọi API lấy thông tin user theo ID thay vì lấy tất cả users
        const response = await instance.get(
          `/api/User/get-user-by-id/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        // Không cần tìm user nữa vì API đã trả về đúng user cần
        const parentUser = response.data;

        // Kiểm tra xem user có phải là parent không
        if (
          !(
            parentUser.userRole === 1 ||
            parentUser.userRole === "Parent" ||
            parentUser.userRole === "parent"
          )
        ) {
          setError(
            "Tài khoản của bạn không phải là tài khoản phụ huynh. Vui lòng đăng nhập với tài khoản phụ huynh."
          );
          setLoading(false);
          return;
        }

        setCurrentUser(parentUser);

        if (parentUser.students && parentUser.students.length > 0) {

          // Fix forEach parameters
          parentUser.students.forEach((student: ApiStudent, index: number) => {
          });

          // Đảm bảo healthRecord có đủ trường
          const processedStudents = parentUser.students.map(
            (student: ApiStudent) => ({
              ...student,
              healthRecord: student.healthRecord
                ? {
                    ...student.healthRecord,
                    // Đảm bảo các trường cần thiết có giá trị
                    id: student.healthRecord.id || "",
                    height: student.healthRecord.height || "",
                    weight: student.healthRecord.weight || "",
                    bloodType: student.healthRecord.bloodType || "",
                    allergies: student.healthRecord.allergies || "",
                    chronicDiseases: student.healthRecord.chronicDiseases || "",
                    pastMedicalHistory:
                      student.healthRecord.pastMedicalHistory || "",
                    visionLeft: student.healthRecord.visionLeft || "",
                    visionRight: student.healthRecord.visionRight || "",
                    hearingLeft: student.healthRecord.hearingLeft || "",
                    hearingRight: student.healthRecord.hearingRight || "",
                    vaccinationHistory:
                      student.healthRecord.vaccinationHistory || "",
                    otherNotes: student.healthRecord.otherNotes || "",
                  }
                : null,
            })
          );

          setStudents(processedStudents);
        } else {
          setStudents([]);
        }
      } catch (error) {
        console.error("Error processing user data:", error);
        // setError("Lỗi xử lý thông tin người dùng. Vui lòng đăng nhập lại.");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      // setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Use the extracted fetchData function inside useEffect
  useEffect(() => {
    fetchData();
  }, []);

  // ===== LẤY DỮ LIỆU HỒ SƠ =====
  // Lấy thông tin học sinh được chọn
  const selectedStudent = students.length > 0 ? students[selectedTab] : null;
  // Lấy hồ sơ sức khỏe của học sinh đã chọn
  const healthRecord = selectedStudent?.healthRecord || null;

  // ===== QUẢN LÝ FORM CẬP NHẬT =====
  // State lưu trữ dữ liệu đang chỉnh sửa - cập nhật theo cấu trúc mới
  const [updatedRecord, setUpdatedRecord] = useState<ApiHealthRecord | null>(
    null
  );

  useEffect(() => {
    // Cập nhật updatedRecord khi healthRecord thay đổi
    if (healthRecord) {
      setUpdatedRecord({
        ...healthRecord,
      });
    } else if (selectedStudent) {
      // Khởi tạo record mới nếu không có healthRecord
      setUpdatedRecord({
        id: "",
        height: "",
        weight: "",
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
    }
  }, [healthRecord, selectedStudent]);

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
    } else if (selectedStudent) {
      // Khởi tạo record mới nếu không có healthRecord
      setUpdatedRecord({
        id: "",
        height: "",
        weight: "",
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
    }
    setUpdateDialogOpen(true);
  };

  // Đóng dialog cập nhật
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  // ===== XỬ LÝ CẬP NHẬT HỒ SƠ =====
  // Lưu dữ liệu khi người dùng xác nhận cập nhật
  const handleUpdateHealthRecord = async () => {
    if (!selectedStudent || !updatedRecord) return;

    try {
      setLoading(true);

      // Lấy thông tin auth một lần ở đầu hàm
      const token = localStorage.getItem("authToken");
      const authUserJson = localStorage.getItem("authUser");
      let parentId = null;

      if (authUserJson) {
        const authUser = JSON.parse(authUserJson);
        parentId = authUser.id;
      }

      // Chuẩn bị dữ liệu để gửi đến API
      const healthRecordData = {
        studentId: selectedStudent.id,
        height: updatedRecord.height?.toString() || "",
        weight: updatedRecord.weight?.toString() || "",
        bloodType: updatedRecord.bloodType || "",
        allergies: updatedRecord.allergies || "",
        chronicDiseases: updatedRecord.chronicDiseases || "",
        pastMedicalHistory: updatedRecord.pastMedicalHistory || "",
        visionLeft: updatedRecord.visionLeft || "",
        visionRight: updatedRecord.visionRight || "",
        hearingLeft: updatedRecord.hearingLeft || "",
        hearingRight: updatedRecord.hearingRight || "",
        vaccinationHistory: updatedRecord.vaccinationHistory || "",
        otherNotes: updatedRecord.otherNotes || "",
      };



      let response;
      if (healthRecord && healthRecord.id) {
        // Cập nhật hồ sơ hiện có
        response = await instance.put(
          `/api/HealthRecord/update-health-record/${healthRecord.id}`,
          healthRecordData
        );

      } else {
        // Tạo mới hồ sơ
        response = await instance.post(
          `/api/HealthRecord/create-health-record`,
          healthRecordData
        );


        // Nếu đang tạo hồ sơ mới và có parentId, cập nhật parentId cho student đã có sẵn
        if (parentId && selectedStudent) {
          try {
            // Giữ nguyên thông tin học sinh, chỉ cập nhật parentId
            const studentUpdateData = {
              parentId: parentId,
              studentCode: selectedStudent.studentCode,
              fullName: selectedStudent.fullName,
              dateOfBirth: selectedStudent.dateOfBirth,
              gender: selectedStudent.gender,
              class: selectedStudent.class,
              schoolYear: selectedStudent.schoolYear || "",
              image: selectedStudent.image || "",
            };

            // Sử dụng API update-student để cập nhật liên kết, không tạo mới học sinh
            const studentResponse = await instance.put(
              `/api/Student/update-student/${selectedStudent.id}`,
              studentUpdateData
            );


            toast.success("Đã liên kết học sinh với tài khoản của bạn");
          } catch (updateError) {
            console.error("Lỗi khi cập nhật liên kết học sinh:", updateError);
            toast.warning(
              "Hồ sơ sức khỏe đã được tạo nhưng có vấn đề khi liên kết với phụ huynh"
            );
          }
        }
      }

      // Sau khi cập nhật thành công, cập nhật lại danh sách học sinh
      // Tải lại dữ liệu từ API
      const refreshResponse = await instance.get(`/api/User/get-all-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Sử dụng lại authUserJson và parentId đã khai báo trước đó
      if (authUserJson) {
        const authUser = JSON.parse(authUserJson);
        const userId = authUser.id; // Hoặc sử dụng parentId

        // Tìm user hiện tại trong response mới
        const refreshedUser = refreshResponse.data.find(
          (user: ApiUser) => user.id === userId
        );
        if (refreshedUser && refreshedUser.students) {
          setStudents(refreshedUser.students);
        }
      }

      // Hiển thị thông báo thành công
      toast.success(
        healthRecord
          ? "Hồ sơ sức khỏe đã được cập nhật thành công!"
          : "Hồ sơ sức khỏe đã được tạo thành công!"
      );

      // Đóng dialog
      setUpdateDialogOpen(false);

      // Tải lại dữ liệu ngay lập tức thay vì đợi parent refresh
      fetchData();
    } catch (err) {
      console.error("Error updating health record:", err);

      // Xử lý lỗi chi tiết hơn
      if (axios.isAxiosError(err) && err.response) {
        const statusCode = err.response.status;
        const errorMessage =
          err.response.data?.message ||
          "Đã xảy ra lỗi khi cập nhật hồ sơ sức khỏe.";

        if (statusCode === 400) {
          toast.error(`Lỗi dữ liệu: ${errorMessage}`);
        } else if (statusCode === 401) {
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        } else if (statusCode === 404) {
          toast.error("Không tìm thấy hồ sơ sức khỏe hoặc học sinh này!");
        } else {
          toast.error(`Đã xảy ra lỗi: ${errorMessage}`);
        }
      } else {
        toast.error("Đã xảy ra lỗi khi cập nhật hồ sơ sức khỏe.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===== RENDER UI =====
  // Hiển thị loading khi đang tải dữ liệu
  if (loading && !students.length) {
    return (
      <Container maxWidth="lg">
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60vh",
            }}
          >
            <CircularProgress />
          </Box>
        </>
      </Container>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <Container maxWidth="lg">
        <>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        </>
      </Container>
    );
  }

  // Hiển thị thông báo nếu không có học sinh
  if (students.length === 0) {
    return (
      <Container maxWidth="lg">
        <>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#1976d2" }}
            >
              Hồ sơ sức khỏe học sinh
            </Typography>
          </Box>
          <Card sx={{ textAlign: "center", py: 6, mb: 4 }}>
            <CardContent>
              <HospitalIcon sx={{ fontSize: 64, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Không tìm thấy thông tin học sinh nào cho phụ huynh này
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Để liên kết học sinh với tài khoản của bạn, hãy khai báo thông
                tin sức khỏe học sinh bằng mã học sinh do nhà trường cung cấp.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate("/health-declaration")}
                startIcon={<HospitalIcon />}
              >
                Khai báo sức khỏe học sinh
              </Button>
            </CardContent>
          </Card>
          <Alert severity="info" sx={{ mt: 2 }}>
            Lưu ý: Bạn cần có mã học sinh do nhà trường cung cấp để thực hiện
            khai báo.
          </Alert>
        </>
      </Container>
    );
  }

  // Wrap the Container children in a Fragment
  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4, // Thêm padding top/bottom
        maxWidth: "1100px !important", // Giảm độ rộng container
      }}
    >
      <>
        {/* ===== HEADER TRANG ===== */}
        <Box
          sx={{
            mb: 5, // Tăng margin-bottom
            pt: 1,
          }}
        >
          <div>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: "600",
                color: "#1565c0", // Màu xanh đậm hơn
                mb: 1.5, // Tăng khoảng cách với dòng tiếp theo
                fontSize: { xs: "1.8rem", md: "2.2rem" }, // Responsive font size
              }}
            >
              Hồ sơ sức khỏe học sinh
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: "1rem", maxWidth: "600px" }} // Giới hạn chiều rộng text
            >
              Xem và quản lý thông tin sức khỏe của học sinh
            </Typography>
          </div>
        </Box>

        {/* ===== TIÊU ĐỀ VÀ TAB CHỌN HỌC SINH ===== */}
        <Box sx={{ mb: 4 }}>
          {students.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                mb: 4,
              }}
            >
              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="student tabs"
                sx={{
                  background: "#f8fafc", // Nền nhẹ cho tabs
                  "& .MuiTab-root": {
                    fontWeight: 500,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    py: 2, // Tăng padding trên/dưới cho tab
                    minHeight: "64px",
                  },
                  "& .Mui-selected": {
                    fontWeight: 600,
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                {students.map((student, index) => (
                  <Tab
                    key={student.id}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor:
                              selectedTab === index ? "#1976d2" : "#90caf9",
                            width: 32,
                            height: 32,
                            mr: 1.5,
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <span>{student.fullName}</span>
                      </Box>
                    }
                    sx={{
                      textTransform: "none",
                      fontWeight: selectedTab === index ? "bold" : "normal",
                      color: selectedTab === index ? "#1976d2" : "inherit",
                    }}
                  />
                ))}
                <Tab
                  icon={<AddIcon />}
                  label="Thêm học sinh"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/health-declaration");
                  }}
                  sx={{
                    textTransform: "none",
                    color: "#4caf50",
                    fontWeight: 600,
                  }}
                />
              </Tabs>
            </Paper>
          )}
        </Box>

        {/* ===== HIỂN THỊ HỒ SƠ SỨC KHỎE ===== */}



        {healthRecord && Object.keys(healthRecord).length > 0 ? (
          // Card chứa thông tin sức khỏe
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              overflow: "hidden",
              border: "1px solid #e0e0e0",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
              {/* ===== THÔNG TIN HỌC SINH ===== */}
              {selectedStudent && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 4, // Tăng margin bottom
                    justifyContent: "space-between",
                    flexWrap: { xs: "wrap", sm: "nowrap" },
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  {/* Phần bên trái hiển thị thông tin học sinh */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#2980b9",
                        width: 64,
                        height: 64,
                        mr: 2.5,
                        boxShadow: "0 3px 10px rgba(41,128,185,0.2)",
                      }}
                    >
                      <PersonIcon fontSize="large" />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "600",
                          mb: 0.5,
                          fontSize: { xs: "1.4rem", sm: "1.5rem" },
                        }}
                      >
                        {selectedStudent.fullName}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <span style={{ fontWeight: 500 }}>
                          Lớp {selectedStudent.class}
                        </span>
                        <span style={{ margin: "0 8px" }}>•</span>
                        {new Date(
                          selectedStudent.dateOfBirth
                        ).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Phần bên phải hiển thị nút cập nhật */}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenUpdateDialog}
                    startIcon={<EditIcon />}
                    size="medium"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      height: "42px",
                      px: 2.5,
                      fontWeight: 500,
                      borderWidth: "1.5px",
                      "&:hover": {
                        borderWidth: "1.5px",
                        bgcolor: "rgba(25, 118, 210, 0.04)",
                      },
                    }}
                  >
                    Cập nhật hồ sơ
                  </Button>
                </Box>
              )}

              {/* ===== CHỈ SỐ SỨC KHỎE CƠ BẢN ===== */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{
                    mb: 3,
                    fontSize: "1.1rem",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InfoIcon sx={{ mr: 1, color: "#1976d2" }} />
                  Chỉ số sức khỏe
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "1fr 1fr",
                      md: "1fr 1fr 1fr 1fr",
                    },
                    gap: 3,
                  }}
                >
                  {/* Hiển thị chiều cao */}
                  <Paper
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2.5,
                      bgcolor: "rgba(41, 128, 185, 0.08)",
                      borderRadius: 2,
                      border: "1px solid rgba(41, 128, 185, 0.2)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#2980b9", mr: 2 }}>
                      <HeightIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Chiều cao
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
                      >
                        {healthRecord.height || "--"} cm
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Hiển thị cân nặng */}
                  <Paper
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2.5,
                      bgcolor: "rgba(41, 128, 185, 0.08)",
                      borderRadius: 2,
                      border: "1px solid rgba(41, 128, 185, 0.2)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#2980b9", mr: 2 }}>
                      <WeightIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Cân nặng
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
                      >
                        {healthRecord.weight || "--"} kg
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Hiển thị nhóm máu */}
                  <Paper
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2.5,
                      bgcolor: "rgba(41, 128, 185, 0.08)",
                      borderRadius: 2,
                      border: "1px solid rgba(41, 128, 185, 0.2)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#2980b9", mr: 2 }}>
                      <BloodtypeIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        Nhóm máu
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
                      >
                        {healthRecord.bloodType || "Chưa xác định"}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Hiển thị BMI */}
                  <Paper
                    elevation={0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2.5,
                      bgcolor: "rgba(41, 128, 185, 0.08)",
                      borderRadius: 2,
                      border: "1px solid rgba(41, 128, 185, 0.2)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: "#2980b9", mr: 2 }}>
                      <HospitalIcon />
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight={500}
                      >
                        BMI
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", fontSize: "1.25rem" }}
                      >
                        {healthRecord.height && healthRecord.weight
                          ? (
                              Number(healthRecord.weight) /
                              Math.pow(Number(healthRecord.height) / 100, 2)
                            ).toFixed(1)
                          : "--"}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>

              <Divider sx={{ my: 4, borderColor: "#e0e0e0" }} />

              {/* ===== CÁC MỤC THÔNG TIN KHÁC ===== */}
              {/* Sử dụng style tương tự cho các phần còn lại */}
              {/* Ví dụ cho phần dị ứng */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 3,
                    fontSize: "1.1rem",
                    color: "#333",
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 600,
                  }}
                >
                  <WarningIcon sx={{ mr: 1, color: "#ff9800" }} />
                  Dị ứng
                </Typography>

                {/* Hiển thị thông tin dị ứng hoặc thông báo không có */}
                {healthRecord.allergies ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: "rgba(41, 128, 185, 0.08)",
                      borderRadius: 2,
                      border: "1px solid rgba(41, 128, 185, 0.2)",
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {healthRecord.allergies}
                    </Typography>
                  </Paper>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      bgcolor: "rgba(41, 128, 185, 0.08)",
                      borderRadius: 2,
                      border: "1px solid rgba(41, 128, 185, 0.2)",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{ fontStyle: "italic" }}
                    >
                      Không có dị ứng nào được ghi nhận
                    </Typography>
                  </Paper>
                )}
              </Box>

              {/* ===== THÔNG TIN BỆNH MÃN TÍNH ===== */}
              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <HospitalIcon sx={{ color: "#f44336", mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Bệnh mãn tính
                  </Typography>
                </Box>

                {/* Hiển thị thông tin bệnh mãn tính hoặc thông báo không có */}
                {healthRecord.chronicDiseases ? (
                  <Box sx={{ p: 2, bgcolor: "rgba(41, 128, 185, 0.08)", borderRadius: 1 }}>
                    <Typography variant="body1">
                      {healthRecord.chronicDiseases}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ p: 2, bgcolor: "rgba(41, 128, 185, 0.08)", borderRadius: 1 }}>
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

              {/* ===== THỊ LỰC VÀ THÍNH LỰC ===== */}
              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ mb: 2 }}
                >
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
                  <Box sx={{ bgcolor: "rgba(41, 128, 185, 0.08)", p: 2, borderRadius: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <VisionIcon sx={{ color: "#2980b9", mr: 1 }} />
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
                  <Box sx={{ bgcolor: "rgba(41, 128, 185, 0.08)", p: 2, borderRadius: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <HearingIcon sx={{ color: "#2980b9", mr: 1 }} />
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

              {/* ===== LỊCH SỬ Y TẾ ===== */}
              <Divider sx={{ my: 3 }} />

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
                  <Box sx={{ p: 2, bgcolor: "rgba(41, 128, 185, 0.08)", borderRadius: 1 }}>
                    <Typography variant="body2">
                      {healthRecord.pastMedicalHistory || "Không có thông tin"}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Lịch sử tiêm chủng
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: "rgba(41, 128, 185, 0.08)", borderRadius: 1 }}>
                    <Typography variant="body2">
                      {healthRecord.vaccinationHistory || "Không có thông tin"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* ===== GHI CHÚ BỔ SUNG ===== */}
              <Divider sx={{ my: 3 }} />

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <NotesIcon sx={{ color: "#2980b9", mr: 1 }} />
                  <Typography variant="subtitle1" fontWeight="bold">
                    Ghi chú bổ sung
                  </Typography>
                </Box>

                <Box sx={{ p: 2, bgcolor: "rgba(41, 128, 185, 0.08)", borderRadius: 1 }}>
                  <Typography variant="body2">
                    {healthRecord.otherNotes || "Không có ghi chú bổ sung"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ) : (
          /* ===== HIỂN THỊ KHI KHÔNG CÓ HỒ SƠ ===== */
          <Card
            sx={{
              textAlign: "center",
              py: 8,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e0e0e0",
            }}
          >
            <CardContent>
              <HospitalIcon sx={{ fontSize: 64, color: "#bdbdbd", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Không tìm thấy hồ sơ sức khỏe
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Hãy khai báo sức khỏe cho học sinh này để liên kết với tài khoản
                của bạn
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  if (selectedStudent) {
                    navigate("/health-declaration", {
                      state: {
                        studentId: selectedStudent.id,
                        studentName: selectedStudent.fullName,
                        studentCode: selectedStudent.studentCode,
                        studentClass: selectedStudent.class,
                        dateOfBirth: selectedStudent.dateOfBirth,
                      },
                    });
                  } else {
                    toast.error("Vui lòng chọn học sinh trước khi khai báo");
                  }
                }}
              >
                Khai báo sức khỏe
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ===== DIALOG CẬP NHẬT HỒ SƠ ===== */}
        <Dialog
          open={updateDialogOpen}
          onClose={handleCloseUpdateDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: "hidden",
            },
          }}
        >
          {/* Header dialog */}
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              bgcolor: "#f5f9ff",
              borderBottom: "1px solid #e3f2fd",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
            >
              <EditIcon sx={{ mr: 1, color: "#1976d2" }} />
              Cập nhật hồ sơ sức khỏe
            </Typography>
            <IconButton onClick={handleCloseUpdateDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          {/* Nội dung dialog - các form fields cũng cần spacing tốt hơn */}
          <DialogContent dividers>
            {selectedStudent && (
              <>
                {/* Thông tin học sinh */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    fontWeight="bold"
                  >
                    Thông tin học sinh
                  </Typography>
                  <Typography>
                    {selectedStudent.fullName} - Lớp {selectedStudent.class}
                  </Typography>
                </Box>

                {/* Form cập nhật */}
                {updatedRecord && (
                  <>
                    {/* Form cập nhật chỉ số sức khỏe cơ bản */}
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        fontWeight="bold"
                      >
                        Chỉ số sức khỏe cơ bản
                      </Typography>

                      {/* Trường nhập chiều cao và cân nặng */}
                      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                        <TextField
                          label="Chiều cao (cm)"
                          type="number"
                          value={updatedRecord.height || ""}
                          onChange={(e) =>
                            setUpdatedRecord({
                              ...updatedRecord,
                              height: e.target.value,
                            })
                          }
                          InputProps={{ inputProps: { min: 0, max: 250 } }}
                          fullWidth
                        />

                        <TextField
                          label="Cân nặng (kg)"
                          type="number"
                          value={updatedRecord.weight || ""}
                          onChange={(e) =>
                            setUpdatedRecord({
                              ...updatedRecord,
                              weight: e.target.value,
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
                              bloodType: e.target.value as string,
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
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                      >
                        Dị ứng & Bệnh mãn tính
                      </Typography>

                      <TextField
                        label="Thông tin dị ứng"
                        multiline
                        rows={2}
                        fullWidth
                        placeholder="Nhập thông tin dị ứng (VD: Tôm, cá, hải sản, phấn hoa...)"
                        helperText="Liệt kê các chất gây dị ứng, ngăn cách bằng dấu phẩy"
                        value={updatedRecord.allergies || ""}
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
                        value={updatedRecord.chronicDiseases || ""}
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
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                      >
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
                          value={updatedRecord.visionLeft || ""}
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
                          value={updatedRecord.visionRight || ""}
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
                          value={updatedRecord.hearingLeft || ""}
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
                          value={updatedRecord.hearingRight || ""}
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
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                      >
                        Lịch sử y tế
                      </Typography>

                      <TextField
                        label="Tiền sử bệnh"
                        multiline
                        rows={3}
                        fullWidth
                        placeholder="Nhập thông tin về tiền sử bệnh tật, phẫu thuật hoặc những vấn đề sức khỏe đáng chú ý trong quá khứ"
                        value={updatedRecord.pastMedicalHistory || ""}
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
                        value={updatedRecord.vaccinationHistory || ""}
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
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                      >
                        Ghi chú bổ sung
                      </Typography>

                      <TextField
                        label="Ghi chú thêm"
                        multiline
                        rows={4}
                        fullWidth
                        placeholder="Thông tin bổ sung về sức khỏe của học sinh..."
                        value={updatedRecord.otherNotes || ""}
                        onChange={(e) =>
                          setUpdatedRecord({
                            ...updatedRecord,
                            otherNotes: e.target.value,
                          })
                        }
                      />
                    </Box>
                  </>
                )}
              </>
            )}
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} /> Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </Container>
  );
};

export default HealthRecordsPage;
