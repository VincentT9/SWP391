import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Alert,
  FormControlLabel,
  Radio,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import { format } from "date-fns";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import AddStudentToScheduleDialog from "./AddStudentToScheduleDialog";
import RecordResultDialog from "./RecordResultDialog";
import { AxiosError } from "axios";
import { isAdmin, isMedicalStaff } from "../../utils/roleUtils";

interface ScheduleStudentListDialogProps {
  open: boolean;
  onClose: () => void;
  schedule: any;
  campaignType: number; // 0 cho tiêm chủng, 1 cho khám sức khỏe
}

interface SelectedStudent {
  id: string;
  studentName: string;
  studentId: string; // Add this field
}

const ScheduleStudentListDialog: React.FC<ScheduleStudentListDialogProps> = ({
  open,
  onClose,
  schedule,
  campaignType,
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isRecordResultDialogOpen, setIsRecordResultDialogOpen] =
    useState(false);
  const [selectedStudentForResult, setSelectedStudentForResult] =
    useState<any>(null);

  // Add these state variables to track dialog open state and selected student
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(
    null
  );
  const [deletingStudentName, setDeletingStudentName] = useState<string>("");

  // Add these new state variables next to other state variables
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  // Thêm các state để quản lý việc tạo mẫu đồng ý
  const [consentFormDialogOpen, setConsentFormDialogOpen] = useState(false);
  const [isCreatingConsentForms, setIsCreatingConsentForms] = useState(false);
  const [consentFormData, setConsentFormData] = useState({
    isApproved: "false", // Mặc định là false
    consentDate: new Date().toISOString().split("T")[0],
    reasonForDecline: "",
  });

  // Thêm state để theo dõi trạng thái phiếu đồng ý
  const [consentFormExists, setConsentFormExists] = useState(false);

  // Fetch danh sách học sinh trong lịch
  useEffect(() => {
    if (open && schedule) {
      fetchStudents();
      checkExistingConsentForms();
    }
  }, [open, schedule]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the API endpoint to get students assigned to this schedule
      const response = await instance.get(
        `/api/ScheduleDetail/get-schedule-details-by-schedule-id/${schedule.id}`
      );

      // Map the response data to match the expected structure
      const formattedStudents = Array.isArray(response.data)
        ? response.data.map((item) => ({
            id: item.id, // This is the schedule detail ID
            studentId: item.student.id, // The actual student ID
            studentName: item.student.fullName,
            studentCode: item.student.studentCode,
            className: item.student.class,
            dateOfBirth: item.student.dateOfBirth,
            gender: item.student.gender,
            status: item.vaccinationResult || item.healthCheckupResult ? 1 : 0, // 1 = completed, 0 = not done
            vaccinationDate: item.vaccinationDate,
            hasResult: !!item.vaccinationResult || !!item.healthCheckupResult,
          }))
        : [];

      // Sort students by studentCode
      formattedStudents.sort((a, b) => {
        // Extract numeric part if student codes are in format "STUxxx"
        const codeA = a.studentCode || "";
        const codeB = b.studentCode || "";

        return codeA.localeCompare(codeB, undefined, {
          numeric: true, // Use numeric collation so "STU2" comes before "STU10"
          sensitivity: "base",
        });
      });

      setStudents(formattedStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
      // setError("Không thể tải danh sách học sinh. Vui lòng thử lại sau.");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra phiếu đồng ý đã tồn tại chưa
  const checkExistingConsentForms = async () => {
    try {
      if (!schedule || !schedule.campaignId) return;

      const campaignId = schedule.campaignId;

      // Gọi API để kiểm tra phiếu đồng ý
      const response = await instance.get(
        `/api/ConsentForm/check-consent-forms-by-campaign/${campaignId}`
      );

      // Nếu API trả về dữ liệu cho biết đã có phiếu đồng ý
      if (response.data && response.data.exists === true) {
        setConsentFormExists(true);
      } else {
        setConsentFormExists(false);
      }
    } catch (error) {
      console.error("Error checking existing consent forms:", error);
      // Giả định rằng không có lỗi nghĩa là không có phiếu đồng ý
      setConsentFormExists(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleAddStudent = () => {
    setIsAddStudentDialogOpen(true);
  };

  const handleAddStudentSuccess = () => {
    // Refresh danh sách học sinh sau khi thêm
    fetchStudents();
  };

  // Replace the handleRemoveStudent function with this improved version
  const handleRemoveStudent = (studentId: string, studentName: string) => {
    setDeletingStudentId(studentId);
    setDeletingStudentName(studentName);
    setDeleteDialogOpen(true);
  };

  // Add this new function to perform the actual deletion
  const confirmRemoveStudent = async () => {
    if (!deletingStudentId) return;

    try {
      // Using the correct API endpoint for schedule detail deletion
      await instance.delete(
        `/api/ScheduleDetail/delete-schedule-detail/${deletingStudentId}`
      );
      toast.success("Xóa học sinh khỏi lịch thành công");
      fetchStudents(); // Refresh the list
    } catch (err) {
      console.error("Error removing student:", err);
      toast.error("Không thể xóa học sinh. Vui lòng thử lại.");
    } finally {
      // Close the dialog and reset state
      setDeleteDialogOpen(false);
      setDeletingStudentId(null);
      setDeletingStudentName("");
    }
  };

  // Add this new function to handle deleting all students
  const handleDeleteAllStudents = () => {
    if (students.length === 0) {
      toast.warning("Không có học sinh nào để xóa");
      return;
    }
    setDeleteAllDialogOpen(true);
  };

  // Add this function to perform the actual deletion of all students
  const confirmDeleteAllStudents = async () => {
    try {
      // If there's a bulk delete endpoint, use it
      // Otherwise, delete each student one by one
      const promises = students.map((student) =>
        instance.delete(
          `/api/ScheduleDetail/delete-schedule-detail/${student.id}`
        )
      );

      await Promise.all(promises);

      toast.success(`Đã xóa tất cả ${students.length} học sinh khỏi lịch`);
      setStudents([]);
    } catch (err) {
      console.error("Error removing all students:", err);
      toast.error("Không thể xóa tất cả học sinh. Vui lòng thử lại.");
    } finally {
      setDeleteAllDialogOpen(false);
    }
  };

  // Lọc học sinh theo từ khóa tìm kiếm - cập nhật để tìm theo mã học sinh, tên hoặc lớp
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      student.studentName?.toLowerCase().includes(query) ||
      student.studentCode?.toLowerCase().includes(query) ||
      student.className?.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatGender = (gender: number) => {
    switch (gender) {
      case 0:
        return "Nữ";
      case 1:
        return "Nam";
      default:
        return "Khác";
    }
  };

  // Add this function to handle opening the result dialog
  const handleRecordResult = (student: any) => {
    setSelectedStudentForResult({
      id: student.id,
      studentName: student.studentName,
      studentId: student.studentId, // Include studentId
    });
    setIsRecordResultDialogOpen(true);
  };

  // Add this function to handle result submission success
  const handleResultSuccess = () => {
    // Refresh the student list to show updated status
    fetchStudents();
  };

  // Hàm mở dialog tạo phiếu đồng ý
  const handleCreateConsentForms = async () => {
    if (students.length === 0) {
      toast.warning("Không có học sinh nào để tạo phiếu đồng ý");
      return;
    }

    // Kiểm tra nếu đã tạo phiếu đồng ý rồi
    if (consentFormExists) {
      toast.warning(
        "Phiếu đồng ý đã được tạo cho chiến dịch này. Không thể tạo lại."
      );
      return;
    }

    try {
      setIsCreatingConsentForms(true);

      // Lấy campaignId từ schedule
      const campaignId = schedule.campaignId;

      // Kiểm tra campaignId
      if (!campaignId) {
        toast.error("Không tìm thấy ID chiến dịch. Vui lòng kiểm tra lại.");
        return;
      }

      const notification = {
        campaignId: campaignId,
        incidientId: null,
      };
      await instance.post("api/Notification/create-notification", notification);
      // Hiển thị toast thông báo đang tạo
      toast.info("Đang tạo phiếu đồng ý cho các học sinh...");

      let successCount = 0;
      let existingCount = 0;

      // Xử lý từng học sinh - sử dụng giá trị mặc định
      for (const student of students) {
        try {
          const requestBody = {
            campaignId: campaignId,
            studentId: student.studentId,
            isApproved: false, // Sử dụng giá trị mặc định là false
            consentDate: new Date().toISOString(),
            reasonForDecline: "", // Không có lý do từ chối mặc định
          };

          await instance.post(
            "/api/ConsentForm/create-consent-form",
            requestBody
          );

          successCount++;
        } catch (err: any) {
          // Kiểm tra nếu lỗi là do đã tồn tại phiếu đồng ý
          if (
            err?.response?.status === 400 &&
            err?.response?.data?.message?.includes("đã tồn tại")
          ) {
            existingCount++;
          } else {
            console.error(
              `Lỗi khi tạo phiếu đồng ý cho học sinh ${student.studentId}:`,
              err
            );
          }
        }
      }

      if (successCount > 0) {
        toast.success(
          `Đã tạo ${successCount}/${students.length} phiếu đồng ý chos học sinh`
        );
        // Cập nhật trạng thái để biết rằng đã có phiếu đồng ý
        setConsentFormExists(true);
      } else if (existingCount > 0) {
        toast.warning(
          `${existingCount} học sinh đã có phiếu đồng ý từ trước. Không thể tạo lại.`
        );
        setConsentFormExists(true);
      } else {
        toast.error(
          "Không thể tạo phiếu đồng ý. Vui lòng kiểm tra lại thông tin."
        );
      }
    } catch (error: unknown) {
      console.error("Lỗi khi tạo phiếu đồng ý:", error);

      // Xử lý hiển thị lỗi
      const err = error as any;
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response?.data
      ) {
        console.error("Chi tiết lỗi API:", err.response.data);
        const errorMessage =
          err.response.data.message || (err.message ? String(err.message) : "");
        toast.error(`Không thể tạo phiếu đồng ý: ${errorMessage}`);
      } else {
        toast.error("Không thể tạo phiếu đồng ý. Vui lòng thử lại.");
      }
    } finally {
      setIsCreatingConsentForms(false);
    }
  };

  // Hàm xử lý thay đổi giá trị trong form đồng ý
  const handleConsentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConsentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xác nhận và gửi request tạo phiếu đồng ý
  const confirmCreateConsentForms = async () => {
    try {
      setIsCreatingConsentForms(true);

      // Lấy campaignId từ schedule
      const campaignId = schedule.campaignId;

      // Kiểm tra campaignId
      if (!campaignId) {
        toast.error("Không tìm thấy ID chiến dịch. Vui lòng kiểm tra lại.");
        return;
      }

      // Chuyển đổi giá trị isApproved
      let isApproved: boolean = false;
      if (consentFormData.isApproved === "true") isApproved = true;

      // Đếm số phiếu tạo thành công
      let successCount = 0;

      // Xử lý từng học sinh
      for (const student of students) {
        try {
          const requestBody = {
            campaignId: campaignId,
            studentId: student.studentId,
            isApproved: isApproved,
            consentDate: new Date(consentFormData.consentDate).toISOString(),
            reasonForDecline:
              consentFormData.isApproved === "false" &&
              consentFormData.reasonForDecline
                ? consentFormData.reasonForDecline
                : "",
          };

          await instance.post(
            "/api/ConsentForm/create-consent-form",
            requestBody
          );

          successCount++;
        } catch (err) {
          console.error(
            `Lỗi khi tạo phiếu đồng ý cho học sinh ${student.studentId}:`,
            err
          );
        }
      }

      if (successCount > 0) {
        toast.success(
          `Đã tạo ${successCount}/${students.length} phiếu đồng ý cho học sinh`
        );
        setConsentFormDialogOpen(false);
      } else {
        toast.error(
          "Không thể tạo phiếu đồng ý. Vui lòng kiểm tra lại thông tin."
        );
      }
    } catch (error: unknown) {
      console.error("Lỗi khi tạo phiếu đồng ý:", error);

      // Xử lý hiển thị lỗi
      const err = error as any;
      if (
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response?.data
      ) {
        console.error("Chi tiết lỗi API:", err.response.data);
        const errorMessage =
          err.response.data.message || (err.message ? String(err.message) : "");
        toast.error(`Không thể tạo phiếu đồng ý: ${errorMessage}`);
      } else {
        toast.error("Không thể tạo phiếu đồng ý. Vui lòng thử lại.");
      }
    } finally {
      setIsCreatingConsentForms(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">
              Danh sách học sinh -{" "}
              {campaignType === 0 ? "Lịch tiêm chủng" : "Lịch khám sức khỏe"}
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <span>&times;</span>
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="subtitle1">
                <strong>Ngày:</strong> {formatDate(schedule?.scheduledDate)} |
                <strong> Địa điểm:</strong> {schedule?.location} |
                <strong> Ghi chú:</strong> {schedule?.notes || "Không có"}
              </Typography>
            </Box>

            {/* Add this box to show student count */}
            <Box
              sx={{
                display: "flex",
                backgroundColor: "rgba(41, 128, 185, 0.05)",
                padding: "8px 16px",
                borderRadius: "4px",
                mb: 2,
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "medium", color: "#2980b9" }}
              >
                Tổng số học sinh: <strong>{students.length}</strong>
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <TextField
                placeholder="Tìm kiếm theo mã, tên học sinh hoặc lớp..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ width: "350px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                {students.length > 0 && isAdmin() && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={
                      isCreatingConsentForms ? (
                        <CircularProgress size={20} />
                      ) : (
                        <DescriptionIcon />
                      )
                    }
                    onClick={handleCreateConsentForms}
                    disabled={
                      consentFormExists ||
                      isCreatingConsentForms ||
                      students.length === 0
                    }
                    sx={{ mr: 1 }}
                  >
                    {isCreatingConsentForms
                      ? "Đang tạo phiếu..."
                      : consentFormExists
                      ? "Đã tạo phiếu đồng ý"
                      : "Tạo phiếu đồng ý"}
                  </Button>
                )}

                {students.length > 0 && isAdmin() && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteAllStudents}
                  >
                    Xóa tất cả
                  </Button>
                )}
                {isAdmin() && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={handleAddStudent}
                  >
                    Thêm học sinh
                  </Button>
                )}
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Mã học sinh
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Họ tên</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Lớp</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Giới tính
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Ngày sinh
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Trạng thái
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }} align="center">
                        Thao tác
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>{student.studentCode}</TableCell>
                          <TableCell>{student.studentName}</TableCell>
                          <TableCell>{student.className || "N/A"}</TableCell>
                          <TableCell>{formatGender(student.gender)}</TableCell>
                          <TableCell>
                            {student.dateOfBirth
                              ? formatDate(student.dateOfBirth)
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={
                                student.hasResult
                                  ? campaignType === 0
                                    ? "Đã tiêm"
                                    : "Đã khám"
                                  : "Chưa thực hiện"
                              }
                              color={student.hasResult ? "success" : "warning"}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              {/* Record result button */}
                              <Tooltip
                                title={
                                  campaignType === 0
                                    ? "Ghi nhận kết quả tiêm"
                                    : "Ghi nhận kết quả khám"
                                }
                              >
                                <IconButton
                                  size="small"
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRecordResult(student);
                                  }}
                                >
                                  <AssignmentIcon />
                                </IconButton>
                              </Tooltip>

                              {/* Delete button - Only for Admin */}
                              {isAdmin() && (
                                <Tooltip title="Xóa khỏi lịch">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveStudent(
                                        student.id,
                                        student.studentName
                                      );
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body1" sx={{ py: 2 }}>
                            {searchQuery
                              ? "Không tìm thấy học sinh phù hợp"
                              : "Chưa có học sinh nào trong lịch này"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thêm dialog thêm học sinh */}
      <AddStudentToScheduleDialog
        open={isAddStudentDialogOpen}
        onClose={() => setIsAddStudentDialogOpen(false)}
        onSuccess={handleAddStudentSuccess}
        scheduleId={schedule?.id}
        existingStudentIds={students.map((s) => s.studentId).filter(Boolean)}
        scheduleDate={
          schedule?.vaccinationDate ||
          schedule?.scheduledDate ||
          new Date().toISOString()
        }
      />

      {/* Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title" sx={{ pb: 1 }}>
          {"Xác nhận xóa học sinh"}
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
        aria-describedby="delete-all-dialog-description"
      >
        <DialogTitle id="delete-all-dialog-title" sx={{ pb: 1 }}>
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
          campaignType={campaignType}
          studentId={selectedStudentForResult.studentId} // Add this prop
        />
      )}

      {/* Dialog tạo phiếu đồng ý */}
      <Dialog
        open={consentFormDialogOpen}
        onClose={() => setConsentFormDialogOpen(false)}
        aria-labelledby="consent-form-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: "40vh",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle id="consent-form-dialog-title">
          Tạo phiếu đồng ý cho {students.length} học sinh
        </DialogTitle>
        <DialogContent sx={{ overflow: "auto" }}>
          <Box sx={{ pt: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Thông tin phiếu đồng ý
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Trạng thái phê duyệt
              </Typography>
              <Box sx={{ display: "flex", gap: 3 }}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={consentFormData.isApproved === "false"}
                      onChange={handleConsentFormChange}
                      name="isApproved"
                      value="false"
                    />
                  }
                  label="Không đồng ý"
                />
                <FormControlLabel
                  control={
                    <Radio
                      checked={consentFormData.isApproved === "true"}
                      onChange={handleConsentFormChange}
                      name="isApproved"
                      value="true"
                    />
                  }
                  label="Đồng ý"
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Ngày tạo phiếu"
                type="date"
                name="consentDate"
                value={consentFormData.consentDate}
                onChange={handleConsentFormChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
              />
            </Box>

            {consentFormData.isApproved === "false" && (
              <Box sx={{ mb: 2 }}>
                <TextField
                  label="Lý do từ chối"
                  name="reasonForDecline"
                  value={consentFormData.reasonForDecline}
                  onChange={handleConsentFormChange}
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                />
              </Box>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Thông tin này sẽ được áp dụng cho tất cả {students.length} học
              sinh trong danh sách.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConsentFormDialogOpen(false)}
            color="primary"
            variant="outlined"
            disabled={isCreatingConsentForms}
          >
            Hủy
          </Button>
          <Button
            onClick={confirmCreateConsentForms}
            color="primary"
            variant="contained"
            startIcon={
              isCreatingConsentForms ? (
                <CircularProgress size={20} />
              ) : (
                <DescriptionIcon />
              )
            }
            disabled={isCreatingConsentForms}
          >
            {isCreatingConsentForms ? "Đang tạo..." : "Tạo phiếu đồng ý"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScheduleStudentListDialog;
