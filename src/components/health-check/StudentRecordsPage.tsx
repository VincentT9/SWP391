import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  Medication as MedicationIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Bloodtype as BloodtypeIcon,
  Warning as WarningIcon,
  LocalHospital as HospitalIcon,
  Hearing as HearingIcon,
  Event as EventIcon,
  Notes as NotesIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";
import instance from "../../utils/axiosConfig";

// Updated interface to match API response
interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number; // 0 = Male, 1 = Female
  class: string;
  schoolYear: string;
  image: string;
  healthRecord: {
    id: string;
    height: string;
    weight: string;
    bloodType: string;
    allergies: string;
    chronicDiseases: string;
    pastMedicalHistory: string;
    visionLeft: string;
    visionRight: string;
    hearingLeft: string;
    hearingRight: string;
    vaccinationHistory: string;
    otherNotes: string;
  };
}

// Interface for health record update
interface HealthRecordUpdate {
  studentId: string;
  height: string;
  weight: string;
  bloodType: string;
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

// Keep existing HealthRecord interface for historical records
interface HealthRecord {
  id: string;
  studentId: string;
  date: string;
  type: "checkup" | "treatment" | "vaccination" | "medication";
  title: string;
  description: string;
  height?: number;
  weight?: number;
  bloodPressure?: string;
  temperature?: number;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  nurseId: string;
  nurseName: string;
}

const StudentRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchStudentId, setSearchStudentId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordsError, setRecordsError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(
    null
  );

  // State for health record update
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [updatingHealthRecord, setUpdatingHealthRecord] = useState(false);
  const [healthRecordForm, setHealthRecordForm] =
    useState<HealthRecordUpdate | null>(null);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Blood type options
  const bloodTypeOptions = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "Chưa xác định",
  ];

  // Check if user is nurse or admin
  if (
    !user?.isAuthenticated ||
    (user.role !== "MedicalStaff" && user.role !== "Admin")
  ) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Chỉ có y tá và quản trị viên mới có quyền truy cập chức năng này.
          </Alert>
        </Box>
      </Container>
    );
  }

  // Add a function to fetch health records by student ID
  const fetchHealthRecords = async (studentId: string) => {
    setLoadingRecords(true);
    setRecordsError(null);

    try {
      // Assuming there's an API endpoint for health records
      // Replace with the actual endpoint
      const response = await instance.get(
        `/api/HealthRecord/by-student/${studentId}`
      );

      if (response.data && Array.isArray(response.data)) {
        setHealthRecords(response.data);
      } else {
        setHealthRecords([]);
        setRecordsError("Không tìm thấy bản ghi sức khỏe cho học sinh này");
      }
    } catch (err) {
      console.error("Error fetching health records:", err);
      setHealthRecords([]);
      setRecordsError("Đã xảy ra lỗi khi lấy dữ liệu bản ghi sức khỏe");
    } finally {
      setLoadingRecords(false);
    }
  };

  // Update handleSearch to use the API for both student and health records
  const handleSearch = async () => {
    if (!searchStudentId.trim()) {
      setError("Vui lòng nhập mã số học sinh.");
      return;
    }

    setLoading(true);
    setError(null);
    setHealthRecords([]);

    try {
      const response = await instance.get(
        `/api/Student/get-student-by-student-code/${searchStudentId.trim()}`
      );

      if (response.data) {
        setSelectedStudent(response.data);
        // Fetch real health records instead of using mock data
        await fetchHealthRecords(response.data.id);
      } else {
        setSelectedStudent(null);
        setHealthRecords([]);
        setError("Không tìm thấy học sinh với mã số này.");
      }
    } catch (err) {
      console.error("Error fetching student:", err);
      setSelectedStudent(null);
      setHealthRecords([]);
      setError("Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  // Handle opening edit health record dialog
  const handleOpenEditDialog = () => {
    if (!selectedStudent || !selectedStudent.healthRecord) return;

    const { healthRecord, id } = selectedStudent;

    setHealthRecordForm({
      studentId: id,
      height: healthRecord.height || "",
      weight: healthRecord.weight || "",
      bloodType: healthRecord.bloodType || "",
      allergies: healthRecord.allergies || "",
      chronicDiseases: healthRecord.chronicDiseases || "",
      pastMedicalHistory: healthRecord.pastMedicalHistory || "",
      visionLeft: healthRecord.visionLeft || "",
      visionRight: healthRecord.visionRight || "",
      hearingLeft: healthRecord.hearingLeft || "",
      hearingRight: healthRecord.hearingRight || "",
      vaccinationHistory: healthRecord.vaccinationHistory || "",
      otherNotes: healthRecord.otherNotes || "",
    });

    setOpenEditDialog(true);
  };

  // Handle closing edit health record dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setHealthRecordForm(null);
  };

  // Handle form input changes
  const handleFormChange = (field: keyof HealthRecordUpdate, value: string) => {
    if (!healthRecordForm) return;
    setHealthRecordForm({
      ...healthRecordForm,
      [field]: value,
    });
  };

  // Handle health record update submission
  const handleUpdateHealthRecord = async () => {
    if (!selectedStudent || !healthRecordForm) return;

    setUpdatingHealthRecord(true);

    try {
      await instance.put(
        `/api/HealthRecord/update-health-record/${selectedStudent.healthRecord.id}`,
        healthRecordForm
      );

      // Update the local student data with the new health record info
      setSelectedStudent({
        ...selectedStudent,
        healthRecord: {
          ...selectedStudent.healthRecord,
          ...healthRecordForm,
        },
      });

      setUpdateMessage({
        type: "success",
        message: "Cập nhật hồ sơ sức khỏe thành công",
      });

      setShowSnackbar(true);
      setOpenEditDialog(false);
    } catch (err) {
      console.error("Error updating health record:", err);
      setUpdateMessage({
        type: "error",
        message: "Đã xảy ra lỗi khi cập nhật hồ sơ sức khỏe",
      });
      setShowSnackbar(true);
    } finally {
      setUpdatingHealthRecord(false);
    }
  };

  // Close the snackbar
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "checkup":
        return "#2196f3";
      case "treatment":
        return "#f44336";
      case "vaccination":
        return "#4caf50";
      case "medication":
        return "#ff9800";
      default:
        return "#757575";
    }
  };

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case "checkup":
        return "Khám sức khỏe";
      case "treatment":
        return "Điều trị";
      case "vaccination":
        return "Tiêm chủng";
      case "medication":
        return "Dùng thuốc";
      default:
        return "Khác";
    }
  };

  // Helper function to get gender text from number
  const getGenderText = (gender: number) => {
    return gender === 0 ? "Nam" : "Nữ";
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Calculate BMI if height and weight are available
  const calculateBMI = (height: string, weight: string) => {
    if (height && weight) {
      const heightInMeters = Number(height) / 100;
      const weightInKg = Number(weight);
      if (heightInMeters > 0 && weightInKg > 0) {
        return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      }
    }
    return "--";
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        maxWidth: "1100px !important",
      }}
    >
      <Box sx={{ my: 2 }}>
        {/* Header with improved styling */}
        <Box sx={{ mb: 5, pt: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "600",
              color: "#1565c0",
              mb: 1.5,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            Tìm kiếm hồ sơ học sinh
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1rem", maxWidth: "600px" }}
          >
            Nhập mã số học sinh để tìm kiếm và xem hồ sơ sức khỏe
          </Typography>
        </Box>

        {/* Search Section with improved styling */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <TextField
                fullWidth
                label="Mã số học sinh"
                placeholder="Nhập mã số học sinh (VD: STU001)"
                value={searchStudentId}
                onChange={(e) => setSearchStudentId(e.target.value)}
                onKeyPress={handleKeyPress}
                error={!!error}
                helperText={error}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading || !searchStudentId.trim()}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <SearchIcon />
                }
                sx={{
                  bgcolor: "#0066b3",
                  "&:hover": { bgcolor: "#004d85" },
                  minWidth: "120px",
                  height: "56px",
                  borderRadius: 2,
                }}
              >
                {loading ? "Đang tìm..." : "Tìm kiếm"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Student Information - Enhanced styling */}
        {selectedStudent && (
          <Card
            sx={{
              mb: 4,
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
              {/* Student info header with styled title */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#0066b3",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <PersonIcon sx={{ mr: 1 }} />
                  Thông tin học sinh
                </Typography>

                {/* Add Edit Button */}
                <Button
                  variant="contained"
                  onClick={handleOpenEditDialog}
                  startIcon={<EditIcon />}
                  sx={{
                    bgcolor: "#ff9800",
                    "&:hover": { bgcolor: "#f57c00" },
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(255,152,0,0.3)",
                  }}
                >
                  Cập nhật hồ sơ sức khỏe
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                {/* Avatar Section */}
                <Box
                  sx={{
                    textAlign: "center",
                    minWidth: { md: "200px" },
                    alignSelf: { md: "flex-start" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "#0066b3",
                      boxShadow: "0 3px 10px rgba(25,118,210,0.2)",
                    }}
                    src={selectedStudent.image}
                  >
                    <PersonIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {selectedStudent.fullName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedStudent.studentCode}
                  </Typography>
                </Box>

                {/* Basic Info - Using Grid */}
                <Box sx={{ flex: 1 }}>
                  {/* Basic information cards */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        margin: -1, // Negative margin to counteract padding on items
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "100%", sm: "50%", md: "25%" },
                          p: 1,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "#f5f9ff",
                            border: "1px solid #e3f2fd",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Typography variant="subtitle2" color="textSecondary">
                            Lớp
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: "1.1rem" }}
                          >
                            {selectedStudent.class}
                          </Typography>
                        </Paper>
                      </Box>

                      <Box
                        sx={{
                          width: { xs: "100%", sm: "50%", md: "25%" },
                          p: 1,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "#f5f9ff",
                            border: "1px solid #e3f2fd",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Typography variant="subtitle2" color="textSecondary">
                            Niên khóa
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: "1.1rem" }}
                          >
                            {selectedStudent.schoolYear}
                          </Typography>
                        </Paper>
                      </Box>

                      <Box
                        sx={{
                          width: { xs: "100%", sm: "50%", md: "25%" },
                          p: 1,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "#f5f9ff",
                            border: "1px solid #e3f2fd",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Typography variant="subtitle2" color="textSecondary">
                            Tuổi
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: "1.1rem" }}
                          >
                            {calculateAge(selectedStudent.dateOfBirth)} tuổi
                          </Typography>
                        </Paper>
                      </Box>

                      <Box
                        sx={{
                          width: { xs: "100%", sm: "50%", md: "25%" },
                          p: 1,
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            bgcolor: "#f5f9ff",
                            border: "1px solid #e3f2fd",
                            borderRadius: 2,
                            height: "100%",
                          }}
                        >
                          <Typography variant="subtitle2" color="textSecondary">
                            Giới tính
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: "1.1rem" }}
                          >
                            {getGenderText(selectedStudent.gender)}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 4, borderColor: "#e0e0e0" }} />

              {/* Health Information - Enhanced styling */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MedicalIcon sx={{ mr: 1, color: "#1976d2" }} />
                  Thông tin sức khỏe
                </Typography>

                {/* Health metrics cards */}
                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      margin: -1, // Negative margin to counteract padding on items
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", sm: "50%", md: "25%" },
                        p: 1,
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          bgcolor: "#f5f9ff",
                          borderRadius: 2,
                          border: "1px solid #e3f2fd",
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#1976d2", mr: 1.5 }}>
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
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {selectedStudent.healthRecord?.height || "--"} cm
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>

                    <Box
                      sx={{
                        width: { xs: "100%", sm: "50%", md: "25%" },
                        p: 1,
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          bgcolor: "#f9f9ff",
                          borderRadius: 2,
                          border: "1px solid #e8eaf6",
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#3f51b5", mr: 1.5 }}>
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
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {selectedStudent.healthRecord?.weight || "--"} kg
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>

                    <Box
                      sx={{
                        width: { xs: "100%", sm: "50%", md: "25%" },
                        p: 1,
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          bgcolor: "#fff5f5",
                          borderRadius: 2,
                          border: "1px solid #ffebee",
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#d32f2f", mr: 1.5 }}>
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
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {selectedStudent.healthRecord?.bloodType ||
                              "Chưa xác định"}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>

                    <Box
                      sx={{
                        width: { xs: "100%", sm: "50%", md: "25%" },
                        p: 1,
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 2,
                          bgcolor: "#f4fcf7",
                          borderRadius: 2,
                          border: "1px solid #e8f5e9",
                          height: "100%",
                          transition: "transform 0.2s",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#4caf50", mr: 1.5 }}>
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
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {calculateBMI(
                              selectedStudent.healthRecord?.height || "",
                              selectedStudent.healthRecord?.weight || ""
                            )}
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                </Box>

                {/* Allergies Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
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

                  {selectedStudent.healthRecord?.allergies ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: "#fff8e1",
                        borderRadius: 2,
                        border: "1px solid #ffecb3",
                      }}
                    >
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {selectedStudent.healthRecord.allergies}
                      </Typography>
                    </Paper>
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: "#fafafa",
                        borderRadius: 2,
                        border: "1px solid #f0f0f0",
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

                {/* Chronic Diseases Section */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontSize: "1.1rem",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                    }}
                  >
                    <HospitalIcon sx={{ mr: 1, color: "#f44336" }} />
                    Bệnh mãn tính
                  </Typography>

                  {selectedStudent.healthRecord?.chronicDiseases ? (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: "#ffebee",
                        borderRadius: 2,
                        border: "1px solid #ffcdd2",
                      }}
                    >
                      <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        {selectedStudent.healthRecord.chronicDiseases}
                      </Typography>
                    </Paper>
                  ) : (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        bgcolor: "#fafafa",
                        borderRadius: 2,
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ fontStyle: "italic" }}
                      >
                        Không có bệnh mãn tính nào được ghi nhận
                      </Typography>
                    </Paper>
                  )}
                </Box>

                {/* Vision and Hearing */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontSize: "1.1rem",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                    }}
                  >
                    <EyeIcon sx={{ mr: 1, color: "#2196f3" }} />
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
                    {/* Vision */}
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: "#e3f2fd",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #bbdefb",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <EyeIcon sx={{ color: "#1976d2", mr: 1 }} />
                        <Typography variant="subtitle2" fontWeight="medium">
                          Thị lực
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 4 }}>
                        <Typography variant="body2">
                          <strong>Mắt trái:</strong>{" "}
                          {selectedStudent.healthRecord?.visionLeft ||
                            "Chưa có thông tin"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Mắt phải:</strong>{" "}
                          {selectedStudent.healthRecord?.visionRight ||
                            "Chưa có thông tin"}
                        </Typography>
                      </Box>
                    </Paper>

                    {/* Hearing */}
                    <Paper
                      elevation={0}
                      sx={{
                        bgcolor: "#e8f5e9",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <HearingIcon sx={{ color: "#4caf50", mr: 1 }} />
                        <Typography variant="subtitle2" fontWeight="medium">
                          Thính lực
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 4 }}>
                        <Typography variant="body2">
                          <strong>Tai trái:</strong>{" "}
                          {selectedStudent.healthRecord?.hearingLeft ||
                            "Chưa có thông tin"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Tai phải:</strong>{" "}
                          {selectedStudent.healthRecord?.hearingRight ||
                            "Chưa có thông tin"}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Box>

                {/* Medical History */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      mb: 2,
                      fontSize: "1.1rem",
                      color: "#333",
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                    }}
                  >
                    <EventIcon sx={{ mr: 1, color: "#9c27b0" }} />
                    Lịch sử y tế
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight="medium"
                    >
                      Tiền sử bệnh
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#f3e5f5",
                        borderRadius: 2,
                        border: "1px solid #e1bee7",
                      }}
                    >
                      <Typography variant="body2">
                        {selectedStudent.healthRecord?.pastMedicalHistory ||
                          "Không có thông tin"}
                      </Typography>
                    </Paper>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight="medium"
                    >
                      Lịch sử tiêm chủng
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#f3e5f5",
                        borderRadius: 2,
                        border: "1px solid #e1bee7",
                      }}
                    >
                      <Typography variant="body2">
                        {selectedStudent.healthRecord?.vaccinationHistory ||
                          "Không có thông tin"}
                      </Typography>
                    </Paper>
                  </Box>
                </Box>

                {/* Additional Notes */}
                {selectedStudent.healthRecord?.otherNotes && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontSize: "1.1rem",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 600,
                      }}
                    >
                      <NotesIcon sx={{ mr: 1, color: "#4caf50" }} />
                      Ghi chú bổ sung
                    </Typography>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#f1f8e9",
                        borderRadius: 2,
                        border: "1px solid #dcedc8",
                      }}
                    >
                      <Typography variant="body2">
                        {selectedStudent.healthRecord.otherNotes}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Health Records Section */}
        {selectedStudent && (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #e0e0e0",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#0066b3",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <MedicalIcon sx={{ mr: 1 }} />
                  Lịch sử khám chữa bệnh ({healthRecords.length} bản ghi)
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    bgcolor: "#4caf50",
                    "&:hover": { bgcolor: "#45a049" },
                    borderRadius: 2,
                    boxShadow: "0 3px 10px rgba(76,175,80,0.2)",
                  }}
                >
                  Thêm bản ghi mới
                </Button>
              </Box>

              {loadingRecords ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress
                    size={40}
                    sx={{ color: "#1976d2", mb: 2 }}
                  />
                  <Typography>Đang tải dữ liệu bản ghi...</Typography>
                </Box>
              ) : recordsError ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Alert
                    severity="info"
                    sx={{
                      maxWidth: "500px",
                      mx: "auto",
                      borderRadius: 2,
                      "& .MuiAlert-icon": {
                        fontSize: "1.5rem",
                      },
                    }}
                  >
                    {recordsError}
                  </Alert>
                </Box>
              ) : healthRecords.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <MedicalIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Chưa có bản ghi sức khỏe nào
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                      mb: 3,
                      maxWidth: "500px",
                      mx: "auto",
                    }}
                  >
                    Nhấn "Thêm bản ghi mới" để tạo bản ghi đầu tiên cho học sinh
                    này
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 2,
                      borderWidth: "1.5px",
                      borderColor: "#4caf50",
                      color: "#4caf50",
                      "&:hover": {
                        borderWidth: "1.5px",
                        borderColor: "#45a049",
                      },
                    }}
                  >
                    Thêm bản ghi mới
                  </Button>
                </Box>
              ) : (
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    "& .MuiTable-root": {
                      borderCollapse: "separate",
                      borderSpacing: 0,
                    },
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f5f9ff" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Ngày</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Tiêu đề</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Y tá</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {healthRecords.map((record) => (
                        <TableRow
                          key={record.id}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell>
                            {new Date(record.date).toLocaleDateString("vi-VN")}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getRecordTypeLabel(record.type)}
                              size="small"
                              sx={{
                                bgcolor: getRecordTypeColor(record.type),
                                color: "white",
                                fontWeight: 500,
                                px: 1,
                              }}
                            />
                          </TableCell>
                          <TableCell>{record.title}</TableCell>
                          <TableCell>{record.nurseName}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleViewRecord(record)}
                              sx={{ color: "#0066b3" }}
                              title="Xem chi tiết"
                            >
                              <EyeIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: "#ff9800" }}
                              title="Chỉnh sửa"
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Record Detail Dialog - Enhanced styling */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: "hidden",
              minHeight: "400px",
            },
          }}
        >
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
              <MedicalIcon sx={{ mr: 1, color: "#1976d2" }} />
              Chi tiết bản ghi sức khỏe
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {selectedRecord && (
              <Box sx={{ pt: 2 }}>
                {/* Basic Info */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày khám
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(selectedRecord.date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Loại
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={getRecordTypeLabel(selectedRecord.type)}
                        size="small"
                        sx={{
                          bgcolor: getRecordTypeColor(selectedRecord.type),
                          color: "white",
                          fontWeight: 500,
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Tiêu đề
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedRecord.title}
                  </Typography>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Mô tả
                  </Typography>
                  <Typography variant="body1">
                    {selectedRecord.description}
                  </Typography>
                </Paper>

                {/* Health Metrics */}
                {(selectedRecord.height ||
                  selectedRecord.weight ||
                  selectedRecord.bloodPressure ||
                  selectedRecord.temperature) && (
                  <Box sx={{ mb: 3 }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <MedicalIcon sx={{ mr: 1, color: "#1976d2" }} />
                      Chỉ số sức khỏe
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        margin: -0.5,
                      }}
                    >
                      {selectedRecord.height && (
                        <Box sx={{ width: { xs: "50%", sm: "25%" }, p: 0.5 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1.5,
                              bgcolor: "#f5f9ff",
                              borderRadius: 2,
                              border: "1px solid #e3f2fd",
                              height: "100%",
                            }}
                          >
                            <HeightIcon sx={{ mr: 1, color: "#1976d2" }} />
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Chiều cao
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedRecord.height} cm
                              </Typography>
                            </Box>
                          </Paper>
                        </Box>
                      )}

                      {selectedRecord.weight && (
                        <Box sx={{ width: { xs: "50%", sm: "25%" }, p: 0.5 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1.5,
                              bgcolor: "#f9f9ff",
                              borderRadius: 2,
                              border: "1px solid #e8eaf6",
                              height: "100%",
                            }}
                          >
                            <WeightIcon sx={{ mr: 1, color: "#3f51b5" }} />
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Cân nặng
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedRecord.weight} kg
                              </Typography>
                            </Box>
                          </Paper>
                        </Box>
                      )}

                      {selectedRecord.bloodPressure && (
                        <Box sx={{ width: { xs: "50%", sm: "25%" }, p: 0.5 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1.5,
                              bgcolor: "#fff5f5",
                              borderRadius: 2,
                              border: "1px solid #ffebee",
                              height: "100%",
                            }}
                          >
                            <BloodtypeIcon sx={{ mr: 1, color: "#f44336" }} />
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Huyết áp
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedRecord.bloodPressure} mmHg
                              </Typography>
                            </Box>
                          </Paper>
                        </Box>
                      )}

                      {selectedRecord.temperature && (
                        <Box sx={{ width: { xs: "50%", sm: "25%" }, p: 0.5 }}>
                          <Paper
                            elevation={0}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1.5,
                              bgcolor: "#fff8e1",
                              borderRadius: 2,
                              border: "1px solid #ffecb3",
                              height: "100%",
                            }}
                          >
                            <MedicalIcon sx={{ mr: 1, color: "#ff9800" }} />
                            <Box>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                Nhiệt độ
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {selectedRecord.temperature}°C
                              </Typography>
                            </Box>
                          </Paper>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {selectedRecord.diagnosis && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Chẩn đoán
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#e8f5e9",
                        borderRadius: 2,
                        border: "1px solid #c8e6c9",
                      }}
                    >
                      <Typography variant="body1">
                        {selectedRecord.diagnosis}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {selectedRecord.treatment && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      gutterBottom
                    >
                      Điều trị
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "#e3f2fd",
                        borderRadius: 2,
                        border: "1px solid #bbdefb",
                      }}
                    >
                      <Typography variant="body1">
                        {selectedRecord.treatment}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {selectedRecord.medications &&
                  selectedRecord.medications.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        gutterBottom
                      >
                        Thuốc đã sử dụng
                      </Typography>
                      <Paper
                        elevation={0}
                        sx={{
                          py: 1,
                          px: 2,
                          bgcolor: "#fff8e1",
                          borderRadius: 2,
                          border: "1px solid #ffecb3",
                        }}
                      >
                        <List dense disablePadding>
                          {selectedRecord.medications.map(
                            (medication, index) => (
                              <ListItem key={index} sx={{ py: 0.5 }}>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <MedicationIcon sx={{ color: "#ff9800" }} />
                                </ListItemIcon>
                                <ListItemText primary={medication} />
                              </ListItem>
                            )
                          )}
                        </List>
                      </Paper>
                    </Box>
                  )}

                <Box>
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    gutterBottom
                  >
                    Y tá phụ trách
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: "#1976d2",
                        width: 36,
                        height: 36,
                        mr: 1.5,
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedRecord.nurseName}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: "1.5px",
                "&:hover": {
                  borderWidth: "1.5px",
                },
              }}
            >
              Đóng
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                borderRadius: 2,
                bgcolor: "#0066b3",
                "&:hover": { bgcolor: "#004d85" },
                textTransform: "none",
              }}
            >
              Chỉnh sửa bản ghi
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Health Record Dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              bgcolor: "#fff8e1",
              borderBottom: "1px solid #ffecb3",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, display: "flex", alignItems: "center" }}
            >
              <EditIcon sx={{ mr: 1, color: "#ff9800" }} />
              Cập nhật hồ sơ sức khỏe
            </Typography>
            <IconButton onClick={handleCloseEditDialog} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {healthRecordForm && (
              <Box sx={{ pt: 1, pb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Cập nhật thông tin sức khỏe cho học sinh{" "}
                  <strong>{selectedStudent?.fullName}</strong>
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {/* Physical metrics */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      Thông số cơ bản
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "1fr 1fr",
                          md: "1fr 1fr 1fr",
                        },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Chiều cao (cm)"
                        value={healthRecordForm.height}
                        onChange={(e) =>
                          handleFormChange("height", e.target.value)
                        }
                        fullWidth
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <HeightIcon
                              color="primary"
                              sx={{ mr: 1, opacity: 0.7 }}
                            />
                          ),
                        }}
                      />

                      <TextField
                        label="Cân nặng (kg)"
                        value={healthRecordForm.weight}
                        onChange={(e) =>
                          handleFormChange("weight", e.target.value)
                        }
                        fullWidth
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <WeightIcon
                              color="primary"
                              sx={{ mr: 1, opacity: 0.7 }}
                            />
                          ),
                        }}
                      />

                      <FormControl fullWidth>
                        <InputLabel>Nhóm máu</InputLabel>
                        <Select
                          value={healthRecordForm.bloodType || ""}
                          onChange={(e) =>
                            handleFormChange("bloodType", e.target.value)
                          }
                          label="Nhóm máu"
                          startAdornment={
                            <BloodtypeIcon
                              color="error"
                              sx={{ mr: 1, ml: -0.5, opacity: 0.7 }}
                            />
                          }
                        >
                          {bloodTypeOptions.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>

                  {/* Vision and hearing */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      Thị lực và thính lực
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Thị lực mắt trái"
                        value={healthRecordForm.visionLeft}
                        onChange={(e) =>
                          handleFormChange("visionLeft", e.target.value)
                        }
                        fullWidth
                      />

                      <TextField
                        label="Thị lực mắt phải"
                        value={healthRecordForm.visionRight}
                        onChange={(e) =>
                          handleFormChange("visionRight", e.target.value)
                        }
                        fullWidth
                      />

                      <TextField
                        label="Thính lực tai trái"
                        value={healthRecordForm.hearingLeft}
                        onChange={(e) =>
                          handleFormChange("hearingLeft", e.target.value)
                        }
                        fullWidth
                      />

                      <TextField
                        label="Thính lực tai phải"
                        value={healthRecordForm.hearingRight}
                        onChange={(e) =>
                          handleFormChange("hearingRight", e.target.value)
                        }
                        fullWidth
                      />
                    </Box>
                  </Box>

                  {/* Allergies and chronic diseases */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      Dị ứng và bệnh mãn tính
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Dị ứng"
                        value={healthRecordForm.allergies}
                        onChange={(e) =>
                          handleFormChange("allergies", e.target.value)
                        }
                        fullWidth
                        multiline
                        rows={2}
                      />

                      <TextField
                        label="Bệnh mãn tính"
                        value={healthRecordForm.chronicDiseases}
                        onChange={(e) =>
                          handleFormChange("chronicDiseases", e.target.value)
                        }
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </Box>
                  </Box>

                  {/* Past medical history and vaccination history */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      Tiền sử bệnh và lịch sử tiêm chủng
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                        gap: 2,
                      }}
                    >
                      <TextField
                        label="Tiền sử bệnh"
                        value={healthRecordForm.pastMedicalHistory}
                        onChange={(e) =>
                          handleFormChange("pastMedicalHistory", e.target.value)
                        }
                        fullWidth
                        multiline
                        rows={2}
                      />

                      <TextField
                        label="Lịch sử tiêm chủng"
                        value={healthRecordForm.vaccinationHistory}
                        onChange={(e) =>
                          handleFormChange("vaccinationHistory", e.target.value)
                        }
                        fullWidth
                        multiline
                        rows={2}
                      />
                    </Box>
                  </Box>

                  {/* Other notes */}
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ mb: 2, fontWeight: "medium" }}
                    >
                      Ghi chú bổ sung
                    </Typography>
                    <TextField
                      label="Ghi chú khác"
                      value={healthRecordForm.otherNotes}
                      onChange={(e) =>
                        handleFormChange("otherNotes", e.target.value)
                      }
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCloseEditDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                borderWidth: "1.5px",
                "&:hover": {
                  borderWidth: "1.5px",
                },
              }}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdateHealthRecord}
              disabled={updatingHealthRecord}
              startIcon={
                updatingHealthRecord ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : (
                  <SaveIcon />
                )
              }
              sx={{
                borderRadius: 2,
                bgcolor: "#0066b3",
                "&:hover": { bgcolor: "#004d85" },
                textTransform: "none",
              }}
            >
              {updatingHealthRecord ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default StudentRecordsPage;
