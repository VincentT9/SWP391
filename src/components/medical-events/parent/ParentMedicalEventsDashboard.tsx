import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import { MedicalIncident } from "../../../models/types";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MedicalEventDetails from "../nurse/MedicalEventDetails";
import axios from "../../../utils/axiosConfig";

interface ParentMedicalEventsDashboardProps {
  parentId: string;
}

const ParentMedicalEventsDashboard: React.FC<
  ParentMedicalEventsDashboardProps
> = ({ parentId }) => {
  const [events, setEvents] = useState<MedicalIncident[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MedicalIncident | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalIncidents = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, we would fetch events for the parent's children from an API
        // For this example, we'll use the general endpoint
        const response = await axios.get('/api/medical-incident/all');
        // In a real implementation, you would filter by parent's children
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching medical incidents:", err);
        setError("Có lỗi khi tải dữ liệu sự kiện y tế");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicalIncidents();
  }, [parentId]);

  const handleViewEvent = (event: MedicalIncident) => {
    setSelectedEvent(event);
    setIsViewingDetails(true);
  };

  const handleBackToList = () => {
    setIsViewingDetails(false);
    setSelectedEvent(null);
  };

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
    <Box>
      <Typography variant="h4" gutterBottom>
        Sự kiện y tế của học sinh
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isViewingDetails && selectedEvent ? (
        <MedicalEventDetails event={selectedEvent} onBack={handleBackToList} />
      ) : (
        <>
          {!loading && events.length === 0 ? (
            <Alert severity="info">
              Không có sự kiện y tế nào được ghi nhận cho học sinh của bạn.
            </Alert>
          ) : (
            !loading && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Học sinh</TableCell>
                      <TableCell>Loại</TableCell>
                      <TableCell>Mô tả</TableCell>
                      <TableCell>Xử lý</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell align="center">Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id} hover>
                        <TableCell>
                          {format(parseISO(event.incidentDate), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          {event.student.fullName} - {event.student.class}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getEventTypeLabel(event.incidentType)}
                            color={getEventTypeColor(event.incidentType) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell>{event.actionsTaken.length > 30 ? 
                          `${event.actionsTaken.slice(0, 30)}...` : event.actionsTaken}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusLabel(event.status)}
                            color={getStatusColor(event.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            startIcon={<VisibilityIcon />}
                            size="small"
                            onClick={() => handleViewEvent(event)}
                          >
                            Chi tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          )}
        </>
      )}
    </Box>
  );
};

export default ParentMedicalEventsDashboard;
