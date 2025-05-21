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
} from "@mui/material";
import { format } from "date-fns";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { MedicationRequest } from "../../../models/types";

interface NurseMedicationListProps {
  requests: MedicationRequest[];
  onReceiveMedication: (requestId: string) => void;
}

const NurseMedicationList: React.FC<NurseMedicationListProps> = ({
  requests,
  onReceiveMedication,
}) => {
  const [selectedRequest, setSelectedRequest] =
    useState<MedicationRequest | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const pendingRequests = requests.filter((req) => req.status === "requested");
  const receivedRequests = requests.filter((req) => req.status === "received");

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

  const handleReceiveClick = (request: MedicationRequest) => {
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

  const renderMedicationTable = (
    title: string,
    medicationList: MedicationRequest[],
    showReceiveButton: boolean = false
  ) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      {medicationList.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Không có yêu cầu nào.
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
                {showReceiveButton && (
                  <TableCell align="center">Thao tác</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {medicationList.map((request) => (
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
                  {showReceiveButton && (
                    <TableCell align="center">
                      <Tooltip title="Xác nhận đã nhận thuốc">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleReceiveClick(request)}
                        >
                          <CheckCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {renderMedicationTable("Yêu cầu chờ xác nhận", pendingRequests, true)}
      {renderMedicationTable("Thuốc đã nhận", receivedRequests)}

      <Dialog open={confirmDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Xác nhận nhận thuốc</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn xác nhận đã nhận thuốc {selectedRequest?.medicationName} cho học
            sinh {selectedRequest?.studentName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleConfirmReceive} color="primary" autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NurseMedicationList;
