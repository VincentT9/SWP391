import React, { useState } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { format } from "date-fns";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { MedicationRequest } from "../../../models/types";

interface MedicationRequestListProps {
  requests: MedicationRequest[];
  onViewLogs: (requestId: string) => void;
}

const MedicationRequestList: React.FC<MedicationRequestListProps> = ({
  requests,
  onViewLogs,
}) => {
  const [selectedRequest, setSelectedRequest] =
    useState<MedicationRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleOpenDetail = (request: MedicationRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
  };

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
                <TableCell>Tên thuốc và thành phần</TableCell>
                <TableCell>Số lần uống/ngày</TableCell>
                <TableCell>Số ngày cần uống</TableCell>
                <TableCell align="center">Ngày bắt đầu</TableCell>
                <TableCell align="center">Ngày kết thúc</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Tác vụ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>
                    <Tooltip title="Xem chi tiết">
                      <Box
                        sx={{
                          maxWidth: 120,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenDetail(request)}
                      >
                        {request.components
                          ? request.components.split("\n")[0] +
                            (request.components.includes("\n") ? "..." : "")
                          : request.medicationName || "Không có tên"}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{request.dosesPerDay} lần/ngày</TableCell>
                  <TableCell>{request.daysRequired} ngày</TableCell>
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleOpenDetail(request)}
                        >
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Box
                        sx={{
                          mx: 0.5,
                          height: 20,
                          borderLeft: "1px solid #e0e0e0",
                        }}
                      ></Box>

                      <Tooltip title="Xem nhật ký uống thuốc">
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onViewLogs(request.id)}
                            disabled={request.status === "requested"}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog chi tiết thuốc */}
      <Dialog open={detailDialogOpen} onClose={handleCloseDetail} maxWidth="md">
        <DialogTitle>Chi tiết thuốc đã gửi</DialogTitle>
        <DialogContent dividers>
          {selectedRequest && (
            <Box sx={{ minWidth: 400 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thông tin học sinh
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, ml: 2 }}>
                {selectedRequest.studentName}
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Thông tin thuốc
              </Typography>
              <Box sx={{ mb: 2, ml: 2 }}>
                <Typography variant="body2" fontWeight="medium">
                  Tên thuốc và thành phần:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    mb: 2,
                    ml: 1,
                  }}
                >
                  {selectedRequest.components ||
                    selectedRequest.medicationName ||
                    "Không có thông tin"}
                </Typography>

                <Box sx={{ display: "flex", mb: 2 }}>
                  <Box sx={{ mr: 4 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Số lần uống/ngày:
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {selectedRequest.dosesPerDay} lần/ngày
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Số ngày cần uống:
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {selectedRequest.daysRequired} ngày
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", mb: 2 }}>
                  <Box sx={{ mr: 4 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Ngày bắt đầu:
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {format(
                        new Date(selectedRequest.startDate),
                        "dd/MM/yyyy"
                      )}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      Ngày kết thúc:
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {format(new Date(selectedRequest.endDate), "dd/MM/yyyy")}
                    </Typography>
                  </Box>
                </Box>

                {selectedRequest.hasReceipt && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Hóa đơn thuốc:
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ ml: 1, fontStyle: "italic" }}
                    >
                      Có đính kèm hình ảnh hóa đơn thuốc
                    </Typography>
                  </Box>
                )}

                {selectedRequest.notes && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight="medium">
                      Hướng dẫn sử dụng và ghi chú:
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {selectedRequest.notes}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Trạng thái:
                  </Typography>
                  <Box sx={{ ml: 1, mt: 0.5 }}>
                    {getStatusChip(selectedRequest.status)}
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MedicationRequestList;
