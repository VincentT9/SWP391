import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";
import EditVaccinationProgramDialog from "./EditVaccinationProgramDialog"; // Thêm import này

// Import và khai báo các thành phần khác nếu cần

interface VaccinationProgramDetailsProps {
  campaign: any;
  onBack: () => void;
  getStatusLabel: (status: number) => string;
}

const VaccinationProgramDetails: React.FC<VaccinationProgramDetailsProps> = ({
  campaign,
  onBack,
  getStatusLabel,
}) => {
  const [tabValue, setTabValue] = useState(0);
  // Thêm state để quản lý dialog chỉnh sửa
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Thêm hàm xử lý khi nhấn nút chỉnh sửa
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  // Thêm hàm xử lý khi đóng dialog
  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  // Thêm hàm xử lý khi chỉnh sửa thành công
  const handleEditSuccess = () => {
    // Có thể thêm logic refresh dữ liệu nếu cần
  };

  const getStatusChip = (status: number) => {
    switch (status) {
      case 0:
        return <Chip size="small" label="Đã lên kế hoạch" color="info" />;
      case 1:
        return <Chip size="small" label="Đang tiến hành" color="warning" />;
      case 2:
        return <Chip size="small" label="Đã hoàn thành" color="success" />;
      case 3:
        return <Chip size="small" label="Đã hủy" color="error" />;
      default:
        return <Chip size="small" label="Không xác định" color="default" />;
    }
  };

  const getScheduleStatusChip = (status: string) => {
    switch (status) {
      case "completed":
        return <Chip size="small" label="Đã hoàn thành" color="success" />;
      case "scheduled":
        return <Chip size="small" label="Đã lên lịch" color="info" />;
      case "cancelled":
        return <Chip size="small" label="Đã hủy" color="error" />;
      default:
        return <Chip size="small" label="Không xác định" color="default" />;
    }
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Quay lại danh sách
      </Button>

      <Paper elevation={1} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "flex-start" },
              mb: 2,
            }}
          >
            <Box sx={{ flexGrow: 1, width: { xs: "100%", md: "70%" } }}>
              <Typography variant="h5" gutterBottom>
                {campaign.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {campaign.description}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Trạng thái: {getStatusChip(campaign.status)}
                </Typography>
                <Typography variant="body2">
                  Người tạo: {campaign.createdBy || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Ngày tạo: {formatDate(campaign.createAt)}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                mt: { xs: 2, md: 0 },
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                width: { xs: "100%", md: "30%" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mr: 1 }}
                onClick={handleEditClick} // Thêm sự kiện onClick
              >
                Chỉnh sửa
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="campaign details tabs"
            >
              <Tab label="Lịch tiêm chủng" />
              <Tab label="Danh sách học sinh" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Box sx={{ pt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Lịch tiêm chủng</Typography>
                <Button variant="contained" size="small">
                  Thêm lịch tiêm
                </Button>
              </Box>

              {campaign.schedules && campaign.schedules.length > 0 ? (
                <TableContainer>
                  <Table sx={{ minWidth: 650 }} aria-label="schedules table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Ngày tiêm
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Địa điểm
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Ghi chú
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Thao tác
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaign.schedules.map((schedule: any) => (
                        <TableRow key={schedule.id} hover>
                          <TableCell>
                            {formatDate(schedule.scheduledDate)}
                          </TableCell>
                          <TableCell>{schedule.location}</TableCell>
                          <TableCell>{schedule.notes}</TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Tooltip title="Chỉnh sửa lịch">
                                <IconButton size="small" color="primary">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa lịch">
                                <IconButton size="small" color="error">
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info">
                  Chưa có lịch tiêm chủng nào được tạo.
                </Alert>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ pt: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Danh sách học sinh</Typography>
                <Button variant="contained" size="small">
                  Thêm học sinh
                </Button>
              </Box>

              <Alert severity="info">
                Chưa có học sinh nào được thêm vào chương trình này.
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Thêm dialog chỉnh sửa */}
      <EditVaccinationProgramDialog
        open={isEditDialogOpen}
        campaign={campaign}
        onClose={handleEditDialogClose}
        onSuccess={handleEditSuccess}
      />
    </Box>
  );
};

export default VaccinationProgramDetails;
