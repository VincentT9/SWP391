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

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const campaignData = {
      campaignName,
      description,
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
              placeholder="Nhập tên chương trình tiêm chủng"
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
