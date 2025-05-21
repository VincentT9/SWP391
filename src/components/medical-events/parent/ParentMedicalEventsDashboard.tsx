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
} from "@mui/material";
import { format } from "date-fns";
import { MedicalEvent } from "../../../models/types";
import { mockMedicalEvents } from "../../../utils/mockData";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MedicalEventDetails from "../nurse/MedicalEventDetails";

interface ParentMedicalEventsDashboardProps {
  parentId: string;
}

const ParentMedicalEventsDashboard: React.FC<
  ParentMedicalEventsDashboardProps
> = ({ parentId }) => {
  const [events, setEvents] = useState<MedicalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch events for the parent's children from an API
    // For now, just simulate by filtering mock events
    // This is a placeholder since we don't have a parent-child relationship in our mock data
    setEvents(mockMedicalEvents);
  }, [parentId]);

  const handleViewEvent = (event: MedicalEvent) => {
    setSelectedEvent(event);
    setIsViewingDetails(true);
  };

  const handleBackToList = () => {
    setIsViewingDetails(false);
    setSelectedEvent(null);
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "injury":
        return "Chấn thương";
      case "illness":
        return "Bệnh";
      case "emergency":
        return "Khẩn cấp";
      default:
        return "Khác";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "injury":
        return "warning";
      case "illness":
        return "info";
      case "emergency":
        return "error";
      default:
        return "default";
    }
  };

  const getOutcomeLabel = (outcome: string) => {
    switch (outcome) {
      case "resolved":
        return "Đã ổn định";
      case "referred":
        return "Chuyển tuyến";
      case "sent home":
        return "Cho về nhà";
      case "hospitalized":
        return "Nhập viện";
      default:
        return outcome;
    }
  };

  const getOutcomeColor = (
    outcome: string
  ): "success" | "warning" | "error" | "default" => {
    switch (outcome) {
      case "resolved":
        return "success";
      case "referred":
        return "warning";
      case "sent home":
        return "warning";
      case "hospitalized":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Sự kiện y tế của học sinh
      </Typography>

      {isViewingDetails && selectedEvent ? (
        <MedicalEventDetails event={selectedEvent} onBack={handleBackToList} />
      ) : (
        <>
          {events.length === 0 ? (
            <Alert severity="info">
              Không có sự kiện y tế nào được ghi nhận cho học sinh của bạn.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Thời gian</TableCell>
                    <TableCell>Loại</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Xử lý</TableCell>
                    <TableCell>Kết quả</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} hover>
                      <TableCell>
                        {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getEventTypeLabel(event.type)}
                          color={getEventTypeColor(event.type) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{event.description}</TableCell>
                      <TableCell>{event.treatment.slice(0, 30)}...</TableCell>
                      <TableCell>
                        <Chip
                          label={getOutcomeLabel(event.outcome)}
                          color={getOutcomeColor(event.outcome)}
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
          )}
        </>
      )}
    </Box>
  );
};

export default ParentMedicalEventsDashboard;
