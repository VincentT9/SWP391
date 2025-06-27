import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add"; // Thêm import cho icon thêm mới
import { format } from "date-fns";
import EditVaccinationProgramDialog from "./EditVaccinationProgramDialog";
import ScheduleStudentListDialog from "./ScheduleStudentListDialog";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import EditScheduleDialog from "./EditScheduleDialog";

// Cập nhật interface để thêm prop onDeleteSuccess
interface VaccinationProgramDetailsProps {
  campaign: any;
  onBack: () => void;
  getStatusLabel: (status: number) => string;
  onDeleteSuccess: () => void; // Thêm prop mới
}

const VaccinationProgramDetails: React.FC<VaccinationProgramDetailsProps> = ({
  campaign: initialCampaign,
  onBack,
  getStatusLabel,
  onDeleteSuccess,
}) => {
  // Lưu trữ bản sao của campaign để có thể cập nhật nội bộ
  const [campaign, setCampaign] = useState(initialCampaign);

  // State hiện tại
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStudentListDialogOpen, setIsStudentListDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State mới cho lịch tiêm
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<any>(null);
  const [isDeleteScheduleDialogOpen, setIsDeleteScheduleDialogOpen] =
    useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<any>(null);
  const [isDeletingSchedule, setIsDeletingSchedule] = useState(false);
  const [processingItems, setProcessingItems] = useState<Set<string>>(
    new Set()
  );

  // Cập nhật campaign khi initialCampaign thay đổi
  useEffect(() => {
    setCampaign(initialCampaign);
  }, [initialCampaign]);

  // Fetch schedules khi campaign thay đổi
  useEffect(() => {
    if (campaign?.id) {
      // Khởi tạo danh sách lịch từ dữ liệu có sẵn trong campaign
      setSchedules(campaign.schedules || []);

      // Không cần gọi fetchSchedules nữa
    }
  }, [campaign]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditSuccess = () => {
    // Có thể thêm logic refresh dữ liệu nếu cần
  };

  const handleViewStudentsClick = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsStudentListDialogOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  // Cập nhật hàm handleConfirmDelete
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await instance.delete(`/api/Campaign/delete-campaign/${campaign.id}`);
      toast.success("Xóa chương trình thành công!");
      setIsDeleteDialogOpen(false);
      // Thay vì gọi onBack(), gọi onDeleteSuccess()
      onDeleteSuccess(); // Sẽ làm mới danh sách và quay về
    } catch (error: any) {
      console.error("Error deleting campaign:", error);
      toast.error(
        error.response?.data?.message ||
          "Không thể xóa chương trình. Vui lòng thử lại."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
  };

  const getStatusChip = (status: number) => {
    switch (status) {
      case 0:
        return <Chip size="small" label="Đã lên kế hoạch" color="info" />;
      case 1:
        return <Chip size="small" label="Đang tiến hành" color="warning" />;
      case 2:
        return <Chip size="small" label="Đã hoàn thành" color="success" />;
      case 3:
        return <Chip size="small" label="Đã hủy" color="error" />;
      default:
        return <Chip size="small" label="Không xác định" color="default" />;
    }
  };

  const getCampaignTypeLabel = (type: number) => {
    switch (type) {
      case 0:
        return "Tiêm chủng";
      case 1:
        return "Khám sức khỏe";
      default:
        return "Không xác định";
    }
  };

  // Hàm refresh thông tin campaign
  const refreshCampaign = useCallback(async () => {
    try {
      if (!campaign?.id) return;

      setIsLoading(true);
      const response = await instance.get(
        `/api/Campaign/get-campaign-by-id/${campaign.id}`
      );
      if (response.data) {
        setCampaign(response.data);
        // Cập nhật schedules từ campaign
        setSchedules(response.data.schedules || []);
      }
    } catch (error) {
      console.error("Error refreshing campaign details:", error);
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  }, [campaign?.id]);

  // Hàm xử lý thêm lịch mới
  const handleAddSchedule = () => {
    console.log("Adding schedule for campaign:", campaign);
    
    if (!campaign?.id) {
      toast.error("Không thể thêm lịch: thiếu thông tin chương trình");
      return;
    }
    
    // Kiểm tra campaignId có hợp lệ không
    if (typeof campaign.id !== "string" || campaign.id.trim() === "") {
      toast.error("ID chương trình không hợp lệ");
      return;
    }
    
    setScheduleToEdit(null); // Đảm bảo không có schedule nào được chọn
    setIsScheduleDialogOpen(true);
  };

  // Hàm xử lý sửa lịch
  const handleEditSchedule = (e: React.MouseEvent, schedule: any) => {
    e.stopPropagation(); // Ngăn sự kiện click lan đến hàng

    // Kiểm tra nếu ID bắt đầu bằng "temp-" thì không cho phép sửa
    if (schedule.id.toString().startsWith("temp-")) {
      toast.warning("Lịch đang được xử lý, vui lòng đợi...");
      return;
    }

    setScheduleToEdit(schedule);
    setIsScheduleDialogOpen(true);
  };

  // Hàm xử lý xóa lịch
  const handleDeleteSchedule = (e: React.MouseEvent, schedule: any) => {
    e.stopPropagation(); // Ngăn sự kiện click lan đến hàng

    // Kiểm tra nếu ID bắt đầu bằng "temp-" thì không cho phép xóa
    if (schedule.id.toString().startsWith("temp-")) {
      toast.warning("Lịch đang được xử lý, vui lòng đợi...");
      return;
    }

    setScheduleToDelete(schedule);
    setIsDeleteScheduleDialogOpen(true);
  };

  // Hàm xác nhận xóa lịch
  const handleConfirmDeleteSchedule = async () => {
    if (!scheduleToDelete) return;

    setIsDeletingSchedule(true);

    // Optimistic update - xóa lịch khỏi UI ngay lập tức
    const currentSchedules = [...schedules];
    const updatedSchedules = currentSchedules.filter(
      (s) => s.id !== scheduleToDelete.id
    );
    setSchedules(updatedSchedules);

    try {
      await instance.delete(
        `/api/Schedule/delete-schedule/${scheduleToDelete.id}`
      );
      toast.success("Xóa lịch thành công!");
      setIsDeleteScheduleDialogOpen(false);
      setScheduleToDelete(null);

      // Refresh campaign để cập nhật danh sách lịch
      setTimeout(() => {
        refreshCampaign();
      }, 800);
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      toast.error(
        error.response?.data?.message || "Không thể xóa lịch. Vui lòng thử lại."
      );

      // Nếu xóa thất bại, phục hồi danh sách lịch ban đầu
      setSchedules(currentSchedules);
    } finally {
      setIsDeletingSchedule(false);
    }
  };

  // Hàm xử lý thêm/sửa lịch thành công
  const handleScheduleSuccess = (updatedSchedule: any, isNew: boolean) => {
    // Optimistic update UI
    if (isNew) {
      // Thêm mới: cập nhật UI tạm thời
      setSchedules((prev) => [...prev, updatedSchedule]);

      // Đặt timeout để refresh campaign sau khi API xử lý xong
      setTimeout(() => {
        refreshCampaign();
      }, 800);
    } else {
      // Cập nhật: cập nhật UI tạm thời
      setSchedules((prev) =>
        prev.map((s) => (s.id === updatedSchedule.id ? updatedSchedule : s))
      );

      // Refresh campaign sau khi cập nhật
      setTimeout(() => {
        refreshCampaign();
      }, 800);
    }
  };

  // Hàm xử lý cập nhật ID tạm thành ID thật
  const handleUpdateTempId = (tempId: string, realId: string) => {
    setSchedules((prev) =>
      prev.map((schedule) => {
        if (schedule.id === tempId) {
          return { ...schedule, id: realId };
        }
        return schedule;
      })
    );
  };

  // Hàm xử lý xóa item tạm nếu API gọi thất bại
  const handleRemoveTempItem = (tempId: string) => {
    setSchedules((prev) => prev.filter((schedule) => schedule.id !== tempId));
  };

  // Hàm render các nút thao tác
  const renderActionButtons = (schedule: any) => {
    const isTemporary = schedule.id.toString().startsWith("temp-");

    return (
      <Box sx={{ display: "flex" }}>
        <Tooltip
          title={isTemporary ? "Đang xử lý..." : "Xem danh sách học sinh"}
        >
          <span>
            {" "}
            {/* Bọc trong span để Tooltip hoạt động khi button disabled */}
            <IconButton
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                if (!isTemporary) {
                  handleViewStudentsClick(schedule);
                }
              }}
              disabled={isTemporary}
            >
              <PeopleIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={isTemporary ? "Đang xử lý..." : "Chỉnh sửa lịch"}>
          <span>
            <IconButton
              size="small"
              color="info"
              onClick={(e) => handleEditSchedule(e, schedule)}
              disabled={isTemporary}
            >
              {isTemporary ? <CircularProgress size={20} /> : <EditIcon />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={isTemporary ? "Đang xử lý..." : "Xóa lịch"}>
          <span>
            <IconButton
              size="small"
              color="error"
              onClick={(e) => handleDeleteSchedule(e, schedule)}
              disabled={isTemporary}
            >
              <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    );
  };

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
        Quay lại danh sách
      </Button>

      <Paper elevation={1} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "flex-start" },
              mb: 2,
            }}
          >
            <Box sx={{ flexGrow: 1, width: { xs: "100%", md: "70%" } }}>
              <Typography variant="h5" gutterBottom>
                {campaign.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {campaign.description}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Loại:{" "}
                  <Chip
                    size="small"
                    label={getCampaignTypeLabel(campaign.type)}
                    color="primary"
                  />
                </Typography>
                <Typography variant="body2">
                  Trạng thái: {getStatusChip(campaign.status)}
                </Typography>
                <Typography variant="body2">
                  Người tạo: {campaign.createdBy || "N/A"}
                </Typography>
                <Typography variant="body2">
                  Ngày tạo: {formatDate(campaign.createAt)}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                mt: { xs: 2, md: 0 },
                display: "flex",
                justifyContent: { xs: "flex-start", md: "flex-end" },
                width: { xs: "100%", md: "30%" },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mr: 1 }}
                onClick={handleEditClick}
              >
                Chỉnh sửa
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Xóa
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ width: "100%" }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">
              Lịch {campaign.type === 0 ? "tiêm chủng" : "khám sức khỏe"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 2 }}
            >
              Nhấp vào dòng hoặc biểu tượng{" "}
              <PeopleIcon
                fontSize="small"
                sx={{ verticalAlign: "middle", fontSize: "1rem" }}
              />{" "}
              để xem danh sách học sinh trong lịch
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleAddSchedule}
            >
              Thêm lịch {campaign.type === 0 ? "tiêm" : "khám"}
            </Button>
          </Box>

          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : schedules.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="schedules table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Ngày {campaign.type === 0 ? "tiêm" : "khám"}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Địa điểm</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "180px" }}>
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule: any) => (
                    <TableRow
                      key={schedule.id}
                      hover
                      sx={{
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                      onClick={() => handleViewStudentsClick(schedule)}
                    >
                      <TableCell>
                        {formatDate(schedule.scheduledDate)}
                      </TableCell>
                      <TableCell>{schedule.location}</TableCell>
                      <TableCell>{schedule.notes}</TableCell>
                      <TableCell>{renderActionButtons(schedule)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Alert severity="info">
              Chưa có lịch{" "}
              {campaign.type === 0 ? "tiêm chủng" : "khám sức khỏe"} nào được
              tạo.
            </Alert>
          )}
        </Box>
      </Paper>

      {/* Dialog chỉnh sửa chương trình */}
      <EditVaccinationProgramDialog
        open={isEditDialogOpen}
        campaign={campaign}
        onClose={handleEditDialogClose}
        onSuccess={handleEditSuccess}
      />

      {/* Dialog danh sách học sinh */}
      {selectedSchedule && (
        <ScheduleStudentListDialog
          open={isStudentListDialogOpen}
          onClose={() => setIsStudentListDialogOpen(false)}
          schedule={selectedSchedule}
          campaignType={campaign.type}
        />
      )}

      {/* Dialog xác nhận xóa chương trình */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Xác nhận xóa chương trình</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa chương trình{" "}
            <strong>{campaign.name}</strong>?
            <br />
            Hành động này không thể hoàn tác và sẽ xóa tất cả lịch tiêm/khám và
            dữ liệu liên quan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} disabled={isDeleting}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm/sửa lịch tiêm */}
      <EditScheduleDialog
        open={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        onSuccess={handleScheduleSuccess}
        schedule={scheduleToEdit}
        campaignId={campaign?.id || ""} // Đảm bảo không truyền undefined
        onUpdateTempId={handleUpdateTempId}
        onRemoveTempItem={handleRemoveTempItem}
      />

      {/* Dialog xác nhận xóa lịch */}
      <Dialog
        open={isDeleteScheduleDialogOpen}
        onClose={() => setIsDeleteScheduleDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa lịch</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa lịch{" "}
            {scheduleToDelete && formatDate(scheduleToDelete.scheduledDate)} tại{" "}
            {scheduleToDelete?.location}?
            <br />
            Hành động này không thể hoàn tác và sẽ xóa tất cả thông tin học sinh
            đã đăng ký.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsDeleteScheduleDialogOpen(false)}
            disabled={isDeletingSchedule}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDeleteSchedule}
            color="error"
            variant="contained"
            disabled={isDeletingSchedule}
          >
            {isDeletingSchedule ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VaccinationProgramDetails;
