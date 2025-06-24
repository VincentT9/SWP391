import React from "react";
import {
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MedicalIncident } from "../../../models/types";

interface MedicalEventDetailsProps {
  event: MedicalIncident;
  onBack: () => void;
  onEdit?: (event: MedicalIncident) => void;
  isNurse?: boolean;
}

const MedicalEventDetails: React.FC<MedicalEventDetailsProps> = ({
  event,
  onBack,
  onEdit,
  isNurse = false,
}) => {
  const getEventTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return "Bệnh";
      case 1:
        return "Chấn thương";
      case 2:
        return "Khẩn cấp";
      default:
        return "Khác";
    }
  };

  const getEventTypeColor = (type: number) => {
    switch (type) {
      case 1:
        return "warning";
      case 0:
        return "info";
      case 2:
        return "error";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Đang theo dõi";
      case 1:
        return "Đã ổn định";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (
    status: number
  ): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case 1:
        return "success";
      case 0:
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mr: 2 }}>
          Quay lại
        </Button>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>Chi tiết sự kiện y tế</Typography>
        
        {isNurse && onEdit && (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => onEdit(event)}
          >
            Chỉnh sửa
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Loại sự kiện
            </Typography>
            <Chip
              label={getEventTypeLabel(event.incidentType)}
              color={getEventTypeColor(event.incidentType) as any}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" align="right">
              Ngày xảy ra
            </Typography>
            <Typography variant="body1" align="right">
              {format(parseISO(event.incidentDate), "dd/MM/yyyy HH:mm")}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Thông tin học sinh
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              {event.student.fullName}
            </Typography>
            <Typography variant="body2">
              Mã học sinh: {event.student.studentCode}
            </Typography>
            <Typography variant="body2">
              Lớp: {event.student.class} | Niên khóa: {event.student.schoolYear}
            </Typography>
            <Typography variant="body2">
              Ngày sinh:{" "}
              {format(parseISO(event.student.dateOfBirth), "dd/MM/yyyy")}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Mô tả sự kiện
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {event.description}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Hành động đã thực hiện
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {event.actionsTaken}
          </Typography>
        </Box>

        {event.medicalSupplyUsages && event.medicalSupplyUsages.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              Vật tư y tế đã sử dụng
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Số lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {event.medicalSupplyUsages.map((supply, index) => (
                    <TableRow key={index}>
                      <TableCell>{supply.supplyId}</TableCell>
                      <TableCell>{supply.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Box>
          <Typography variant="body2" color="text.secondary">
            Trạng thái
          </Typography>
          <Chip
            label={getStatusLabel(event.status)}
            color={getStatusColor(event.status)}
            sx={{ mt: 0.5 }}
          />
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Thông báo cho phụ huynh
          </Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>
            {event.parentNotified ? (
              <>
                <span>Đã thông báo - </span>
                {event.parentNotificationDate &&
                  event.parentNotificationDate !== "0001-01-01T00:00:00" && (
                    <span>
                      {format(parseISO(event.parentNotificationDate), "dd/MM/yyyy HH:mm")}
                    </span>
                  )}
              </>
            ) : (
              "Chưa thông báo"
            )}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default MedicalEventDetails;
