import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { vi as viLocale } from "date-fns/locale";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";

// Định nghĩa interface cho dữ liệu campaign
interface Campaign {
  id: string;
  name: string;
  description: string;
  status: number;
  type: number;
  createdBy: string;
  updatedBy: string | null;
  createAt: string;
  updateAt: string;
  schedules: any[];
}

// Định nghĩa interface cho form data
interface FormData {
  name: string;
  description: string;
  status: number;
}

interface EditVaccinationProgramDialogProps {
  open: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onSuccess: () => void;
}

const EditVaccinationProgramDialog: React.FC<
  EditVaccinationProgramDialogProps
> = ({ open, campaign, onClose, onSuccess }) => {
  const [editFormData, setEditFormData] = useState<FormData>({
    name: "",
    description: "",
    status: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when campaign changes
  useEffect(() => {
    if (campaign) {
      setEditFormData({
        name: campaign.name,
        description: campaign.description,
        status: campaign.status,
      });
    }
  }, [campaign]);

  // Handle closing dialog
  const handleCloseDialog = () => {
    setErrors({});
    onClose();
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle status select change
  const handleStatusChange = (e: any) => {
    setEditFormData({
      ...editFormData,
      status: e.target.value,
    });
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!editFormData.name.trim()) {
      newErrors.name = "Tên chương trình là bắt buộc";
    }

    if (!editFormData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm() || !campaign) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        name: editFormData.name,
        description: editFormData.description,
        status: editFormData.status,
        type: campaign.type, // Giữ nguyên type
      };

      await instance.put(
        `/api/Campaign/update-campaign/${campaign.id}`,
        updateData
      );

      toast.success("Cập nhật chương trình tiêm chủng thành công!");

      // Cập nhật đối tượng campaign với giá trị mới (cho UI cập nhật ngay lập tức)
      if (campaign) {
        campaign.name = editFormData.name;
        campaign.description = editFormData.description;
        campaign.status = editFormData.status;
      }

      // Đóng dialog và thông báo cho component cha
      onSuccess();
      handleCloseDialog();
    } catch (error: any) {
      console.error("Error updating campaign:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Không thể cập nhật chương trình tiêm chủng. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <DialogTitle>Chỉnh sửa chương trình tiêm chủng</DialogTitle>
      <DialogContent>
        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={viLocale}
        >
          <Box sx={{ pt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Tên chương trình"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 3,
              }}
            >
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel id="status-select-label">Trạng thái</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={editFormData.status}
                  label="Trạng thái"
                  onChange={handleStatusChange}
                >
                  <MenuItem value={0}>Lên kế hoạch</MenuItem>
                  <MenuItem value={1}>Đang tiến hành</MenuItem>
                  <MenuItem value={2}>Đã hoàn thành</MenuItem>
                  <MenuItem value={3}>Đã hủy</MenuItem>
                </Select>
                {errors.status && (
                  <FormHelperText>{errors.status}</FormHelperText>
                )}
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                multiline
                rows={4}
                value={editFormData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Box>
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVaccinationProgramDialog;
