import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format, parseISO } from "date-fns";
import { MedicalIncident } from "../../../models/types";

interface MedicalEventsListProps {
  events: MedicalIncident[];
  onEventSelect: (event: MedicalIncident) => void;
}

const MedicalEventsList: React.FC<MedicalEventsListProps> = ({
  events,
  onEventSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = events.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.description.toLowerCase().includes(searchLower) ||
      event.student.fullName.toLowerCase().includes(searchLower) ||
      event.student.class.toLowerCase().includes(searchLower)
    );
  });

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
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo họ tên, mô tả, lớp học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredEvents.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ my: 4 }}>
          Không tìm thấy sự kiện y tế nào.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Thời gian</TableCell>
                <TableCell>Học sinh</TableCell>
                <TableCell>Lớp</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Xử lý</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    {format(parseISO(event.incidentDate), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{event.student.fullName}</TableCell>
                  <TableCell>{event.student.class}</TableCell>
                  <TableCell>
                    <Chip
                      label={getEventTypeLabel(event.incidentType)}
                      color={getEventTypeColor(event.incidentType) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{event.description}</TableCell>
                  <TableCell>
                    {event.actionsTaken.length > 30
                      ? `${event.actionsTaken.slice(0, 30)}...`
                      : event.actionsTaken}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(event.status)}
                      color={getStatusColor(event.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        color="primary"
                        onClick={() => onEventSelect(event)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MedicalEventsList;
