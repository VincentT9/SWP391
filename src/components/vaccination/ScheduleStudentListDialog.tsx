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

      // API có thể khác nhau tùy vào loại chiến dịch
      const response = await instance.get(
        `/api/Schedule/get-students-by-schedule/${schedule.id}`
      );

      setStudents(Array.isArray(response.data) ? response.data : []);
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

  const handleRemoveStudent = async (studentId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa học sinh này khỏi lịch?")) {
      return;
    }

    try {
      await instance.delete(
        `/api/Schedule/remove-student-from-schedule/${schedule.id}/${studentId}`
      );
      toast.success("Xóa học sinh khỏi lịch thành công");
      fetchStudents(); // Refresh list
    } catch (err) {
      console.error("Error removing student:", err);
      toast.error("Không thể xóa học sinh. Vui lòng thử lại.");
    }
  };

  // Lọc học sinh theo từ khóa tìm kiếm
  const filteredStudents = students.filter(
    (student) =>
      student.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(searchQuery.toLowerCase())
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

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <TextField
                placeholder="Tìm kiếm học sinh..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ width: "300px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={handleAddStudent}
              >
                Thêm học sinh
              </Button>
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
                        ID học sinh
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Họ tên</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Lớp</TableCell>
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
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>{student.studentName}</TableCell>
                          <TableCell>{student.className || "N/A"}</TableCell>
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
                                  handleRemoveStudent(student.studentId)
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
                        <TableCell colSpan={6} align="center">
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
      />
    </>
  );
};

export default ScheduleStudentListDialog;
