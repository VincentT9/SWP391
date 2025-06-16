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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { format } from "date-fns";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MedicationIcon from "@mui/icons-material/Medication";
import { MedicationRequest } from "../../../models/types";

interface NurseMedicationListProps {
  requests: MedicationRequest[];
  onReceiveMedication: (requestId: string) => void;
  isLoading: boolean;
  nurseId: string;
}

const NurseMedicationList: React.FC<NurseMedicationListProps> = ({
  requests,
  onReceiveMedication,
  isLoading,
  nurseId,
}) => {
  const [selectedRequest, setSelectedRequest] =
    useState<MedicationRequest | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Filter requests that are assigned to this nurse with status "received" (1)
  const assignedRequests = requests.filter(
    (req) => req.receivedBy === nurseId && req.status === "received"
  );

  const getStatusChip = (status: string) => {
    switch (status) {
      case "requested":
        return <Chip label="Chờ xác nhận" color="warning" size="small" />;
      case "received":
        return <Chip label="Đã xác nhận" color="info" size="small" />;
      case "completed":
        return <Chip label="Hoàn thành" color="success" size="small" />;
      case "rejected":
        return <Chip label="Đã từ chối" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const handleMedicationClick = (request: MedicationRequest) => {
    setSelectedRequest(request);
    setConfirmDialogOpen(true);
  };

  const handleConfirmReceive = () => {
    if (selectedRequest) {
      onReceiveMedication(selectedRequest.id);
    }
    setConfirmDialogOpen(false);
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Yêu cầu thuốc đã xác nhận
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : assignedRequests.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Không có yêu cầu thuốc nào đã được xác nhận.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Tên học sinh</TableCell>
                <TableCell>Tên thuốc</TableCell>
                <TableCell>Liều lượng</TableCell>
                <TableCell>Hướng dẫn</TableCell>
                <TableCell align="center">Ngày bắt đầu</TableCell>
                <TableCell align="center">Ngày kết thúc</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assignedRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.studentName}</TableCell>
                  <TableCell>{request.medicationName}</TableCell>
                  <TableCell>{request.dosage}</TableCell>
                  <TableCell>{request.instructions}</TableCell>
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
                    <Tooltip title="Xem chi tiết thuốc">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleMedicationClick(request)}
                      >
                        <MedicationIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={confirmDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Chi tiết thuốc</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography variant="body1" gutterBottom>
                <strong>Tên thuốc:</strong> {selectedRequest.medicationName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Học sinh:</strong> {selectedRequest.studentName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Liều lượng:</strong> {selectedRequest.dosage}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Hướng dẫn:</strong> {selectedRequest.instructions}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Thời gian:</strong>{" "}
                {format(new Date(selectedRequest.startDate), "dd/MM/yyyy")} -{" "}
                {format(new Date(selectedRequest.endDate), "dd/MM/yyyy")}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Trạng thái:</strong>{" "}
                {selectedRequest.status === "received"
                  ? "Đã xác nhận"
                  : selectedRequest.status}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NurseMedicationList;
