import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";
import { ConsentForm } from "../../models/types";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ConsentFormPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [consentForms, setConsentForms] = useState<ConsentForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSchedule, setFilterSchedule] = useState<string>("");
  const [schedules, setSchedules] = useState<any[]>([]);
  
  // Detail dialog
  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<ConsentForm | null>(null);

  const fetchConsentForms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (user?.role === "Parent") {
        // Parent: Lấy students trước, sau đó lấy consent forms cho từng student
        const studentsResponse = await instance.get(`/api/Student/get-student-by-parent-id/${user.id}`);
        const students = Array.isArray(studentsResponse.data) ? studentsResponse.data : [];
        
        if (students.length === 0) {
          setConsentForms([]);
          return;
        }

        // Lấy consent forms cho tất cả students
        const consentFormPromises = students.map(student => 
          instance.get(`/api/ConsentForm/get-consent-forms-by-student-id/${student.id}`)
        );
        
        const consentFormResponses = await Promise.all(consentFormPromises);
        const allConsentForms = consentFormResponses.flatMap(response => 
          Array.isArray(response.data) ? response.data : []
        );
        
        setConsentForms(allConsentForms);
      } else {
        // Admin/MedicalStaff: Lấy tất cả consent forms
        const response = await instance.get("/api/ConsentForm/get-all-consent-forms");
        setConsentForms(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      console.error("Error fetching consent forms:", err);
      setError("Không thể tải danh sách phiếu đồng ý");
      toast.error("Không thể tải danh sách phiếu đồng ý");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConsentForms();
    if (user?.role === "Admin" || user?.role === "MedicalStaff") {
      fetchSchedules();
    }
  }, [fetchConsentForms, user?.role]);

  const fetchSchedules = async () => {
    try {
      const response = await instance.get("/api/Schedule/get-all-schedules");
      setSchedules(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
    }
  };

  const handleStatusUpdate = async (formId: string, newStatus: boolean, reason?: string) => {
    try {
      const updateData = {
        isApproved: newStatus,
        reasonForDecline: newStatus ? "" : reason,
        consentDate: new Date().toISOString()
      };

      await instance.put(`/api/ConsentForm/update-consent-form/${formId}`, updateData);
      
      toast.success(newStatus ? "Đã duyệt phiếu đồng ý" : "Đã từ chối phiếu đồng ý");
      fetchConsentForms();
      setDetailDialogOpen(false);
    } catch (err: any) {
      console.error("Error updating consent form:", err);
      toast.error("Không thể cập nhật trạng thái phiếu đồng ý");
    }
  };

  const getStatusColor = (isApproved?: boolean) => {
    if (isApproved === null || isApproved === undefined) return "default";
    return isApproved ? "success" : "error";
  };

  const getStatusText = (isApproved?: boolean) => {
    if (isApproved === null || isApproved === undefined) return "Chưa điền";
    return isApproved ? "Đồng ý" : "Từ chối";
  };

  const filteredForms = consentForms.filter(form => {
    const statusMatch = filterStatus === "all" || 
      (filterStatus === "pending" && (form.isApproved === null || form.isApproved === undefined)) ||
      (filterStatus === "approved" && form.isApproved === true) ||
      (filterStatus === "rejected" && form.isApproved === false);
    
    const scheduleMatch = !filterSchedule || form.scheduleId === filterSchedule;
    
    return statusMatch && scheduleMatch;
  });

  const handleViewDetail = (form: ConsentForm) => {
    setSelectedForm(form);
    setDetailDialogOpen(true);
  };

  const handleDeleteClick = (form: ConsentForm) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!formToDelete) return;

    try {
      await instance.delete(`/api/ConsentForm/delete-consent-form/${formToDelete.id}`);
      toast.success("Đã xóa phiếu đồng ý thành công");
      setDeleteDialogOpen(false);
      setFormToDelete(null);
      fetchConsentForms();
    } catch (err: any) {
      console.error("Error deleting consent form:", err);
      toast.error("Không thể xóa phiếu đồng ý. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Quản lý phiếu đồng ý
            </Typography>
            <Box display="flex" gap={2}>
              <Tooltip title="Làm mới">
                <IconButton onClick={fetchConsentForms}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Filters - Only for Admin and MedicalStaff */}
          {(user?.role === "Admin" || user?.role === "MedicalStaff") && (
            <Box sx={{ mb: 3 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Trạng thái"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="pending">Chưa điền</MenuItem>
                    <MenuItem value="approved">Đã đồng ý</MenuItem>
                    <MenuItem value="rejected">Đã từ chối</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Lịch tiêm/khám</InputLabel>
                  <Select
                    value={filterSchedule}
                    onChange={(e) => setFilterSchedule(e.target.value)}
                    label="Lịch tiêm/khám"
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {schedules.map((schedule) => (
                      <MenuItem key={schedule.id} value={schedule.id}>
                        {schedule.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Box>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Học sinh</TableCell>
                  <TableCell>Lịch tiêm/khám</TableCell>
                  {(user?.role === "Admin" || user?.role === "MedicalStaff") && (
                    <TableCell>Phụ huynh</TableCell>
                  )}
                  <TableCell>Ngày tiêm/khám</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Ngày cập nhật</TableCell>
                  <TableCell align="center">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredForms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={user?.role === "Parent" ? 6 : 7} align="center">
                      Không có phiếu đồng ý nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell>{form.studentName}</TableCell>
                      <TableCell>{form.scheduleName}</TableCell>
                      {(user?.role === "Admin" || user?.role === "MedicalStaff") && (
                        <TableCell>{form.parentName}</TableCell>
                      )}
                      <TableCell>
                        {form.vaccinationDate 
                          ? new Date(form.vaccinationDate).toLocaleDateString('vi-VN')
                          : "Chưa xác định"
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(form.isApproved)}
                          color={getStatusColor(form.isApproved)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(form.updatedAt).toLocaleDateString('vi-VN')}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Xem chi tiết">
                            <IconButton 
                              size="small" 
                              onClick={() => handleViewDetail(form)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          {(user?.role === "Admin" || user?.role === "MedicalStaff") && (
                            <Tooltip title="Xóa phiếu đồng ý">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteClick(form)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chi tiết phiếu đồng ý
        </DialogTitle>
        <DialogContent>
          {selectedForm && (
            <Box sx={{ pt: 2 }}>
              <Stack spacing={3}>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Học sinh
                    </Typography>
                    <Typography variant="body1">
                      {selectedForm.studentName}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phụ huynh
                    </Typography>
                    <Typography variant="body1">
                      {selectedForm.parentName}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Lịch tiêm/khám
                  </Typography>
                  <Typography variant="body1">
                    {selectedForm.scheduleName}
                  </Typography>
                </Box>

                {selectedForm.vaccineType && (
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Loại vaccine
                      </Typography>
                      <Typography variant="body1">
                        {selectedForm.vaccineType}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ngày tiêm/khám
                      </Typography>
                      <Typography variant="body1">
                        {selectedForm.vaccinationDate 
                          ? new Date(selectedForm.vaccinationDate).toLocaleDateString('vi-VN')
                          : "Chưa xác định"
                        }
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      label={getStatusText(selectedForm.isApproved)}
                      color={getStatusColor(selectedForm.isApproved)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày phản hồi
                    </Typography>
                    <Typography variant="body1">
                      {selectedForm.consentDate 
                        ? new Date(selectedForm.consentDate).toLocaleDateString('vi-VN')
                        : "Chưa phản hồi"
                      }
                    </Typography>
                  </Box>
                </Box>

                {selectedForm.reasonForDecline && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Lý do từ chối
                    </Typography>
                    <Typography variant="body1">
                      {selectedForm.reasonForDecline}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {user?.role === "Parent" && selectedForm && 
           (selectedForm.isApproved === null || selectedForm.isApproved === undefined) && (
            <>
              <Button
                variant="contained"
                color="success"
                onClick={() => navigate(`/consent-form/${selectedForm.id}`)}
              >
                Điền phiếu đồng ý
              </Button>
            </>
          )}
          <Button onClick={() => setDetailDialogOpen(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Xác nhận xóa phiếu đồng ý
        </DialogTitle>
        <DialogContent>
          {formToDelete && (
            <Typography>
              Bạn có chắc chắn muốn xóa phiếu đồng ý của học sinh{" "}
              <strong>{formToDelete.studentName}</strong> cho lịch{" "}
              <strong>{formToDelete.scheduleName}</strong>?
            </Typography>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Hành động này không thể hoàn tác!
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Hủy
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsentFormPage;
