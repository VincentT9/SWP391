import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Chip,
  Tooltip,
  InputAdornment,
  Tabs,
  Tab,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Breadcrumbs,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { toast } from "react-toastify";
import instance from "../../utils/axiosConfig";
import AddStudentToScheduleDialog from "./AddStudentToScheduleDialog";
import RecordResultDialog from "./RecordResultDialog";
import ConsentFormPage from "../consent-form/ConsentFormPage"; // Import ConsentFormPage
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import { isAdmin, isMedicalStaff } from "../../utils/roleUtils";

// Interface definitions
interface Student {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  className: string;
  dateOfBirth: string;
  gender: number;
  status: number;
  vaccinationDate?: string;
  hasResult: boolean;
}

interface SelectedStudent {
  id: string;
  studentName: string;
  campaignType?: number;
  studentId: string; // Add this field
}

interface Schedule {
  id: string;
  campaignId: string;
  scheduledDate: string;
  location: string;
  notes: string;
  status: number;
  campaignName?: string;
  campaignType?: number;
}

const ScheduleStudentsPage: React.FC = () => {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tabValue, setTabValue] = useState<number>(0);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] =
    useState<boolean>(false);
  const [isRecordResultDialogOpen, setIsRecordResultDialogOpen] =
    useState<boolean>(false);
  const [selectedStudentForResult, setSelectedStudentForResult] =
    useState<any>(null);
  const [isCreatingConsentForms, setIsCreatingConsentForms] =
    useState<boolean>(false);
  const [consentFormExists, setConsentFormExists] = useState<boolean>(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(
    null
  );
  const [deletingStudentName, setDeletingStudentName] = useState<string>("");
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] =
    useState<boolean>(false);
  const [statsData, setStatsData] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  // Thêm state mới cho dialog kiểm tra phiếu đồng ý
  const [isConsentFormDialogOpen, setIsConsentFormDialogOpen] =
    useState<boolean>(false);

  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Thêm state mới để kiểm soát dialog xác nhận
  const [confirmConsentDialogOpen, setConfirmConsentDialogOpen] =
    useState<boolean>(false);

  useEffect(() => {
    fetchScheduleDetails();
    fetchStudents();
  }, [scheduleId]);

  // Add a useEffect to check for existing consent forms
  useEffect(() => {
    if (schedule?.campaignId) {
      // Check if consent forms already exist for this campaign
      const checkExistingConsentForms = async () => {
        try {
          const response = await instance.get(
            `/api/ConsentForm/get-consent-forms-by-campaign-id/${schedule.campaignId}`
          );
          // If there are any consent forms for this campaign, set the flag
          if (response.data && response.data.length > 0) {
            setConsentFormExists(true);
          }
        } catch (error) {
          console.error("Error checking for existing consent forms:", error);
        }
      };

      checkExistingConsentForms();
    }
  }, [schedule?.campaignId]);

  useEffect(() => {
    // Update stats whenever students change
    const completed = students.filter((s) => s.hasResult).length;
    setStatsData({
      total: students.length,
      completed,
      pending: students.length - completed,
    });
  }, [students]);

  const fetchScheduleDetails = async () => {
    try {
      if (!scheduleId) return;

      // Truy vấn học sinh trong lịch
      const response = await instance.get(
        `/api/ScheduleDetail/get-schedule-details-by-schedule-id/${scheduleId}`
      );

      // Khởi tạo danh sách học sinh (có thể rỗng)
      const formattedStudents = response.data
        ? response.data.map((item: any) => ({
            id: item.id,
            studentId: item.studentId,
            studentName: item.student?.fullName || "N/A",
            studentCode: item.student?.studentCode || "N/A",
            className: item.student?.class || "N/A",
            dateOfBirth: item.student?.dateOfBirth || null,
            gender:
              item.student?.gender !== undefined ? item.student.gender : -1,
            status: item.vaccinationResult || item.healthCheckupResult ? 1 : 0,
            vaccinationDate: item.vaccinationDate,
            hasResult: !!item.vaccinationResult || !!item.healthCheckupResult,
          }))
        : [];

      setStudents(formattedStudents);
      setError(null); // Quan trọng: Luôn đặt error thành null

      // Khởi tạo thông tin lịch cơ bản
      const scheduleInfo = {
        id: scheduleId,
        campaignId: response.data[0]?.student?.campaignId || "",
        scheduledDate: response.data[0]?.vaccinationDate || "",
        location: "",
        notes: "",
        status: 0,
        campaignName: "",
        campaignType: 0,
      };

      setSchedule(scheduleInfo);

      // Luôn gọi API lấy thông tin lịch đầy đủ, bất kể có học sinh hay không
      fetchAdditionalScheduleInfo(scheduleId);
    } catch (err) {
      console.error("Error fetching schedule details:", err);
      // Không đặt error khi fetch thất bại
      setError(null); // Quan trọng: Đặt error thành null ngay cả khi có lỗi

      // Vẫn tiếp tục lấy thông tin lịch
      if (scheduleId) {
        fetchAdditionalScheduleInfo(scheduleId);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật hàm fetchAdditionalScheduleInfo
  const fetchAdditionalScheduleInfo = async (id: string) => {
    try {
      const response = await instance.get(
        `/api/Schedule/get-schedule-by-id/${id}`
      );

      if (response.data) {
        // Sử dụng campaignType từ API nếu có
        const scheduleInfo: Schedule = {
          id: response.data.id,
          campaignId: response.data.campaignId,
          campaignName: response.data.campaignName,
          scheduledDate: response.data.scheduledDate,
          location: response.data.location || "",
          notes: response.data.notes || "",
          status: 0,
          // Sử dụng campaignType từ API nếu có, không phụ thuộc vào tên
          campaignType:
            response.data.type !== undefined
              ? response.data.type
              : response.data.campaignName?.toLowerCase().includes("tiêm")
              ? 0
              : 1,
        };

        setSchedule(scheduleInfo);

        // Gọi API lấy thông tin campaign để có thông tin chính xác hơn
        if (scheduleInfo.campaignId) {
          fetchCampaignInfo(scheduleInfo.campaignId);
        }
      }
    } catch (err) {
      console.error("Error fetching additional schedule info:", err);
    }
  };

  // Cập nhật hàm fetchCampaignInfo để lấy campaignType chính xác
  const fetchCampaignInfo = async (campaignId: string) => {
    if (!campaignId) return;

    try {
      const response = await instance.get(
        `/api/Campaign/get-campaign-by-id/${campaignId}`
      );

      if (response.data) {
        // Cập nhật thông tin campaign vào schedule
        setSchedule((prev) =>
          prev
            ? {
                ...prev,
                campaignName:
                  response.data.name ||
                  response.data.title ||
                  "Chi tiết chương trình",
                // Ưu tiên sử dụng type từ API
                campaignType:
                  response.data.type !== undefined
                    ? response.data.type
                    : response.data.name?.toLowerCase().includes("tiêm")
                    ? 0
                    : 1,
              }
            : null
        );
      }
    } catch (err) {
      console.error("Error fetching campaign info:", err);
    }
  };
  const fetchStudents = async () => {
    try {
      if (!scheduleId) return;

      setLoading(true);
      const response = await instance.get(
        `/api/ScheduleDetail/get-schedule-details-by-schedule-id/${scheduleId}`
      );

      // Format the student data
      const formattedStudents = response.data
        ? response.data.map((item: any) => ({
            id: item.id,
            studentId: item.student?.id,
            studentName: item.student?.fullName || "N/A",
            studentCode: item.student?.studentCode || "N/A",
            className: item.student?.class || "N/A",
            dateOfBirth: item.student?.dateOfBirth || null,
            gender:
              item.student?.gender !== undefined ? item.student.gender : -1,
            status: item.vaccinationResult || item.healthCheckupResult ? 1 : 0,
            vaccinationDate: item.vaccinationDate,
            hasResult: !!item.vaccinationResult || !!item.healthCheckupResult,
          }))
        : [];

      // Sort students by studentCode
      formattedStudents.sort((a: Student, b: Student) => {
        const codeA = a.studentCode || "";
        const codeB = b.studentCode || "";

        return codeA.localeCompare(codeB, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      setStudents(formattedStudents);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);

      setStudents([]);
      setError(null); // Luôn đặt error thành null
    } finally {
      setLoading(false);
    }
  };

  // Handle search query change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Open menu
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Add student dialog functions
  const handleAddStudent = () => {
    setIsAddStudentDialogOpen(true);
  };

  // Thêm hàm mới để xử lý kiểm tra phiếu đồng ý
  const handleCheckConsentForms = () => {
    setIsConsentFormDialogOpen(true);
  };

  // Cập nhật hàm handleAddStudentSuccess để thêm timeout và retry
  const handleAddStudentSuccess = () => {
    // Hiển thị loading state ngay lập tức
    setLoading(true);

    // Đợi 1 giây để đảm bảo dữ liệu đã được cập nhật trên backend
    setTimeout(() => {
      fetchStudentsWithRetry();
    }, 1000);
  };

  // Thêm hàm mới để hỗ trợ retry nếu cần
  const fetchStudentsWithRetry = async (retries = 2) => {
    try {
      if (!scheduleId) return;

      const response = await instance.get(
        `/api/ScheduleDetail/get-schedule-details-by-schedule-id/${scheduleId}`
      );

      // Format the student data
      const formattedStudents = response.data
        ? response.data.map((item: any) => ({
            id: item.id,
            studentId: item.student?.id,
            studentName: item.student?.fullName || "N/A",
            studentCode: item.student?.studentCode || "N/A",
            className: item.student?.class || "N/A",
            dateOfBirth: item.student?.dateOfBirth || null,
            gender:
              item.student?.gender !== undefined ? item.student.gender : -1,
            status: item.vaccinationResult || item.healthCheckupResult ? 1 : 0,
            vaccinationDate: item.vaccinationDate,
            hasResult: !!item.vaccinationResult || !!item.healthCheckupResult,
          }))
        : [];

      // Sort students by studentCode
      formattedStudents.sort((a: Student, b: Student) => {
        const codeA = a.studentCode || "";
        const codeB = b.studentCode || "";

        return codeA.localeCompare(codeB, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      });

      // Cập nhật state với dữ liệu mới
      setStudents(formattedStudents);
      setError(null); // Quan trọng: Luôn đặt error thành null
    } catch (err) {
      console.error("Error fetching students:", err);

      // Thử lại nếu còn lượt retry
      if (retries > 0) {
        setTimeout(() => fetchStudentsWithRetry(retries - 1), 1000);
      } else {
        setStudents([]);
        setError(null); // Đảm bảo error luôn là null
      }
    } finally {
      setLoading(false);
    }
  };

  // Remove student functions
  const handleRemoveStudent = (studentId: string, studentName: string) => {
    setDeletingStudentId(studentId);
    setDeletingStudentName(studentName);
    setDeleteDialogOpen(true);
  };

  const confirmRemoveStudent = async () => {
    if (!deletingStudentId) return;

    try {
      await instance.delete(
        `/api/ScheduleDetail/delete-schedule-detail/${deletingStudentId}`
      );

      // Cập nhật danh sách học sinh
      fetchStudents();

      // Thông báo thành công
      toast.success("Xóa học sinh khỏi lịch thành công");
    } catch (err) {
      console.error("Error removing student:", err);
      toast.error("Không thể xóa học sinh. Vui lòng thử lại.");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingStudentId(null);
      setDeletingStudentName("");
    }
  };

  // Delete all students functions
  const handleDeleteAllStudents = () => {
    if (students.length === 0) {
      toast.warning("Không có học sinh nào để xóa");
      return;
    }
    setDeleteAllDialogOpen(true);
  };

  const confirmDeleteAllStudents = async () => {
    try {
      const promises = students.map((student) =>
        instance.delete(
          `/api/ScheduleDetail/delete-schedule-detail/${student.id}`
        )
      );

      await Promise.all(promises);

      // Xóa danh sách học sinh trong state
      setStudents([]);

      // Cập nhật thống kê - đảm bảo tất cả số đếm về 0
      setStatsData({
        total: 0,
        completed: 0,
        pending: 0,
      });

      toast.success(`Đã xóa tất cả ${students.length} học sinh khỏi lịch`);
    } catch (err) {
      console.error("Error removing all students:", err);
      toast.error("Không thể xóa tất cả học sinh. Vui lòng thử lại.");
    } finally {
      setDeleteAllDialogOpen(false);
    }
  };

  // Record result functions
  const handleRecordResult = (student: Student) => {
    // Add date check - compare the current date with the scheduled date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to start of day

    // Get the scheduled date and reset its time part for comparison
    const scheduledDate = new Date(schedule?.scheduledDate || "");
    scheduledDate.setHours(0, 0, 0, 0);

    // Check if today is the scheduled date
    if (scheduledDate.getTime() !== today.getTime()) {
      toast.warning(
        "Chỉ được phép ghi nhận kết quả vào đúng ngày diễn ra trong lịch"
      );
      return; // Stop here if the dates don't match
    }

    setSelectedStudentForResult({
      id: student.id,
      studentName: student.studentName,
      campaignType: schedule?.campaignType || 0,
      studentId: student.studentId, // Pass the studentId
    });

    setIsRecordResultDialogOpen(true);
  };

  const handleResultSuccess = () => {
    fetchStudents();
  };

  // Consent form functions
  const handleCreateConsentForms = async () => {
    if (students.length === 0) {
      toast.warning("Không có học sinh nào để tạo phiếu đồng ý");
      return;
    }

    // Kiểm tra chiến dịch
    if (!schedule || !schedule.campaignId) {
      toast.error("Không tìm thấy ID chiến dịch. Vui lòng kiểm tra lại.");
      return;
    }

    try {
      // Kiểm tra xem chiến dịch này đã có phiếu đồng ý nào chưa
      const existingConsentResponse = await instance.get(
        `/api/ConsentForm/get-consent-forms-by-campaign-id/${schedule.campaignId}`
      );

      // Nếu có phiếu đồng ý, kiểm tra chi tiết
      if (
        existingConsentResponse.data &&
        existingConsentResponse.data.length > 0
      ) {
        // Tạo map học sinh đã có phiếu đồng ý
        const existingConsents = new Map();
        existingConsentResponse.data.forEach((consent: any) => {
          existingConsents.set(consent.studentId, consent);
        });

        // Đếm số học sinh trong danh sách hiện tại đã có phiếu đồng ý
        let studentsWithExistingConsent = 0;
        for (const student of students) {
          if (student.studentId && existingConsents.has(student.studentId)) {
            studentsWithExistingConsent++;
          }
        }

        // Nếu tất cả học sinh đã có phiếu đồng ý, hiển thị thông báo và không tạo phiếu mới
        if (studentsWithExistingConsent === students.length) {
          toast.warning(
            "Tất cả học sinh đã có phiếu đồng ý cho chiến dịch này"
          );
          return;
        }

        // Nếu chỉ một phần đã có phiếu, hiển thị thông báo nhưng vẫn cho phép tiếp tục
        if (studentsWithExistingConsent > 0) {
          toast.info(
            `${studentsWithExistingConsent} học sinh đã có phiếu đồng ý và sẽ được bỏ qua`
          );
        }
      }

      // Mở dialog xác nhận
      setConfirmConsentDialogOpen(true);
    } catch (error) {
      console.error("Lỗi khi kiểm tra phiếu đồng ý hiện có:", error);
      toast.error("Không thể kiểm tra phiếu đồng ý hiện có. Vui lòng thử lại.");
    }
  };

  // Hàm xử lý khi người dùng xác nhận tạo phiếu
  const handleConfirmCreateConsent = () => {
    setConfirmConsentDialogOpen(false);
    createConsentForms();
  };

  // Thêm hàm mới để xử lý việc tạo phiếu đồng ý
  const createConsentForms = async () => {
    try {
      setIsCreatingConsentForms(true);

      if (!schedule || !schedule.campaignId) {
        toast.error("Không tìm thấy ID chiến dịch. Vui lòng kiểm tra lại.");
        return;
      }

      // Trước khi tạo phiếu đồng ý mới, kiểm tra những học sinh nào đã có phiếu
      const existingConsentResponse = await instance.get(
        `/api/ConsentForm/get-consent-forms-by-campaign-id/${schedule.campaignId}`
      );

      // Tạo map học sinh đã có phiếu đồng ý
      const existingConsents = new Map();
      if (existingConsentResponse.data) {
        existingConsentResponse.data.forEach((consent: any) => {
          existingConsents.set(consent.studentId, consent);
        });
      }

      // Sử dụng giá trị mặc định: mặc định là đồng ý
      const currentDate = new Date().toISOString();
      let successCount = 0;
      let skipCount = 0;

      for (const student of students) {
        // Kiểm tra studentId trước khi tạo request
        if (!student.studentId) {
          console.error(
            `Bỏ qua: Không tìm thấy ID cho học sinh ${
              student.studentName || "không xác định"
            }`
          );
          continue; // Bỏ qua học sinh này
        }

        // Kiểm tra xem học sinh đã có phiếu đồng ý chưa
        if (existingConsents.has(student.studentId)) {
          console.log(
            `Học sinh ${student.studentName} đã có phiếu đồng ý cho chiến dịch này`
          );
          skipCount++;
          continue; // Bỏ qua học sinh này
        }

        try {
          const requestBody = {
            campaignId: schedule.campaignId,
            studentId: student.studentId,
            isApproved: false, // Mặc định là không đồng ý
            consentDate: currentDate,
            reasonForDecline: "", // Không cần lý do vì mặc định đồng ý
          };

          console.log("Request body:", requestBody);

          await instance.post(
            "/api/ConsentForm/create-consent-form",
            requestBody
          );
          const notification = {
            campaignId: schedule.campaignId,
            incidientId: null,
          };
          await instance.post(
            "api/Notification/create-notification",
            notification
          );
          successCount++;
        } catch (err) {
          console.error(
            `Lỗi khi tạo phiếu đồng ý cho học sinh ${student.studentId}:`,
            err
          );
        }
      }

      if (skipCount > 0) {
        toast.info(
          `Đã bỏ qua ${skipCount} học sinh đã có phiếu đồng ý trước đó`
        );
      }

      if (successCount > 0) {
        toast.success(
          `Đã tạo ${successCount}/${
            students.length - skipCount
          } phiếu đồng ý cho học sinh`
        );
        setConsentFormExists(true);
      } else if (skipCount === students.length) {
        toast.warning("Tất cả học sinh đã có phiếu đồng ý cho chiến dịch này");
      } else {
        toast.error("Không thể tạo phiếu đồng ý. Vui lòng thử lại sau.");
      }
    } catch (error: any) {
      console.error("Lỗi khi tạo phiếu đồng ý:", error);
      toast.error(
        `Không thể tạo phiếu đồng ý: ${
          error.response?.data?.message || "Lỗi không xác định"
        }`
      );
    } finally {
      setIsCreatingConsentForms(false);
    }
  };

  // Filter students based on current tab and search query
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      student.studentName?.toLowerCase().includes(query) ||
      student.studentCode?.toLowerCase().includes(query) ||
      student.className?.toLowerCase().includes(query);

    if (tabValue === 0) return matchesSearch; // All students
    if (tabValue === 1) return matchesSearch && student.hasResult; // Completed
    if (tabValue === 2) return matchesSearch && !student.hasResult; // Pending

    return matchesSearch;
  });

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "N/A";
    }
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0:
        return "Nam";
      case 1:
        return "Nữ";
      default:
        return "Không xác định";
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3, mt: 2 }}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to="/vaccination"
          >
            Chương trình y tế
          </Link>
          {schedule?.campaignId && (
            <Link
              underline="hover"
              color="inherit"
              component={RouterLink}
              to={`/vaccination/${schedule.campaignId}`}
            >
              {schedule?.campaignName || "Chi tiết chương trình"}
            </Link>
          )}
          <Typography color="text.primary">Danh sách học sinh</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Danh sách học sinh -{" "}
            {schedule?.campaignType === 0
              ? "Lịch tiêm chủng"
              : "Lịch khám sức khỏe"}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Ngày: {formatDate(schedule?.scheduledDate || "")} | Địa điểm:{" "}
            {schedule?.location || "N/A"}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            // Điều hướng về trang chi tiết chương trình nếu có campaignId
            if (schedule?.campaignId) {
              navigate(`/vaccination/${schedule.campaignId}`);
            } else {
              // Nếu không có campaignId, quay lại trang trước đó
              navigate(-1);
            }
          }}
        >
          Quay lại
        </Button>
      </Box>

      {/* Add information alert about date restriction */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography>
          <strong>Lưu ý:</strong> Việc ghi nhận kết quả{" "}
          {schedule?.campaignType === 0 ? "tiêm chủng" : "khám sức khỏe"} chỉ
          được phép thực hiện vào đúng ngày diễn ra:{" "}
          {formatDate(schedule?.scheduledDate || "")}
        </Typography>
      </Alert>

      {/* Stats cards */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 3,
          mb: 3,
        }}
      >
        <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "0" } }}>
          <Card
            sx={{
              bgcolor: "rgba(41, 128, 185, 0.08)",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Tổng số học sinh
              </Typography>
              <Typography variant="h4" component="div" fontWeight="bold">
                {statsData.total}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "0" } }}>
          <Card
            sx={{
              bgcolor: "rgba(41, 128, 185, 0.08)",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Đã hoàn thành
              </Typography>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="success.main"
              >
                {statsData.completed}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: 1, minWidth: { xs: "100%", sm: "0" } }}>
          <Card
            sx={{
              bgcolor: "rgba(41, 128, 185, 0.08)",
              borderRadius: 2,
              height: "100%",
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Chưa thực hiện
              </Typography>
              <Typography
                variant="h4"
                component="div"
                fontWeight="bold"
                color="warning.main"
              >
                {statsData.pending}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Action bar */}
      <Paper
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, mr: 2 }}>
          <TextField
            placeholder="Tìm kiếm theo mã, tên hoặc lớp"
            variant="outlined"
            size="small"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {/* Cải thiện bố cục các nút thao tác */}
        {(isAdmin() || isMedicalStaff()) && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            {isAdmin() && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddStudent}
              >
                Thêm học sinh
              </Button>
            )}

            {isAdmin() && (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DescriptionIcon />}
                onClick={handleCreateConsentForms}
              >
                Tạo phiếu đồng ý
              </Button>
            )}

            {/* Nút mới: Kiểm tra phiếu đồng ý */}
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleCheckConsentForms}
            >
              Kiểm tra phiếu đồng ý
            </Button>

            {isAdmin() && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteAllStudents}
              >
                Xóa tất cả
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Tabs */}
      <Paper
        sx={{
          borderRadius: 2,
          mb: 3,
          boxShadow: 0,
          border: "1px solid rgba(41, 128, 185, 0.2)",
        }}
      >
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 2, pt: 1 }}>
          <Tab
            label={`Tất cả (${statsData.total})`}
            id="tab-0"
            aria-controls="tabpanel-0"
          />
          <Tab
            label={`Đã hoàn thành (${statsData.completed})`}
            id="tab-1"
            aria-controls="tabpanel-1"
          />
          <Tab
            label={`Chưa thực hiện (${statsData.pending})`}
            id="tab-2"
            aria-controls="tabpanel-2"
          />
        </Tabs>
      </Paper>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: "rgba(41, 128, 185, 0.08)" }}>
                <TableRow>
                  <TableCell>Mã học sinh</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Lớp</TableCell>
                  <TableCell>Giới tính</TableCell>
                  <TableCell>Ngày sinh</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  {(isAdmin() || isMedicalStaff()) && (
                    <TableCell align="center">Thao tác</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    // Check if today is the scheduled date
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const scheduledDate = new Date(
                      schedule?.scheduledDate || ""
                    );
                    scheduledDate.setHours(0, 0, 0, 0);
                    const isScheduledToday =
                      scheduledDate.getTime() === today.getTime();

                    return (
                      <TableRow
                        key={student.id}
                        hover
                        sx={{
                          backgroundColor: student.hasResult
                            ? "rgba(46, 125, 50, 0.04)" // Green tint for completed
                            : !isScheduledToday
                            ? "rgba(250, 250, 250, 1)" // Light gray for not today
                            : "inherit", // Default for pending on scheduled day
                        }}
                      >
                        <TableCell>{student.studentCode}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>{student.className}</TableCell>
                        <TableCell>{getGenderText(student.gender)}</TableCell>
                        <TableCell>{formatDate(student.dateOfBirth)}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={
                              student.hasResult
                                ? schedule?.campaignType === 0
                                  ? "Đã tiêm"
                                  : "Đã khám"
                                : isScheduledToday
                                ? "Có thể ghi nhận hôm nay"
                                : "Chưa thực hiện"
                            }
                            color={
                              student.hasResult
                                ? "success"
                                : isScheduledToday
                                ? "info"
                                : "warning"
                            }
                          />
                        </TableCell>
                        {(isAdmin() || isMedicalStaff()) && (
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              {/* Record result button - Available to both Admin and MedicalStaff */}
                              <Tooltip
                                title={
                                  !isScheduledToday
                                    ? "Chỉ được phép ghi nhận kết quả vào đúng ngày diễn ra trong lịch"
                                    : schedule?.campaignType === 0
                                    ? "Ghi nhận kết quả tiêm (chỉ được phép vào đúng ngày diễn ra)"
                                    : "Ghi nhận kết quả khám (chỉ được phép vào đúng ngày diễn ra)"
                                }
                              >
                                <span>
                                  {" "}
                                  {/* Wrapper to allow tooltip on disabled button */}
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleRecordResult(student)}
                                    disabled={!isScheduledToday}
                                  >
                                    <AssignmentIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>

                              {/* Delete button - Only for Admin */}
                              {isAdmin() && (
                                <Tooltip title="Xóa khỏi lịch">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() =>
                                      handleRemoveStudent(
                                        student.id,
                                        student.studentName
                                      )
                                    }
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box
                        sx={{
                          py: 4,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography variant="body1">
                          {error ? (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              <WarningIcon color="warning" />
                              {error}
                            </Box>
                          ) : searchQuery ? (
                            "Không tìm thấy học sinh phù hợp"
                          ) : (
                            "Chưa có học sinh nào trong lịch này"
                          )}
                        </Typography>

                        {!error && students.length === 0 && isAdmin() && (
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleAddStudent}
                            sx={{ mt: 1 }}
                          >
                            Thêm học sinh vào lịch
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Dialogs */}
      <AddStudentToScheduleDialog
        open={isAddStudentDialogOpen}
        onClose={() => setIsAddStudentDialogOpen(false)}
        onSuccess={handleAddStudentSuccess}
        scheduleId={scheduleId || ""}
        existingStudentIds={students.map((s) => s.studentId).filter(Boolean)}
        scheduleDate={schedule?.scheduledDate || new Date().toISOString()}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa học sinh
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <DeleteIcon color="error" sx={{ mr: 1.5 }} />
            <Typography id="delete-dialog-description">
              Bạn có chắc chắn muốn xóa học sinh{" "}
              <strong>{deletingStudentName}</strong> khỏi lịch tiêm này không?
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            color="primary"
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={confirmRemoveStudent}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            autoFocus
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <Dialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        aria-labelledby="delete-all-dialog-title"
      >
        <DialogTitle id="delete-all-dialog-title">
          {"Xác nhận xóa tất cả học sinh"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <DeleteIcon color="error" sx={{ mr: 1.5 }} />
            <Typography id="delete-all-dialog-description">
              Bạn có chắc chắn muốn xóa{" "}
              <strong>tất cả {students.length} học sinh</strong> khỏi lịch này
              không?
            </Typography>
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ color: "error.main" }}
          >
            Hành động này không thể hoàn tác và sẽ xóa toàn bộ học sinh đã thêm
            vào lịch.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteAllDialogOpen(false)}
            color="primary"
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={confirmDeleteAllStudents}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            autoFocus
          >
            Xóa tất cả
          </Button>
        </DialogActions>
      </Dialog>

      {/* Record Result Dialog */}
      {selectedStudentForResult && (
        <RecordResultDialog
          open={isRecordResultDialogOpen}
          onClose={() => setIsRecordResultDialogOpen(false)}
          onSuccess={handleResultSuccess}
          studentName={selectedStudentForResult.studentName}
          scheduleDetailId={selectedStudentForResult.id}
          campaignType={
            selectedStudentForResult.campaignType || schedule?.campaignType || 0
          }
          studentId={selectedStudentForResult.studentId} // Add this prop
        />
      )}

      {/* Confirm Consent Dialog */}
      <Dialog
        open={confirmConsentDialogOpen}
        onClose={() => setConfirmConsentDialogOpen(false)}
        aria-labelledby="consent-confirm-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="consent-confirm-dialog-title">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DescriptionIcon color="primary" />
            Xác nhận tạo phiếu đồng ý
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              Bạn có chắc chắn muốn tạo phiếu đồng ý cho{" "}
              <strong>{students.length} học sinh</strong> trong danh sách này
              không?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Hệ thống sẽ tự động tạo phiếu đồng ý với trạng thái "Chưa đồng ý"
              cho tất cả học sinh.
              {schedule?.campaignType === 0
                ? " Phụ huynh sẽ nhận được thông báo và cần xem xét phiếu đồng ý cho con em tham gia tiêm chủng."
                : " Phụ huynh sẽ nhận được thông báo và cần xem xét phiếu đồng ý cho con em tham gia khám sức khỏe."}
            </Typography>
            <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
              <strong>Lưu ý:</strong> Học sinh đã có phiếu đồng ý trong chiến
              dịch này sẽ được bỏ qua để đảm bảo mỗi học sinh chỉ có một phiếu
              đồng ý cho mỗi chiến dịch.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setConfirmConsentDialogOpen(false)}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={
              isCreatingConsentForms ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <DescriptionIcon />
              )
            }
            onClick={handleConfirmCreateConsent}
            disabled={isCreatingConsentForms}
            autoFocus
          >
            {isCreatingConsentForms ? "Đang xử lý..." : "Xác nhận tạo phiếu"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Consent Form Dialog */}
      <Dialog
        open={isConsentFormDialogOpen}
        onClose={() => setIsConsentFormDialogOpen(false)}
        aria-labelledby="consent-form-dialog-title"
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            height: "95vh",
            maxHeight: "95vh",
            width: "95%",
            maxWidth: "1800px",
            margin: "auto",
          },
        }}
      >
        <DialogTitle
          id="consent-form-dialog-title"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6">
              Phiếu Đồng Ý - {schedule?.campaignName || "Chương trình y tế"}
            </Typography>
          </Box>
          <Button
            onClick={() => setIsConsentFormDialogOpen(false)}
            variant="outlined"
            size="small"
          >
            Đóng
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: "auto" }}>
          {schedule?.campaignId && (
            <ConsentFormPage
              mode="admin"
              campaignId={schedule.campaignId}
              scheduleId={scheduleId}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ScheduleStudentsPage;
