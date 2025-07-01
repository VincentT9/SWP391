import React, { useState, useRef } from "react";
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
  Button,
  Chip,
  CircularProgress,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardMedia,
  LinearProgress,
} from "@mui/material";
import { format, addDays, parseISO } from "date-fns";
import { toast } from "react-toastify";
import axios from "axios";
import instance from "../../../utils/axiosConfig";
const BASE_API = process.env.REACT_APP_BASE_URL;

interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  class: string;
  schoolYear: string;
  image: string;
}

interface MedicationRequestItem {
  id: string;
  medicationName: string;
  dosage: number;
  numberOfDayToTake: number;
  instructions: string;
  imagesMedicalInvoice: string[];
  startDate: string;
  endDate: string | null;
  status: number;
  studentCode: string;
  studentName: string;
  medicalStaffId: string;
  medicalStaffName: string | null;
}

interface MedicationRequestListProps {
  requests: MedicationRequestItem[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  isLoading: boolean;
  nurseId: string;
}

const getStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return <Chip label="Chờ xử lý" color="warning" />;
    case 1:
      return <Chip label="Đã chấp nhận" color="success" />;
    case 2:
      return <Chip label="Đã từ chối" color="error" />;
    default:
      return <Chip label="Không xác định" color="default" />;
  }
};

const MedicationRequestList: React.FC<MedicationRequestListProps> = ({
  requests,
  onAccept,
  onReject,
  isLoading,
  nurseId,
}) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRequest, setCurrentRequest] =
    useState<MedicationRequestItem | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(
    null
  );
  // Add a ref to track ongoing requests and prevent duplicate calls
  const pendingRequests = useRef<Set<string>>(new Set());

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const calculateEndDate = (startDate: string, numberOfDays: number) => {
    const start = parseISO(startDate);
    const end = addDays(start, numberOfDays - 1);
    return formatDate(format(end, "yyyy-MM-dd"));
  };

  // Filter to show only pending requests with status 0
  const pendingRequestsList = requests.filter((req) => req.status === 0);

  const handleAcceptRequest = async (requestId: string) => {
    // Prevent duplicate API calls
    if (pendingRequests.current.has(requestId)) {
      return;
    }

    try {
      setProcessingRequestId(requestId);
      pendingRequests.current.add(requestId);

      console.log("Attempting to accept request ID:", requestId);
      const requestData = requests.find((req) => req.id === requestId);
      if (!requestData) {
        throw new Error("Request not found");
      }

      // First get the actual student ID by student code
      const studentResponse = await instance.get(
        `${BASE_API}/api/Student/get-student-by-student-code/${requestData.studentCode}`
      );

      if (studentResponse.status !== 200) {
        throw new Error("Failed to get student information");
      }

      const studentId = studentResponse.data.id;

      // Match the exact schema required by the API
      const updateData = {
        studentId: studentId, // Using the actual student ID instead of the code
        medicationName: requestData.medicationName,
        dosage: requestData.dosage,
        numberOfDayToTake: requestData.numberOfDayToTake,
        instructions: requestData.instructions,
        imagesMedicalInvoice: Array.isArray(requestData.imagesMedicalInvoice)
          ? requestData.imagesMedicalInvoice
          : [],
        // Use full ISO string format as expected by the API
        startDate: new Date(requestData.startDate).toISOString(),
        status: 1, // Set status to 1 for accepted
        medicalStaffId: nurseId,
      };

      console.log("Sending update data:", JSON.stringify(updateData));
      console.log("req id:", requestId);
      // Make the API call
      const apiUrl = `${BASE_API}/api/MedicationRequest/update-medication-request/${requestId}`;
      const response = await instance.put(apiUrl, updateData);

      if (response.status === 200) {
        toast.success("Yêu cầu đã được chấp nhận thành công");
        // Call the parent component's onAccept function to update UI
        onAccept(requestId);
      }
    } catch (error: any) {
      console.error("Error accepting request:", error);
      // More detailed error message
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      }
      toast.error(
        `Không thể chấp nhận yêu cầu: ${error.message || "Lỗi không xác định"}`
      );
    } finally {
      setProcessingRequestId(null);
      pendingRequests.current.delete(requestId);
    }
  };

  const handleOpenRejectDialog = (request: MedicationRequestItem) => {
    setCurrentRequest(request);
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setRejectionReason("");
  };

  const handleSubmitReject = async () => {
    if (!currentRequest) {
      toast.error("Không tìm thấy yêu cầu");
      return;
    }

    const requestId = currentRequest.id;

    // Prevent duplicate API calls
    if (pendingRequests.current.has(requestId)) {
      return;
    }

    try {
      setProcessingRequestId(requestId);
      pendingRequests.current.add(requestId);

      // First get the actual student ID by student code
      const studentResponse = await instance.get(
        `${BASE_API}/api/Student/get-student-by-student-code/${currentRequest.studentCode}`
      );

      if (studentResponse.status !== 200) {
        throw new Error("Failed to get student information");
      }

      const studentId = studentResponse.data.id;

      // Update status to rejected (3) instead of deleting
      const updateData = {
        studentId: studentId,
        medicationName: currentRequest.medicationName,
        dosage: currentRequest.dosage,
        numberOfDayToTake: currentRequest.numberOfDayToTake,
        instructions: currentRequest.instructions,
        imagesMedicalInvoice: Array.isArray(currentRequest.imagesMedicalInvoice)
          ? currentRequest.imagesMedicalInvoice
          : [],
        startDate: new Date(currentRequest.startDate).toISOString(),
        status: 3, // Set status to 3 for rejected/cancelled
        medicalStaffId: nurseId,
      };

      const apiUrl = `${BASE_API}/api/MedicationRequest/update-medication-request/${requestId}`;
      const response = await instance.put(apiUrl, updateData);

      if (response.status === 200) {
        toast.success("Yêu cầu đã bị từ chối");
        onReject(requestId, "");
        handleCloseRejectDialog();
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Không thể từ chối yêu cầu. Vui lòng thử lại sau.");
    } finally {
      setProcessingRequestId(null);
      pendingRequests.current.delete(requestId);
    }
  };

  const handleViewInvoiceImage = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setImageDialogOpen(true);
  };

  // Render the table with pending requests
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Danh sách yêu cầu thuốc chờ xử lý
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : pendingRequestsList.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Không có yêu cầu thuốc nào đang chờ xử lý.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          {isLoading && <LinearProgress />}
          <Table sx={{ minWidth: 650 }} aria-label="medication requests table">
            <TableHead>
              <TableRow>
                <TableCell>Học sinh</TableCell>
                <TableCell>Thuốc</TableCell>
                <TableCell>Chỉ dẫn</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Đơn thuốc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingRequestsList.map((request) => (
                <TableRow
                  key={request.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {/* <Avatar 
                        src={request.student.image} 
                        alt={request.student.fullName} 
                        sx={{ mr: 1, width: 32, height: 32 }}
                      /> */}
                      <Box>
                        <Typography variant="body1">
                          {request.studentName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.studentCode}
                          {/* | {request.student.class} */}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      <strong>{request.medicationName}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Liều lượng: {request.dosage}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Số ngày: {request.numberOfDayToTake}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {request.instructions}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      Bắt đầu: {formatDate(request.startDate)}
                    </Typography>
                    <Typography variant="body2">
                      Kết thúc:{" "}
                      {calculateEndDate(
                        request.startDate,
                        request.numberOfDayToTake
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {request.imagesMedicalInvoice &&
                    request.imagesMedicalInvoice.length > 0 ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          handleViewInvoiceImage(
                            request.imagesMedicalInvoice[0]
                          )
                        }
                      >
                        Xem đơn
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Không có đơn
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{getStatusLabel(request.status)}</TableCell>
                  <TableCell>
                    {request.status === 0 && (
                      <Stack direction="column" spacing={1}>
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={processingRequestId === request.id}
                        >
                          {processingRequestId === request.id ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            "Chấp nhận"
                          )}
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleOpenRejectDialog(request)}
                          disabled={processingRequestId === request.id}
                        >
                          Từ chối
                        </Button>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Rejection Confirmation Dialog */}
      <Dialog open={rejectDialogOpen} onClose={handleCloseRejectDialog}>
        <DialogTitle>Xác nhận từ chối yêu cầu thuốc</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn từ chối yêu cầu thuốc này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Hủy</Button>
          <Button
            onClick={handleSubmitReject}
            color="error"
            disabled={processingRequestId === currentRequest?.id}
          >
            {processingRequestId === currentRequest?.id ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Xác nhận từ chối"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Đơn thuốc</DialogTitle>
        <DialogContent>
          {currentImage && (
            <Card>
              <CardMedia
                component="img"
                alt="Medical Invoice"
                image={currentImage}
                sx={{ maxHeight: "80vh", objectFit: "contain" }}
              />
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicationRequestList;
