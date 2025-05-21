import React from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { format } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { MedicationRequest } from "../../../models/types";

interface MedicationRequestListProps {
  requests: MedicationRequest[];
  onViewLogs: (requestId: string) => void;
}

const MedicationRequestList: React.FC<MedicationRequestListProps> = ({
  requests,
  onViewLogs,
}) => {
  const getStatusChip = (status: string) => {
    switch (status) {
      case "requested":
        return <Chip label="Đã yêu cầu" color="primary" size="small" />;
      case "received":
        return <Chip label="Đã nhận" color="info" size="small" />;
      case "completed":
        return <Chip label="Hoàn thành" color="success" size="small" />;
      case "cancelled":
        return <Chip label="Đã hủy" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Danh sách thuốc đã gửi
      </Typography>

      {requests.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Chưa có yêu cầu gửi thuốc nào.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tên học sinh</TableCell>
                <TableCell>Tên thuốc</TableCell>
                <TableCell>Liều lượng</TableCell>
                <TableCell align="center">Ngày bắt đầu</TableCell>
                <TableCell align="center">Ngày kết thúc</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Nhật ký</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>{request.medicationName}</TableCell>
                  <TableCell>{request.dosage}</TableCell>
                  <TableCell align="center">
                    {format(new Date(request.startDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell align="center">
                    {format(new Date(request.endDate), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell align="center">
                    {getStatusChip(request.status)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem nhật ký uống thuốc">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onViewLogs(request.id)}
                        disabled={request.status === "requested"}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default MedicationRequestList;
