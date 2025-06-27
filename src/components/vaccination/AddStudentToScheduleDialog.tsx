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

interface AddStudentToScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  scheduleId: string;
}

const AddStudentToScheduleDialog: React.FC<AddStudentToScheduleDialogProps> = ({
  open,
  onClose,
  onSuccess,
  scheduleId,
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

      // API để lấy danh sách học sinh chưa được đăng ký vào lịch này
      const response = await instance.get(
        `/api/Student/get-unassigned-students/${scheduleId}`
      );

      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching available students:", err);
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

      await instance.post(
        `/api/Schedule/add-students-to-schedule/${scheduleId}`,
        {
          studentIds: selectedStudents,
        }
      );

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
                      <TableCell>{formatDate(student.dateOfBirth)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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
