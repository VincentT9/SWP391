import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";
import { ConsentForm } from "../../models/types";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const ConsentFormTicket: React.FC = () => {
  const { user } = useAuth();
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  
  const [consentForm, setConsentForm] = useState<ConsentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Confirmation dialog states
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"approve" | "reject" | null>(null);
  const [reasonForDecline, setReasonForDecline] = useState("");

  const fetchConsentForm = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await instance.get(`/api/ConsentForm/get-consent-form-by-id/${formId}`);
      setConsentForm(response.data);
      
      // Check if current user is authorized to view this form
      if (user?.role === "Parent" && response.data.parentId !== user.id) {
        setError("Bạn không có quyền xem phiếu đồng ý này");
        return;
      }
    } catch (err: any) {
      console.error("Error fetching consent form:", err);
      setError("Không thể tải thông tin phiếu đồng ý");
    } finally {
      setLoading(false);
    }
  }, [formId, user]);

  // Function to send notification to admin/medical staff
  const sendNotificationToStaff = async (form: ConsentForm, isApproved: boolean) => {
    try {
      const notificationData = {
        recipientId: null, // Send to all admin/medical staff
        title: `Phản hồi phiếu đồng ý từ phụ huynh`,
        message: `Phụ huynh đã ${isApproved ? 'đồng ý' : 'từ chối'} phiếu đồng ý tiêm chủng/khám sức khỏe cho học sinh: ${form.studentName}`,
        type: "CONSENT_FORM_RESPONSE",
        returnUrl: `/consent-forms`,
        data: {
          consentFormId: form.id,
          studentId: form.studentId,
          studentName: form.studentName,
          isApproved: isApproved,
          parentResponse: true
        }
      };

      await instance.post("/api/Notification/send", notificationData);
      console.log("Successfully sent notification to staff");
    } catch (error) {
      console.error("Error sending notification to staff:", error);
      // Don't throw error to not interrupt the main flow
    }
  };

  useEffect(() => {
    if (formId) {
      fetchConsentForm();
    }
  }, [formId, fetchConsentForm]);

  const handleActionClick = (action: "approve" | "reject") => {
    // Check if form is already submitted
    if (consentForm?.isApproved !== null && consentForm?.isApproved !== undefined) {
      toast.warning("Phiếu đồng ý này đã được xử lý");
      return;
    }
    
    setSelectedAction(action);
    setReasonForDecline("");
    setConfirmDialogOpen(true);
  };

  const handleSubmitResponse = async () => {
    if (!selectedAction || !consentForm) return;
    
    if (selectedAction === "reject" && !reasonForDecline.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }
    
    try {
      setSubmitting(true);
      
      const responseData = {
        isApproved: selectedAction === "approve",
        reasonForDecline: selectedAction === "reject" ? reasonForDecline : "",
        responseDate: new Date().toISOString()
      };

      await instance.put(`/api/ConsentForm/update-consent-form/${formId}`, responseData);
      
      // Send notification to admin/medical staff
      await sendNotificationToStaff(consentForm, selectedAction === "approve");
      
      toast.success(
        selectedAction === "approve" 
          ? "Đã gửi phản hồi đồng ý thành công!" 
          : "Đã gửi phản hồi từ chối thành công!"
      );
      
      // Refresh form data
      await fetchConsentForm();
      setConfirmDialogOpen(false);
      
    } catch (err: any) {
      console.error("Error submitting response:", err);
      toast.error("Không thể gửi phản hồi. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (isApproved?: boolean) => {
    if (isApproved === null || isApproved === undefined) return "default";
    return isApproved ? "success" : "error";
  };

  const getStatusText = (isApproved?: boolean) => {
    if (isApproved === null || isApproved === undefined) return "Chưa phản hồi";
    return isApproved ? "Đã đồng ý" : "Đã từ chối";
  };

  const getStatusIcon = (isApproved?: boolean) => {
    if (isApproved === null || isApproved === undefined) return <ScheduleIcon />;
    return isApproved ? <CheckCircleIcon /> : <CancelIcon />;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !consentForm) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error || "Không tìm thấy phiếu đồng ý"}
        </Alert>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Quay lại
          </Button>
        </Box>
      </Box>
    );
  }

  const isReadOnly = consentForm.isApproved !== null && consentForm.isApproved !== undefined;
  const isParentAuthorized = user?.role === "Parent" && consentForm.parentId === user.id;

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1">
              Phiếu đồng ý tiêm chủng/khám sức khỏe
            </Typography>
            <Chip
              icon={getStatusIcon(consentForm.isApproved)}
              label={getStatusText(consentForm.isApproved)}
              color={getStatusColor(consentForm.isApproved)}
              size="medium"
            />
          </Box>

          <Stack spacing={3}>
            {/* Basic Information */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                Thông tin cơ bản
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Tên học sinh
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {consentForm.studentName}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Phụ huynh
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {consentForm.parentName}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Divider />

            {/* Schedule Information */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                Thông tin lịch tiêm/khám
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="textSecondary">
                    Tên lịch
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {consentForm.scheduleName}
                  </Typography>
                </Box>
                
                {consentForm.vaccineType && (
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Loại vaccine
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {consentForm.vaccineType}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Ngày dự kiến
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {consentForm.vaccinationDate 
                          ? new Date(consentForm.vaccinationDate).toLocaleDateString('vi-VN')
                          : "Chưa xác định"
                        }
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Box>

            <Divider />

            {/* Response Information */}
            <Box>
              <Typography variant="h6" gutterBottom color="primary">
                Thông tin phản hồi
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 3 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      icon={getStatusIcon(consentForm.isApproved)}
                      label={getStatusText(consentForm.isApproved)}
                      color={getStatusColor(consentForm.isApproved)}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày phản hồi
                    </Typography>
                    <Typography variant="body1">
                      {consentForm.consentDate 
                        ? new Date(consentForm.consentDate).toLocaleDateString('vi-VN')
                        : "Chưa phản hồi"
                      }
                    </Typography>
                  </Box>
                </Box>
                
                {consentForm.reasonForDecline && (
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">
                      Lý do từ chối
                    </Typography>
                    <Alert severity="warning" sx={{ mt: 1 }}>
                      {consentForm.reasonForDecline}
                    </Alert>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Action Buttons */}
            {isParentAuthorized && !isReadOnly && (
              <>
                <Divider />
                <Box>
                  <Typography variant="h6" gutterBottom color="primary">
                    Quyết định của phụ huynh
                  </Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Sau khi gửi phản hồi, bạn sẽ không thể thay đổi quyết định. 
                    Vui lòng cân nhắc kỹ trước khi quyết định.
                  </Alert>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleActionClick("approve")}
                      sx={{ flex: 1 }}
                    >
                      Đồng ý tiêm chủng/khám
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      startIcon={<CancelIcon />}
                      onClick={() => handleActionClick("reject")}
                      sx={{ flex: 1 }}
                    >
                      Từ chối
                    </Button>
                  </Stack>
                </Box>
              </>
            )}

            {isReadOnly && (
              <Alert severity="info">
                Phiếu đồng ý này đã được xử lý và không thể chỉnh sửa.
              </Alert>
            )}
          </Stack>

          {/* Navigation */}
          <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate(-1)}
            >
              Quay lại danh sách
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog 
        open={confirmDialogOpen} 
        onClose={() => !submitting && setConfirmDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Xác nhận {selectedAction === "approve" ? "đồng ý" : "từ chối"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Alert severity={selectedAction === "approve" ? "success" : "warning"}>
              Bạn có chắc chắn muốn {selectedAction === "approve" ? "đồng ý" : "từ chối"} 
              cho con em tham gia "{consentForm.scheduleName}"?
            </Alert>
            
            {selectedAction === "reject" && (
              <TextField
                label="Lý do từ chối *"
                multiline
                rows={3}
                fullWidth
                value={reasonForDecline}
                onChange={(e) => setReasonForDecline(e.target.value)}
                placeholder="Vui lòng nhập lý do từ chối..."
                disabled={submitting}
              />
            )}
            
            <Alert severity="info">
              <strong>Lưu ý:</strong> Sau khi gửi phản hồi, bạn sẽ không thể thay đổi quyết định.
            </Alert>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmDialogOpen(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color={selectedAction === "approve" ? "success" : "error"}
            onClick={handleSubmitResponse}
            disabled={submitting || (selectedAction === "reject" && !reasonForDecline.trim())}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {submitting ? "Đang gửi..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsentFormTicket;
