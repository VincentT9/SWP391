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
import { format } from "date-fns";
import { MedicalEvent } from "../../../models/types";

interface MedicalEventsListProps {
  events: MedicalEvent[];
  onEventSelect: (event: MedicalEvent) => void;
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
      event.type.toLowerCase().includes(searchLower) ||
      event.symptoms.some((s) => s.toLowerCase().includes(searchLower))
    );
  });

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
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm theo mô tả, loại sự kiện, hoặc triệu chứng..."
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
                <TableCell>Loại</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Xử lý</TableCell>
                <TableCell>Kết quả</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>
                    {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                  <TableCell>ID: {event.studentId}</TableCell>
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
