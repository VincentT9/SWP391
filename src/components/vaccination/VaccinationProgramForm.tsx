import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
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
  const [description, setDescription] = useState("");
  const [campaignType, setCampaignType] = useState<number>(0); // Mặc định là Vaccination (0)
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!campaignName.trim()) {
      newErrors.campaignName = "Tên chương trình là bắt buộc";
    }

    if (!description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCampaignType(Number(event.target.value));
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const campaignData = {
      campaignName,
      description,
      type: campaignType,
    };

    onSave(campaignData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={viLocale}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Tạo chương trình mới
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
              placeholder="Nhập tên chương trình"
            />
          </Box>

          <FormControl component="fieldset">
            <FormLabel component="legend">Loại chương trình</FormLabel>
            <RadioGroup
              row
              name="campaign-type"
              value={campaignType}
              onChange={handleTypeChange}
            >
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="Tiêm chủng"
              />
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Khám sức khỏe"
              />
            </RadioGroup>
            <FormHelperText>
              {campaignType === 0
                ? "Chương trình tiêm phòng cho học sinh"
                : "Chương trình khám sức khỏe định kỳ hoặc trước tiêm phòng"}
            </FormHelperText>
          </FormControl>

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
              placeholder="Mô tả chi tiết về chương trình, mục đích, đối tượng tham gia..."
            />
          </Box>

          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              {campaignType === 0
                ? "Sau khi tạo chương trình tiêm chủng, bạn có thể thêm lịch tiêm và quản lý danh sách học sinh."
                : "Sau khi tạo chương trình khám sức khỏe, bạn có thể thêm lịch khám và quản lý danh sách học sinh."}
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
