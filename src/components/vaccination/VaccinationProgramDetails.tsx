import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Tab,
  Tabs,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CalendarMonth as CalendarIcon,
  Vaccines as VaccinesIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

// Fake data for student list
const mockStudents = [
  {
    id: "std1",
    name: "Nguyễn Văn A",
    class: "10A1",
    consentStatus: "approved",
    vaccinationStatus: "completed",
  },
  {
    id: "std2",
    name: "Trần Thị B",
    class: "10A1",
    consentStatus: "pending",
    vaccinationStatus: "pending",
  },
  {
    id: "std3",
    name: "Lê Văn C",
    class: "10A2",
    consentStatus: "rejected",
    vaccinationStatus: "cancelled",
  },
  {
    id: "std4",
    name: "Phạm Thị D",
    class: "10A2",
    consentStatus: "approved",
    vaccinationStatus: "pending",
  },
  {
    id: "std5",
    name: "Hoàng Văn E",
    class: "10A3",
    consentStatus: "approved",
    vaccinationStatus: "completed",
  },
];

// Fake data for schedules
const mockSchedules = [
  {
    id: "sch1",
    date: "2025-06-23",
    location: "Phòng y tế A",
    startTime: "08:00",
    endTime: "11:30",
    status: "scheduled",
  },
  {
    id: "sch2",
    date: "2025-06-24",
    location: "Phòng y tế B",
    startTime: "13:30",
    endTime: "16:00",
    status: "scheduled",
  },
];

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "info"; // Planned
      case 1:
        return "warning"; // InProgress
      case 2:
        return "success"; // Completed
      case 3:
        return "error"; // Cancelled
      default:
        return "default";
    }
  };

  const getConsentStatusChip = (status: string) => {
    switch (status) {
      case "approved":
        return <Chip size="small" label="Đã đồng ý" color="success" />;
      case "rejected":
        return <Chip size="small" label="Từ chối" color="error" />;
      case "pending":
        return <Chip size="small" label="Chờ phản hồi" color="warning" />;
      default:
        return <Chip size="small" label="Không xác định" color="default" />;
    }
  };

  const getVaccinationStatusChip = (status: string) => {
    switch (status) {
      case "completed":
        return <Chip size="small" label="Đã tiêm" color="success" />;
      case "pending":
        return <Chip size="small" label="Chưa tiêm" color="warning" />;
      case "cancelled":
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

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              {campaign.campaignName}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Chip
                icon={<VaccinesIcon />}
                label={campaign.vaccineType}
                variant="outlined"
                color="primary"
              />
              <Chip
                label={getStatusLabel(campaign.status)}
                color={getStatusColor(campaign.status) as any}
              />
            </Box>
          </Box>

          <Button variant="outlined" color="primary" startIcon={<EditIcon />}>
            Chỉnh sửa
          </Button>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Replaced Grid with Box using flexbox */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Info Card - left side */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Thông tin chung
                </Typography>
                <List dense disablePadding>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.light" }}>
                        <CalendarIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Thời gian"
                      secondary={`${formatDate(
                        campaign.startDate
                      )} - ${formatDate(campaign.endDate)}`}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.light" }}>
                        <VaccinesIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Loại vaccine"
                      secondary={campaign.vaccineType}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText
                      primary="Mô tả"
                      secondary={campaign.description}
                      secondaryTypographyProps={{
                        style: { whiteSpace: "pre-wrap" },
                      }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Statistics Card - right side */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Thống kê
                </Typography>
                {/* Replaced Grid with Box for statistics */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  {/* Stat item 1 */}
                  <Box
                    sx={{
                      flex: "1 0 calc(50% - 8px)",
                      minWidth: "120px",
                      textAlign: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="primary"
                      fontWeight="medium"
                    >
                      {mockStudents.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Học sinh tham gia
                    </Typography>
                  </Box>

                  {/* Stat item 2 */}
                  <Box
                    sx={{
                      flex: "1 0 calc(50% - 8px)",
                      minWidth: "120px",
                      textAlign: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="success.main"
                      fontWeight="medium"
                    >
                      {
                        mockStudents.filter(
                          (s) => s.vaccinationStatus === "completed"
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Đã tiêm chủng
                    </Typography>
                  </Box>

                  {/* Stat item 3 */}
                  <Box
                    sx={{
                      flex: "1 0 calc(50% - 8px)",
                      minWidth: "120px",
                      textAlign: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="warning.main"
                      fontWeight="medium"
                    >
                      {
                        mockStudents.filter(
                          (s) => s.consentStatus === "pending"
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Chờ xác nhận
                    </Typography>
                  </Box>

                  {/* Stat item 4 */}
                  <Box
                    sx={{
                      flex: "1 0 calc(50% - 8px)",
                      minWidth: "120px",
                      textAlign: "center",
                      p: 1,
                    }}
                  >
                    <Typography
                      variant="h4"
                      color="error.main"
                      fontWeight="medium"
                    >
                      {
                        mockStudents.filter(
                          (s) => s.consentStatus === "rejected"
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Từ chối tiêm
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Danh sách học sinh" />
          <Tab label="Lịch tiêm chủng" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">
                  Danh sách học sinh tham gia
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<PersonIcon />}
                >
                  Thêm học sinh
                </Button>
              </Box>

              {mockStudents.length > 0 ? (
                <TableContainer>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell>Họ tên</TableCell>
                        <TableCell>Lớp</TableCell>
                        <TableCell>Sự đồng ý</TableCell>
                        <TableCell>Tình trạng tiêm</TableCell>
                        <TableCell align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockStudents.map((student) => (
                        <TableRow key={student.id} hover>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            {getConsentStatusChip(student.consentStatus)}
                          </TableCell>
                          <TableCell>
                            {getVaccinationStatusChip(
                              student.vaccinationStatus
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <Tooltip title="Cập nhật trạng thái">
                                <IconButton size="small" color="primary">
                                  <CheckCircleIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Xóa khỏi danh sách">
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
                  Chưa có học sinh nào được thêm vào chương trình này.
                </Alert>
              )}
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Lịch tiêm chủng</Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CalendarIcon />}
                >
                  Thêm lịch tiêm
                </Button>
              </Box>

              {mockSchedules.length > 0 ? (
                <TableContainer>
                  <Table size="medium">
                    <TableHead>
                      <TableRow>
                        <TableCell>Ngày</TableCell>
                        <TableCell>Thời gian</TableCell>
                        <TableCell>Địa điểm</TableCell>
                        <TableCell>Trạng thái</TableCell>
                        <TableCell align="center">Thao tác</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockSchedules.map((schedule) => (
                        <TableRow key={schedule.id} hover>
                          <TableCell>{formatDate(schedule.date)}</TableCell>
                          <TableCell>
                            {schedule.startTime} - {schedule.endTime}
                          </TableCell>
                          <TableCell>{schedule.location}</TableCell>
                          <TableCell>
                            {getScheduleStatusChip(schedule.status)}
                          </TableCell>
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
        </Box>
      </Paper>
    </Box>
  );
};

export default VaccinationProgramDetails;
