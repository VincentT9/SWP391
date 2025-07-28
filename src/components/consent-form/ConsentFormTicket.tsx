import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
  TextField,
  Stack,
  Card,
  CardContent,
  Alert,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Person,
  Event,
  LocationOn,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Warning,
  Schedule,
  MedicalServices,
} from "@mui/icons-material";
import { ConsentForm } from "../../models/types";

interface ConsentFormTicketProps {
  consentForm: ConsentForm;
  mode: "parent" | "admin";
  onSubmit?: (payload: {
    campaignId: string;
    studentId: string;
    isApproved: boolean;
    consentDate: string;
    reasonForDecline: string;
  }) => void;
}

const ConsentFormTicket: React.FC<ConsentFormTicketProps> = ({
  consentForm,
  mode,
  onSubmit,
}) => {
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [reasonError, setReasonError] = useState<string | null>(null);

  const handleApprove = async () => {
    if (!checked) return;
    setSubmitting(true);
    const payload = {
      campaignId: consentForm.campaignId,
      studentId: consentForm.studentId,
      isApproved: true,
      consentDate: new Date().toISOString(),
      reasonForDecline: "",
    };
    await onSubmit?.(payload);
    setSubmitting(false);
    setChecked(false);
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      setReasonError("Vui lòng nhập lý do từ chối.");
      return;
    }
    setSubmitting(true);
    const payload = {
      campaignId: consentForm.campaignId,
      studentId: consentForm.studentId,
      isApproved: false,
      consentDate: new Date().toISOString(),
      reasonForDecline: reason,
    };
    await onSubmit?.(payload);
    setSubmitting(false);
    setShowRejectDialog(false);
    setReason("");
    setReasonError(null);
    setChecked(false);
  };

  const getStatusIcon = (isApproved?: boolean) => {
    if (isApproved === undefined || consentForm.updatedBy === null)
      return <HourglassEmpty color="warning" sx={{ fontSize: 28 }} />;
    return isApproved ? (
      <CheckCircle color="success" sx={{ fontSize: 28 }} />
    ) : (
      <Cancel color="error" sx={{ fontSize: 28 }} />
    );
  };

  const getStatusColor = (
    isApproved?: boolean
  ): "default" | "success" | "error" | "warning" => {
    if (isApproved === undefined || consentForm.updatedBy === null)
      return "warning";
    return isApproved ? "success" : "error";
  };

  const getStatusText = (isApproved?: boolean) => {
    if (isApproved === undefined || consentForm.updatedBy === null)
      return "Đang chờ xử lý";
    return isApproved ? "Đã đồng ý tiêm chủng" : "Đã từ chối tiêm chủng";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        height: { xs: "auto", lg: "calc(100vh - 320px)" },
        overflow: "auto",
        pb: 2,
      }}
    >
      {/* Header Card */}
      <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={3} alignItems="flex-start">
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                fontSize: 24,
              }}
            >
              <MedicalServices />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight="600"
                gutterBottom
                sx={{ color: "primary.main" }}
              >
                {consentForm.campaignName}
              </Typography>

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Person fontSize="small" color="action" />
                  <Typography variant="body1" fontWeight="500">
                    {consentForm.studentName}
                  </Typography>
                </Stack>
              </Stack>

              <Chip
                icon={getStatusIcon(consentForm.isApproved)}
                label={getStatusText(consentForm.isApproved)}
                color={getStatusColor(consentForm.isApproved)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Schedule Information */}
      <Card elevation={1} sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}
          >
            <Schedule color="primary" />
            Lịch Tiêm Chủng
          </Typography>

          {consentForm.scheduleConsentForms &&
          consentForm.scheduleConsentForms.length > 0 ? (
            <List sx={{ p: 0 }}>
              {consentForm.scheduleConsentForms.map((schedule, idx) => (
                <ListItem
                  key={idx}
                  sx={{
                    px: 0,
                    py: 1,
                    border: 1,
                    borderColor: "grey.200",
                    borderRadius: 1,
                    mb: 1,
                    bgcolor: "grey.50",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Event color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="500">
                        {formatDate(schedule.scheduledDate)}
                      </Typography>
                    }
                    secondary={
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ mt: 0.5 }}
                      >
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {schedule.location}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">Chưa có lịch tiêm chủng cụ thể</Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Section for Parents */}
      {mode === "parent" && consentForm.updatedBy == null && (
        <Card
          elevation={2}
          sx={{ borderRadius: 2, border: 2, borderColor: "warning.main" }}
        >
          <CardContent sx={{ p: 3 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="500">
                Phiếu đồng ý này đang chờ quyết định của bạn
              </Typography>
            </Alert>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    size="large"
                  />
                }
                label={
                  <Typography variant="body1" fontWeight="500">
                    Tôi xác nhận đã đọc và hiểu rõ thông tin về việc tiêm chủng.
                    Tôi đồng ý cho con em mình tham gia chương trình tiêm chủng
                    này.
                  </Typography>
                }
                sx={{ mb: 2 }}
              />
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                size="large"
                disabled={!checked || submitting}
                onClick={handleApprove}
                startIcon={<CheckCircle />}
                sx={{
                  minWidth: 140,
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                Đồng Ý
              </Button>

              <Button
                variant="outlined"
                color="error"
                size="large"
                disabled={submitting}
                onClick={() => {
                  setShowRejectDialog(true);
                  setReasonError(null);
                }}
                startIcon={<Cancel />}
                sx={{
                  minWidth: 140,
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                Từ Chối
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason for Admin */}
      {mode !== "parent" && consentForm.reasonForDecline && (
        <Card
          elevation={1}
          sx={{ borderRadius: 2, border: 1, borderColor: "error.main" }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "error.main",
              }}
            >
              <Warning />
              Lý do từ chối
            </Typography>
            <Typography
              variant="body1"
              sx={{
                p: 2,
                bgcolor: "error.50",
                borderRadius: 1,
                border: 1,
                borderColor: "error.200",
              }}
            >
              {consentForm.reasonForDecline}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Rejection Dialog */}
      <Dialog
        open={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "error.main",
          }}
        >
          <Warning />
          Xác nhận từ chối tiêm chủng
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn từ chối cho con em mình tham gia chương trình
            tiêm chủng này không?
          </Typography>
          <TextField
            label="Lý do từ chối (bắt buộc)"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setReasonError(null);
            }}
            fullWidth
            multiline
            rows={3}
            disabled={submitting}
            placeholder="Vui lòng cho biết lý do từ chối để chúng tôi có thể hỗ trợ tốt hơn..."
            error={!!reasonError}
            helperText={reasonError}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setShowRejectDialog(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={submitting}
            startIcon={<Cancel />}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsentFormTicket;
