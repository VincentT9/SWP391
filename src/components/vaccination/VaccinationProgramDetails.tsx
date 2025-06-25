import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
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
import PeopleIcon from "@mui/icons-material/People";
import { format } from "date-fns";
import EditVaccinationProgramDialog from "./EditVaccinationProgramDialog";
import ScheduleStudentListDialog from "./ScheduleStudentListDialog";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStudentListDialogOpen, setIsStudentListDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSuccess = () => {
    // Có thể thêm logic refresh dữ liệu nếu cần
  };

  const handleViewStudentsClick = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsStudentListDialogOpen(true);
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

  const getCampaignTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return "Tiêm chủng";
      case 1:
        return "Khám sức khỏe";
      default:
        return "Không xác định";
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
                  Loại:{" "}
                  <Chip
                    size="small"
                    label={getCampaignTypeLabel(campaign.type)}
                    color="primary"
                  />
                </Typography>
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
                onClick={handleEditClick}
              >
                Chỉnh sửa
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ width: "100%" }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              Lịch {campaign.type === 0 ? "tiêm chủng" : "khám sức khỏe"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 2 }}
            >
              Nhấp vào dòng hoặc biểu tượng{" "}
              <PeopleIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", fontSize: "1rem" }}
              />{" "}
              để xem danh sách học sinh trong lịch
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" size="small">
              Thêm lịch {campaign.type === 0 ? "tiêm" : "khám"}
            </Button>
          </Box>

          {campaign.schedules && campaign.schedules.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="schedules table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Ngày {campaign.type === 0 ? "tiêm" : "khám"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Địa điểm</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "180px" }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {campaign.schedules.map((schedule: any) => (
                    <TableRow
                      key={schedule.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                      onClick={() => handleViewStudentsClick(schedule)}
                    >
                      <TableCell>
                        {formatDate(schedule.scheduledDate)}
                      </TableCell>
                      <TableCell>{schedule.location}</TableCell>
                      <TableCell>{schedule.notes}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Tooltip title="Xem danh sách học sinh">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewStudentsClick(schedule);
                              }}
                            >
                              <PeopleIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Chỉnh sửa lịch">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Xử lý sự kiện chỉnh sửa lịch
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa lịch">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Xử lý sự kiện xóa lịch
                              }}
                            >
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
              Chưa có lịch{" "}
              {campaign.type === 0 ? "tiêm chủng" : "khám sức khỏe"} nào được
              tạo.
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Dialog chỉnh sửa chương trình */}
      <EditVaccinationProgramDialog
        open={isEditDialogOpen}
        campaign={campaign}
        onClose={handleEditDialogClose}
        onSuccess={handleEditSuccess}
      />

      {/* Dialog danh sách học sinh */}
      {selectedSchedule && (
        <ScheduleStudentListDialog
          open={isStudentListDialogOpen}
          onClose={() => setIsStudentListDialogOpen(false)}
          schedule={selectedSchedule}
          campaignType={campaign.type}
        />
      )}
    </Box>
  );
};

export default VaccinationProgramDetails;
