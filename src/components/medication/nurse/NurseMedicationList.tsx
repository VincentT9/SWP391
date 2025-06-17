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
  DialogTitle,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import HistoryIcon from "@mui/icons-material/History";
import { MedicationRequest } from "../../../models/types";
import axiosInstance from "../../../utils/axiosConfig";

// New interface for diary entries
interface MedicationDiaryEntry {
  id: string;
  medicationRequestId: string;
  date: string;
  notes: string;
  administeredBy: string;
  administeredTime: string;
}

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
  const [diaryEntries, setDiaryEntries] = useState<MedicationDiaryEntry[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingDiary, setLoadingDiary] = useState(false);

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

  const handleDiaryClick = async (request: MedicationRequest) => {
    setSelectedRequest(request);
    setLoadingDiary(true);
    setConfirmDialogOpen(true);

    try {
      // Fetch diary entries for this medication request
      const response = await axiosInstance.get(`/api/MedicaDiary/${request.id}`);
      setDiaryEntries(response.data);
    } catch (error) {
      console.error("Error fetching medication diary:", error);
      setDiaryEntries([]);
    } finally {
      setLoadingDiary(false);
    }
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
                    <Tooltip title="Xem nhật ký">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleDiaryClick(request)}
                      >
                        <HistoryIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={confirmDialogOpen} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>Nhật ký sử dụng thuốc</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedRequest.medicationName} - {selectedRequest.studentName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedRequest.dosage} | {selectedRequest.instructions}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {loadingDiary ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : diaryEntries.length === 0 ? (
                <Typography variant="body1" color="textSecondary">
                  Chưa có nhật ký sử dụng thuốc nào.
                </Typography>
              ) : (
                <List>
                  {diaryEntries.map((entry) => (
                    <React.Fragment key={entry.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={format(new Date(entry.administeredTime), "dd/MM/yyyy HH:mm")}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="text.primary">
                                Người dùng thuốc: {entry.administeredBy}
                              </Typography>
                              {entry.notes && (
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  Ghi chú: {entry.notes}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
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