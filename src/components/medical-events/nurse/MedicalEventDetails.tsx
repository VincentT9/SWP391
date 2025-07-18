import React, { useState } from "react";
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
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { format, parseISO } from "date-fns";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { MedicalIncident } from "../../../models/types";
import { isAdmin, isMedicalStaff } from "../../../utils/roleUtils";
import axiosInstance from "../../../utils/axiosConfig";

interface MedicalEventDetailsProps {
  event: MedicalIncident;
  onBack: () => void;
  onEdit?: (event: MedicalIncident) => void;
  onDelete?: (eventId: string) => void;
  onRefresh?: () => void;
}

const MedicalEventDetails: React.FC<MedicalEventDetailsProps> = ({
  event,
  onBack,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Check user permissions
  const canEdit = isAdmin() || isMedicalStaff();
  const canDelete = isAdmin() || isMedicalStaff();
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

  const handleDelete = async () => {
    if (!event.id) return;
    
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/api/medical-incident/delete/${event.id}`);
      setDeleteDialogOpen(false);
      if (onDelete) {
        onDelete(event.id);
      }
      if (onRefresh) {
        onRefresh();
      }
      onBack(); // Navigate back after successful deletion
    } catch (error) {
      console.error("Error deleting medical incident:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mr: 2 }}>
          Quay lại
        </Button>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>Chi tiết sự kiện y tế</Typography>
        
        <Stack direction="row" spacing={2}>
          {canEdit && onEdit && (
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<EditIcon />}
              onClick={() => onEdit(event)}
            >
              Chỉnh sửa
            </Button>
          )}
          
          {canDelete && (
            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Xóa
            </Button>
          )}
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Loại sự kiện
            </Typography>
            <Chip
              label={getEventTypeLabel(event.incidentType)}
              color={getEventTypeColor(event.incidentType) as any}
              sx={{ mt: 0.5 }}
            />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" align="right">
              Ngày xảy ra
            </Typography>
            <Typography variant="body1" align="right">
              {format(parseISO(event.incidentDate), "dd/MM/yyyy HH:mm")}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Thông tin học sinh
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              {event.student.fullName}
            </Typography>
            <Typography variant="body2">
              Mã học sinh: {event.student.studentCode}
            </Typography>
            <Typography variant="body2">
              Lớp: {event.student.class} | Niên khóa: {event.student.schoolYear}
            </Typography>
            <Typography variant="body2">
              Ngày sinh:{" "}
              {format(parseISO(event.student.dateOfBirth), "dd/MM/yyyy")}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Mô tả sự kiện
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {event.description}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Hành động đã thực hiện
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {event.actionsTaken}
          </Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            Kết quả
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            {event.outcome || "Chưa có thông tin"}
          </Typography>
        </Box>

        {event.medicalSupplyUsages && event.medicalSupplyUsages.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary">
              Vật tư y tế đã sử dụng
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mt: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Ngày sử dụng</TableCell>
                    <TableCell>Ghi chú</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {event.medicalSupplyUsages.map((supply, index) => (
                    <TableRow key={index}>
                      <TableCell>{(supply as any).medicalSupplierId || (supply as any).supplyId}</TableCell>
                      <TableCell>{(supply as any).quantityUsed || (supply as any).quantity}</TableCell>
                      <TableCell>{(supply as any).usageDate ? new Date((supply as any).usageDate).toLocaleDateString() : 'N/A'}</TableCell>
                      <TableCell>{(supply as any).notes || 'Không có'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Box>
          <Typography variant="body2" color="text.secondary">
            Trạng thái
          </Typography>
          <Chip
            label={getStatusLabel(event.status)}
            color={getStatusColor(event.status)}
            sx={{ mt: 0.5 }}
          />
        </Box>

        
      </Stack>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Xác nhận xóa sự kiện y tế
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bạn có chắc chắn muốn xóa sự kiện y tế này không? Hành động này không thể hoàn tác.
            <br />
            <strong>Học sinh:</strong> {event.student.fullName}
            <br />
            <strong>Ngày xảy ra:</strong> {format(parseISO(event.incidentDate), "dd/MM/yyyy HH:mm")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default MedicalEventDetails;
