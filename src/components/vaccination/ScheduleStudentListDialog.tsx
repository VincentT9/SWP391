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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { format } from "date-fns";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import AddStudentToScheduleDialog from "./AddStudentToScheduleDialog";

interface ScheduleStudentListDialogProps {
  open: boolean;
  onClose: () => void;
  schedule: any;
  campaignType: number; // 0 cho tiêm chủng, 1 cho khám sức khỏe
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

  // Add these state variables at the top of your component, after other useState declarations
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(
    null
  );
  const [deletingStudentName, setDeletingStudentName] = useState<string>("");

  // Add these new state variables next to other state variables
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);

  // Fetch danh sách học sinh trong lịch
  useEffect(() => {
    if (open && schedule) {
      fetchStudents();
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
            status: item.vaccinationResult ? 1 : 0, // 1 = completed, 0 = not done
            vaccinationDate: item.vaccinationDate,
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
      setError("Không thể tải danh sách học sinh. Vui lòng thử lại sau.");
      setStudents([]);
    } finally {
      setLoading(false);
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
                backgroundColor: "#f5f5f5",
                padding: "8px 16px",
                borderRadius: "4px",
                mb: 2,
                alignItems: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "medium", color: "#3f51b5" }}
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
                {students.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteAllStudents}
                  >
                    Xóa tất cả
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAddIcon />}
                  onClick={handleAddStudent}
                >
                  Thêm học sinh
                </Button>
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
                                student.status === 1
                                  ? "Đã hoàn thành"
                                  : "Chưa thực hiện"
                              }
                              color={
                                student.status === 1 ? "success" : "warning"
                              }
                            />
                          </TableCell>
                          <TableCell align="center">
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
        existingStudentIds={students.map((student) => student.studentId)} // Pass student IDs of existing students
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
    </>
  );
};

export default ScheduleStudentListDialog;
