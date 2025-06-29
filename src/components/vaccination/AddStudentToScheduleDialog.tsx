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
  CircularProgress,
  Alert,
  Checkbox,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import instance from "../../utils/axiosConfig";
import { format } from "date-fns";

// First, update the props interface to accept existing student IDs
interface AddStudentToScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  scheduleId: string;
  existingStudentIds?: string[]; // New prop to receive existing student IDs
}

const AddStudentToScheduleDialog: React.FC<AddStudentToScheduleDialogProps> = ({
  open,
  onClose,
  onSuccess,
  scheduleId,
  existingStudentIds = [], // Default to empty array if not provided
}) => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchAvailableStudents();
    } else {
      // Reset state when dialog closes
      setSelectedStudents([]);
      setSearchQuery("");
    }
  }, [open]);

  const fetchAvailableStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Using the API endpoint to get all students
      const response = await instance.get("/api/Student/get-all-students");

      // Map response data to expected structure with correct field names
      const allStudents = Array.isArray(response.data)
        ? response.data.map((student) => ({
            id: student.id,
            studentName: student.fullName,
            studentCode: student.studentCode,
            className: student.class,
            dateOfBirth: student.dateOfBirth,
            gender: student.gender,
          }))
        : [];

      // Filter out students that are already in the schedule
      const availableStudents = allStudents.filter(
        (student) => !existingStudentIds.includes(student.id)
      );

      setStudents(availableStudents);

      // Show message if all students have already been added
      if (allStudents.length > 0 && availableStudents.length === 0) {
        setError("Tất cả học sinh đã được thêm vào lịch này.");
      }
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

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((student) => student.id));
    }
  };

  const handleAddStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một học sinh");
      return;
    }

    try {
      setSubmitting(true);

      // Create an array of promises for all API calls
      const promises = selectedStudents.map(async (studentId) => {
        const requestBody = {
          studentId: studentId,
          scheduleId: scheduleId,
          vaccinationDate: new Date().toISOString(),
        };

        return instance.post(
          "/api/ScheduleDetail/create-schedule-detail",
          requestBody
        );
      });

      // Execute all requests in parallel
      await Promise.all(promises);

      toast.success(
        `Đã thêm ${selectedStudents.length} học sinh vào lịch thành công`
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adding students to schedule:", err);
      toast.error("Không thể thêm học sinh vào lịch. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // Lọc học sinh theo từ khóa tìm kiếm
  const filteredStudents = students.filter(
    (student) =>
      student.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.className?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Thêm học sinh vào lịch</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm học sinh theo tên, mã học sinh hoặc lớp"
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
          />
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
          <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedStudents.length > 0 &&
                        selectedStudents.length < filteredStudents.length
                      }
                      checked={
                        filteredStudents.length > 0 &&
                        selectedStudents.length === filteredStudents.length
                      }
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Mã học sinh</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Họ và tên</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Lớp</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Giới tính</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Ngày sinh</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      hover
                      selected={selectedStudents.includes(student.id)}
                      onClick={() => handleSelectStudent(student.id)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                        />
                      </TableCell>
                      <TableCell>{student.studentCode}</TableCell>
                      <TableCell>{student.studentName}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{formatGender(student.gender)}</TableCell>
                      <TableCell>{formatDate(student.dateOfBirth)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        {searchQuery
                          ? "Không tìm thấy học sinh phù hợp"
                          : "Không có học sinh khả dụng"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Typography variant="subtitle2" sx={{ flexGrow: 1, pl: 2 }}>
          Đã chọn {selectedStudents.length} học sinh
        </Typography>
        <Button onClick={onClose} disabled={submitting}>
          Hủy
        </Button>
        <Button
          onClick={handleAddStudents}
          variant="contained"
          color="primary"
          disabled={selectedStudents.length === 0 || submitting}
        >
          {submitting ? "Đang xử lý..." : "Thêm học sinh"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentToScheduleDialog;
