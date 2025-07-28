import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Avatar,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardMedia,
} from "@mui/material";
import { format, addDays, parseISO, isAfter } from "date-fns";
import instance from "../../../utils/axiosConfig";

const BASE_API = process.env.REACT_APP_BASE_URL;

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

interface CompletedExpiredRequestsListProps {
  nurseId: string;
  isLoading: boolean;
}

const getStatusLabel = (status: number, isExpired: boolean) => {
  if (isExpired) {
    return <Chip label="Quá hạn" color="error" />;
  }

  switch (status) {
    case 2:
      return <Chip label="Hoàn thành" color="success" />;
    case 3:
      return <Chip label="Đã hủy" color="default" />;
    default:
      return <Chip label="Không xác định" color="default" />;
  }
};

const CompletedExpiredRequestsList: React.FC<
  CompletedExpiredRequestsListProps
> = ({ nurseId, isLoading: parentLoading }) => {
  const [requests, setRequests] = useState<MedicationRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  useEffect(() => {
    fetchCompletedAndExpiredRequests();
  }, [nurseId]);

  const fetchCompletedAndExpiredRequests = async () => {
    setIsLoading(true);
    try {
      // Fetch all requests assigned to this nurse
      const response = await instance.get(
        `${BASE_API}/api/MedicationRequest/get-all-medication-requests`
      );

      const allRequests: MedicationRequestItem[] = response.data;

      // Filter requests assigned to this nurse
      const nurseRequests = allRequests.filter(
        (req) => req.medicalStaffId === nurseId
      );

      setRequests(nurseRequests);
    } catch (error) {
      console.error("Error fetching completed and expired requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  const calculateEndDate = (startDate: string, numberOfDays: number) => {
    const start = parseISO(startDate);
    // Add full number of days for display
    const end = addDays(start, numberOfDays);
    return end;
  };

  const isRequestExpired = (startDate: string, numberOfDays: number) => {
    // For expiration checking, we need to use the actual last day of medication
    const start = parseISO(startDate);
    const endDate = addDays(start, numberOfDays - 1);
    return isAfter(new Date(), endDate);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewInvoiceImage = (imageUrl: string) => {
    setCurrentImage(imageUrl);
    setImageDialogOpen(true);
  };

  // Separate completed and expired requests
  const completedRequests = requests.filter((req) => req.status === 2);
  const expiredRequests = requests.filter(
    (req) =>
      req.status === 1 && isRequestExpired(req.startDate, req.numberOfDayToTake)
  );
  const cancelledRequests = requests.filter((req) => req.status === 3);

  const renderRequestsTable = (
    requestsList: MedicationRequestItem[],
    showExpired = false
  ) => {
    if (requestsList.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary" sx={{ p: 2 }}>
          {showExpired
            ? "Không có yêu cầu thuốc nào quá hạn."
            : "Không có yêu cầu thuốc nào trong danh sách này."}
        </Typography>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="medication requests table">
          <TableHead>
            <TableRow>
              <TableCell>Học sinh</TableCell>
              <TableCell>Thuốc</TableCell>
              <TableCell>Chỉ dẫn</TableCell>
              <TableCell>Thời gian</TableCell>
              <TableCell>Đơn thuốc</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requestsList.map((request) => {
              const isExpired =
                showExpired ||
                isRequestExpired(request.startDate, request.numberOfDayToTake);

              return (
                <TableRow
                  key={request.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box>
                        <Typography variant="body1">
                          {request.studentName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.studentCode}
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
                      {format(
                        calculateEndDate(
                          request.startDate,
                          request.numberOfDayToTake
                        ),
                        "dd/MM/yyyy"
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
                  <TableCell>
                    {getStatusLabel(request.status, isExpired)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  if (isLoading || parentLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Yêu cầu thuốc đã hoàn thành và quá hạn
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Đã hoàn thành
            </Typography>
            <Typography variant="h4" color="success.main">
              {completedRequests.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Quá hạn
            </Typography>
            <Typography variant="h4" color="error.main">
              {expiredRequests.length}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Đã hủy
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {cancelledRequests.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="completed expired tabs"
        >
          <Tab label={`Đã hoàn thành (${completedRequests.length})`} />
          <Tab label={`Quá hạn (${expiredRequests.length})`} />
          <Tab label={`Đã hủy (${cancelledRequests.length})`} />
        </Tabs>
      </Box>

      {tabValue === 0 && renderRequestsTable(completedRequests)}
      {tabValue === 1 && renderRequestsTable(expiredRequests, true)}
      {tabValue === 2 && renderRequestsTable(cancelledRequests)}

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

export default CompletedExpiredRequestsList;
