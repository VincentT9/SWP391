import React from "react";
import {
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MedicalEvent } from "../../../models/types";

interface MedicalEventDetailsProps {
  event: MedicalEvent;
  onBack: () => void;
}

const MedicalEventDetails: React.FC<MedicalEventDetailsProps> = ({
  event,
  onBack,
}) => {
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
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mr: 2 }}>
          Quay lại
        </Button>
        <Typography variant="h5">Chi tiết sự kiện y tế</Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Mã sự kiện
            </Typography>
            <Typography variant="body1">{event.id}</Typography>
          </Box>
          <Chip
            label={getEventTypeLabel(event.type)}
            color={getEventTypeColor(event.type) as any}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Thời gian xảy ra
          </Typography>
          <Typography variant="body1">
            {format(new Date(event.date), "dd/MM/yyyy HH:mm")}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Học sinh
          </Typography>
          <Typography variant="body1">ID: {event.studentId}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Mô tả chi tiết
          </Typography>
          <Typography variant="body1">{event.description}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Triệu chứng
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {event.symptoms.map((symptom, index) => (
              <Chip
                key={index}
                label={symptom}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Biện pháp xử lý
          </Typography>
          <Typography variant="body1">{event.treatment}</Typography>
        </Box>

        {event.medicationsGiven.length > 0 && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Thuốc đã sử dụng
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
              <Table size="small">
                <TableBody>
                  {event.medicationsGiven.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>{med.medicationName}</TableCell>
                      <TableCell>{med.dosage}</TableCell>
                      <TableCell>
                        {format(new Date(med.time), "dd/MM/yyyy HH:mm")}
                      </TableCell>
                      <TableCell>{med.administeredBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Kết quả xử lý
          </Typography>
          <Chip
            label={getOutcomeLabel(event.outcome)}
            color={getOutcomeColor(event.outcome)}
            size="small"
            sx={{ mt: 1 }}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Người xử lý
          </Typography>
          <Typography variant="body1">{event.attendedBy}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Thông báo phụ huynh
          </Typography>
          <Typography variant="body1">
            {event.notifiedParent ? (
              <>
                Đã thông báo lúc{" "}
                {format(new Date(event.notifiedAt!), "dd/MM/yyyy HH:mm")}
              </>
            ) : (
              "Chưa thông báo"
            )}
          </Typography>
          {event.notifiedParent && event.parentResponse && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Phản hồi từ phụ huynh
              </Typography>
              <Typography variant="body1">{event.parentResponse}</Typography>
            </Box>
          )}
        </Box>

        {event.notes && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Ghi chú
            </Typography>
            <Typography variant="body1">{event.notes}</Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
};

export default MedicalEventDetails;
