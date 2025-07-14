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
import { MedicalIncident, Student } from "../../../models/types";
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
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MedicalIncident | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentsAndMedicalIncidents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Bước 1: Lấy danh sách học sinh của phụ huynh
        const studentsResponse = await axios.get(`/api/Student/get-student-by-parent-id/${parentId}`);
        const studentsList = studentsResponse.data;
        setStudents(studentsList);

        // Bước 2: Lấy tất cả sự kiện y tế của từng học sinh
        const allEvents: MedicalIncident[] = [];
        for (const student of studentsList) {
          try {
            const eventsResponse = await axios.get(`/api/medical-incident/student/${student.id}`);
            allEvents.push(...eventsResponse.data);
          } catch (err) {
            console.warn(`Không thể tải sự kiện y tế cho học sinh ${student.firstName} ${student.lastName}:`, err);
          }
        }

        setEvents(allEvents);
      } catch (err) {
        console.error("Error fetching data:", err);
        // setError("Có lỗi khi tải dữ liệu học sinh hoặc sự kiện y tế");
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentsAndMedicalIncidents();
  }, [parentId]);

  // Sắp xếp sự kiện theo thời gian mới nhất trước
  const sortedEvents = events.sort((a, b) => 
    new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime()
  );

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
        Sự kiện y tế của con em
      </Typography>

      {students.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Hiển thị sự kiện y tế của: {students.map(s => `${s.firstName} ${s.lastName}`).join(', ')}
          <br />
          Tổng số sự kiện: {events.length}
        </Typography>
      )}

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
          {!loading && events.length === 0 && students.length === 0 ? (
            <Alert severity="info">
              Bạn chưa có học sinh nào được đăng ký trong hệ thống.
            </Alert>
          ) : !loading && events.length === 0 && students.length > 0 ? (
            <Alert severity="info">
              Không có sự kiện y tế nào được ghi nhận cho con em của bạn.
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
                    {sortedEvents.map((event) => (
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
