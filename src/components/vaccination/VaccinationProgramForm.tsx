import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

interface VaccinationProgramFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const VaccinationProgramForm: React.FC<VaccinationProgramFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    campaignName: "",
    description: "",
    type: 0, // Mặc định là tiêm chủng
  });

  // Thêm state mới để quản lý danh sách lịch
  const [schedules, setSchedules] = useState<
    Array<{
      scheduledDate: Date;
      location: string;
      notes: string;
    }>
  >([]);

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Xóa thông báo lỗi khi người dùng sửa
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleTypeChange = (e: any) => {
    setFormData({
      ...formData,
      type: e.target.value,
    });
  };

  // Thêm hàm xử lý thêm lịch mới
  const handleAddSchedule = () => {
    setSchedules([
      ...schedules,
      {
        scheduledDate: new Date(),
        location: "",
        notes: "",
      },
    ]);
  };

  // Thêm hàm xử lý xóa lịch
  const handleRemoveSchedule = (index: number) => {
    const updatedSchedules = [...schedules];
    updatedSchedules.splice(index, 1);
    setSchedules(updatedSchedules);
  };

  // Thêm hàm xử lý thay đổi thông tin lịch
  const handleScheduleChange = (index: number, field: string, value: any) => {
    const updatedSchedules = [...schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };
    setSchedules(updatedSchedules);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.campaignName.trim()) {
      newErrors.campaignName = "Tên chương trình là bắt buộc";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    // Kiểm tra lỗi cho từng lịch nếu có
    const scheduleErrors: any = [];

    schedules.forEach((schedule, index) => {
      const itemErrors: any = {};
      let hasError = false;

      if (!schedule.location.trim()) {
        itemErrors.location = "Địa điểm là bắt buộc";
        hasError = true;
      }

      if (!schedule.scheduledDate) {
        itemErrors.scheduledDate = "Ngày là bắt buộc";
        hasError = true;
      }

      if (hasError) {
        scheduleErrors[index] = itemErrors;
      }
    });

    if (scheduleErrors.length > 0) {
      newErrors.schedules = scheduleErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Chuyển đổi dữ liệu lịch sang định dạng API
      const formattedSchedules = schedules.map((schedule) => ({
        scheduledDate: schedule.scheduledDate.toISOString(),
        location: schedule.location,
        notes: schedule.notes,
      }));

      onSave({
        ...formData,
        schedules: formattedSchedules,
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Tạo chương trình mới
      </Typography>
      <Box component="form" noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Tên chương trình"
          name="campaignName"
          value={formData.campaignName}
          onChange={handleInputChange}
          error={!!errors.campaignName}
          helperText={errors.campaignName}
          required
        />

        <TextField
          fullWidth
          margin="normal"
          label="Mô tả"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          error={!!errors.description}
          helperText={errors.description}
          required
          multiline
          rows={3}
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Loại chương trình</InputLabel>
          <Select
            label="Loại chương trình"
            value={formData.type}
            onChange={handleTypeChange}
          >
            <MenuItem value={0}>Tiêm chủng</MenuItem>
            <MenuItem value={1}>Khám sức khỏe</MenuItem>
          </Select>
          <FormHelperText>Chọn loại chương trình</FormHelperText>
        </FormControl>

        <Divider sx={{ my: 3 }} />

        {/* Phần thêm lịch - thay thế Grid bằng Box với flexbox */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Lịch {formData.type === 0 ? "tiêm chủng" : "khám sức khỏe"} (không
            bắt buộc)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Bạn có thể thêm lịch ngay trong quá trình tạo chương trình hoặc thêm
            sau
          </Typography>

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddSchedule}
            sx={{ mb: 2 }}
          >
            Thêm lịch {formData.type === 0 ? "tiêm" : "khám"}
          </Button>

          {schedules.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                "& > *": {
                  flexGrow: 0,
                  width: { xs: "100%", md: "calc(50% - 8px)" },
                },
              }}
            >
              {schedules.map((schedule, index) => (
                <Card variant="outlined" key={index}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Lịch #{index + 1}
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Ngày"
                        value={schedule.scheduledDate}
                        onChange={(date) =>
                          handleScheduleChange(
                            index,
                            "scheduledDate",
                            date || new Date()
                          )
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            margin: "normal",
                            size: "small",
                            error: !!(
                              errors.schedules &&
                              errors.schedules[index]?.scheduledDate
                            ),
                            helperText:
                              errors.schedules &&
                              errors.schedules[index]?.scheduledDate,
                          },
                        }}
                      />
                    </LocalizationProvider>

                    <TextField
                      fullWidth
                      label="Địa điểm"
                      value={schedule.location}
                      onChange={(e) =>
                        handleScheduleChange(index, "location", e.target.value)
                      }
                      margin="normal"
                      size="small"
                      error={
                        !!(
                          errors.schedules && errors.schedules[index]?.location
                        )
                      }
                      helperText={
                        errors.schedules && errors.schedules[index]?.location
                      }
                    />

                    <TextField
                      fullWidth
                      label="Ghi chú"
                      value={schedule.notes}
                      onChange={(e) =>
                        handleScheduleChange(index, "notes", e.target.value)
                      }
                      margin="normal"
                      size="small"
                      multiline
                      rows={2}
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveSchedule(index)}
                    >
                      Xóa
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onCancel} sx={{ mr: 1 }}>
            Hủy
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Lưu
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default VaccinationProgramForm;
