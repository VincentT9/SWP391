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
  onViewLogs: (requestId: string, studentId: string) => void; // Cập nhật để truyền cả studentId
  onViewDetail: (requestId: string) => void;
}

const MedicationRequestList: React.FC<MedicationRequestListProps> = ({
  requests,
  onViewLogs,
  onViewDetail,
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
        return <Chip label="Đã gửi" color="warning" size="small" sx={{ fontWeight: 500 }} />;
      case "received":
        return <Chip label="Đã nhận" color="info" size="small" sx={{ fontWeight: 500 }} />;
      case "completed":
        return <Chip label="Hoàn thành" color="success" size="small" sx={{ fontWeight: 500 }} />;
      case "cancelled":
        return <Chip label="Đã hủy" color="error" size="small" sx={{ fontWeight: 500 }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
        Danh sách thuốc đã gửi
      </Typography>

      {requests.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Chưa có yêu cầu gửi thuốc nào.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Tên học sinh</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tên thuốc và thành phần</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Số ngày cần uống</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Ngày bắt đầu</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Ngày kết thúc</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Tác vụ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...requests]
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((request) => (
                <TableRow key={request.id} sx={{ '&:hover': { bgcolor: 'grey.50' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {request.studentName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Xem chi tiết">
                      <Box
                        sx={{
                          maxWidth: 160,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                          '&:hover': { color: 'primary.main' }
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
                  <TableCell>
                    <Typography variant="body2">
                      {request.daysRequired} ngày
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(request.startDate), "dd/MM/yyyy")}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(request.endDate), "dd/MM/yyyy")}
                    </Typography>
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
                        gap: 0.5
                      }}
                    >
                      <Tooltip title="Xem nhật ký uống thuốc">
                        <span>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              onViewLogs(request.id, request.studentId)
                            }
                            disabled={request.status === "requested"}
                            sx={{ 
                              borderRadius: 1,
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title="Xem chi tiết">
                        <span>
                          <IconButton
                            size="small"
                            color="default"
                            sx={{ 
                              borderRadius: 1,
                              '&:hover': { bgcolor: 'grey.100' }
                            }}
                            onClick={() => onViewDetail(request.id)}
                          >
                            <InfoOutlinedIcon fontSize="small" />
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
