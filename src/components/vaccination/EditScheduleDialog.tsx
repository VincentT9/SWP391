// Tạo file EditScheduleDialog.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { vi as viLocale } from "date-fns/locale";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";

interface EditScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedSchedule: any, isNew: boolean) => void;
  schedule?: any;
  campaignId: string;
  onUpdateTempId?: (tempId: string, realId: string) => void;
  onRemoveTempItem?: (tempId: string) => void;
}

interface SchedulePayload {
  scheduledDate: string;
  location: string;
  notes: string;
  campaignId: string;
}

const EditScheduleDialog: React.FC<EditScheduleDialogProps> = ({
  open,
  onClose,
  onSuccess,
  schedule,
  campaignId,
  onUpdateTempId,
  onRemoveTempItem,
}) => {
  const isEditMode = !!schedule;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    scheduledDate: new Date(),
    location: "",
    notes: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (open) {
      if (!campaignId || campaignId.trim() === "") {
        toast.error("Thiếu thông tin chương trình");
      }
    }

    if (open && schedule) {
      setFormData({
        scheduledDate: schedule.scheduledDate
          ? new Date(schedule.scheduledDate)
          : new Date(),
        location: schedule.location || "",
        notes: schedule.notes || "",
      });
      setErrors({});
    } else if (open) {
      setFormData({
        scheduledDate: new Date(),
        location: "",
        notes: "",
      });
      setErrors({});
    }
  }, [open, schedule, campaignId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for proper date comparison

    if (!formData.scheduledDate) {
      newErrors.scheduledDate = "Ngày tiêm là bắt buộc";
    } else if (formData.scheduledDate < today) {
      newErrors.scheduledDate = "Ngày tiêm phải từ hôm nay trở đi";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Địa điểm là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        scheduledDate: date,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    let tempId = "";

    try {
      if (!campaignId || campaignId.trim() === "") {
        throw new Error("Missing or empty campaignId for new schedule");
      }

      const payload: SchedulePayload = {
        scheduledDate: formData.scheduledDate.toISOString(),
        location: formData.location,
        notes: formData.notes,
        campaignId: String(campaignId),
      };

      tempId = isEditMode ? schedule.id : `temp-${Date.now()}`;

      const previewData = {
        id: tempId,
        scheduledDate: payload.scheduledDate,
        location: payload.location,
        notes: payload.notes,
        campaignId: campaignId,
        campaignName: schedule?.campaignName || "",
      };

      onSuccess(previewData, !isEditMode);

      if (isEditMode) {
        await instance.put(
          `/api/Schedule/update-schedule/${schedule.id}`,
          payload
        );
        toast.success("Cập nhật lịch tiêm thành công!");
      } else {
        const response = await instance.post(
          "/api/Schedule/create-schedule",
          payload
        );

        if (response.data && response.data.id && onUpdateTempId) {
          onUpdateTempId(tempId, response.data.id);
        }

        toast.success("Thêm lịch tiêm mới thành công!");
      }

      onClose();
    } catch (error: any) {
      console.error("Error saving schedule:", error);
      toast.error(
        error.response?.data?.message ||
          (isEditMode
            ? "Không thể cập nhật lịch tiêm. Vui lòng thử lại."
            : "Không thể thêm lịch tiêm mới. Vui lòng thử lại.")
      );

      if (!isEditMode && onRemoveTempItem) {
        onRemoveTempItem(tempId);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEditMode ? "Chỉnh sửa lịch" : "Thêm lịch mới"}
      </DialogTitle>
      <DialogContent>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={viLocale}
        >
          <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <DatePicker
              label="Ngày"
              value={formData.scheduledDate}
              onChange={handleDateChange}
              minDate={new Date()} // Add this line to restrict to current date or future
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!errors.scheduledDate,
                  helperText: errors.scheduledDate,
                },
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              label="Địa điểm"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              error={!!errors.location}
              helperText={errors.location}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Ghi chú"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              multiline
              rows={3}
            />
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditScheduleDialog;
