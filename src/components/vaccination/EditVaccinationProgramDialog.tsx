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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi as viLocale } from "date-fns/locale";
import { startOfDay, isBefore } from "date-fns"; // Thêm imports cần thiết
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";

interface EditVaccinationProgramDialogProps {
  open: boolean;
  campaign: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditVaccinationProgramDialog: React.FC<EditVaccinationProgramDialogProps> = ({
  open,
  campaign,
  onClose,
  onSuccess,
}) => {
  const [editFormData, setEditFormData] = useState({
    campaignName: "",
    vaccineType: "",
    description: "",
    startDate: new Date(),
    endDate: new Date(),
    status: 0,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Lấy ngày hiện tại và reset về đầu ngày để so sánh chính xác
  const today = startOfDay(new Date());

  // Update form data when campaign changes
  useEffect(() => {
    if (campaign) {
      setEditFormData({
        campaignName: campaign.campaignName,
        vaccineType: campaign.vaccineType,
        description: campaign.description,
        startDate: new Date(campaign.startDate),
        endDate: new Date(campaign.endDate),
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
  const handleStatusChange = (e: any) => {
    setEditFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  // Handle date changes
  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      setEditFormData((prev) => ({
        ...prev,
        startDate: date,
      }));
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      setEditFormData((prev) => ({
        ...prev,
        endDate: date,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!editFormData.campaignName.trim()) {
      newErrors.campaignName = "Tên chương trình là bắt buộc";
    }
    
    if (!editFormData.vaccineType.trim()) {
      newErrors.vaccineType = "Loại vaccine là bắt buộc";
    }
    
    if (!editFormData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }
    
    if (!editFormData.startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    } else {
      // Kiểm tra ngày bắt đầu phải từ ngày hiện tại trở đi
      const startDateStart = startOfDay(new Date(editFormData.startDate));
      if (isBefore(startDateStart, today)) {
        newErrors.startDate = "Ngày bắt đầu phải từ ngày hiện tại trở đi";
      }
    }
    
    if (!editFormData.endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    } else if (
      editFormData.startDate &&
      editFormData.endDate &&
      editFormData.endDate < editFormData.startDate
    ) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const updateData = {
        campaignName: editFormData.campaignName,
        vaccineType: editFormData.vaccineType,
        description: editFormData.description,
        startDate: editFormData.startDate.toISOString(),
        endDate: editFormData.endDate.toISOString(),
        status: editFormData.status,
      };
      
      await instance.put(
        `/api/VaccCampaign/update-vacc-campaign/${campaign.id}`,
        updateData
      );
      
      toast.success("Cập nhật chương trình tiêm chủng thành công!");
      
      // Update campaign object with new values (for immediate UI update)
      campaign.campaignName = editFormData.campaignName;
      campaign.vaccineType = editFormData.vaccineType;
      campaign.description = editFormData.description;
      campaign.startDate = editFormData.startDate.toISOString();
      campaign.endDate = editFormData.endDate.toISOString();
      campaign.status = editFormData.status;
      
      // Close dialog and notify parent component
      onSuccess();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Không thể cập nhật chương trình tiêm chủng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to check if date should be disabled (any date before today)
  const shouldDisableDate = (date: Date) => {
    return isBefore(date, today);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Chỉnh sửa chương trình tiêm chủng</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
          <Box sx={{ pt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Tên chương trình"
                name="campaignName"
                value={editFormData.campaignName}
                onChange={handleInputChange}
                error={!!errors.campaignName}
                helperText={errors.campaignName}
                required
              />
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Loại vaccine"
                name="vaccineType"
                value={editFormData.vaccineType}
                onChange={handleInputChange}
                error={!!errors.vaccineType}
                helperText={errors.vaccineType}
                required
              />
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
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}>
              <DatePicker
                label="Ngày bắt đầu *"
                value={editFormData.startDate}
                onChange={handleStartDateChange}
                shouldDisableDate={shouldDisableDate} // Vô hiệu hóa ngày trong quá khứ
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                  },
                }}
              />
              <DatePicker
                label="Ngày kết thúc *"
                value={editFormData.endDate}
                onChange={handleEndDateChange}
                shouldDisableDate={shouldDisableDate} // Vô hiệu hóa ngày trong quá khứ
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                  },
                }}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={editFormData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                required
                multiline
                rows={4}
              />
            </Box>
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} disabled={isSubmitting}>Hủy</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditVaccinationProgramDialog;