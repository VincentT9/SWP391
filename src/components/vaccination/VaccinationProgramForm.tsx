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
  Alert,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { vi as viLocale } from "date-fns/locale";

interface VaccinationProgramFormProps {
  onSave: (campaignData: any) => void;
  onCancel: () => void;
}

const VaccinationProgramForm: React.FC<VaccinationProgramFormProps> = ({
  onSave,
  onCancel,
}) => {
  const [campaignName, setCampaignName] = useState("");
  const [vaccineType, setVaccineType] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<number>(0); // Default: Planned
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!campaignName.trim()) {
      newErrors.campaignName = "Tên chương trình là bắt buộc";
    }

    if (!vaccineType.trim()) {
      newErrors.vaccineType = "Loại vaccine là bắt buộc";
    }

    if (!description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    if (!startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    }

    if (!endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    } else if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const campaignData = {
      campaignName,
      vaccineType,
      description,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      status,
    };

    onSave(campaignData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Tạo chương trình tiêm chủng mới
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <Box>
            <TextField
              fullWidth
              label="Tên chương trình"
              required
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              error={!!errors.campaignName}
              helperText={errors.campaignName}
              placeholder="Ví dụ: Tiêm phòng ngừa bệnh sởi năm 2025"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 2 },
            }}
          >
            <TextField
              fullWidth
              label="Loại vaccine"
              required
              value={vaccineType}
              onChange={(e) => setVaccineType(e.target.value)}
              error={!!errors.vaccineType}
              helperText={errors.vaccineType}
              placeholder="Ví dụ: MMR_VAX_PRO_2025"
            />

            <FormControl fullWidth required error={!!errors.status}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as number)}
                label="Trạng thái"
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

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 2 },
            }}
          >
            <DatePicker
              label="Ngày bắt đầu *"
              value={startDate}
              onChange={(newDate) => setStartDate(newDate)}
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
              value={endDate}
              onChange={(newDate) => setEndDate(newDate)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endDate,
                  helperText: errors.endDate,
                },
              }}
            />
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Mô tả"
              required
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Mô tả chi tiết về chương trình tiêm chủng, mục đích, đối tượng tham gia..."
            />
          </Box>

          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Sau khi tạo chương trình tiêm chủng, bạn có thể thêm lịch tiêm và
              quản lý danh sách học sinh trong phần chi tiết chương trình.
            </Alert>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={onCancel}>
                Hủy
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Tạo chương trình
              </Button>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </LocalizationProvider>
  );
};

export default VaccinationProgramForm;
