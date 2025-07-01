import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete"; // Thêm import
import { format } from "date-fns";
import instance from "../../utils/axiosConfig"; // Thêm import
import { toast } from "react-toastify"; // Thêm import
import { isAdmin } from "../../utils/roleUtils";

interface VaccinationProgramListProps {
  campaigns: any[];
  onCampaignSelect: (campaign: any) => void;
  getStatusLabel: (status: number) => string;
  onRefresh: () => void; // Thêm prop này để refresh danh sách sau khi xóa
}

const VaccinationProgramList: React.FC<VaccinationProgramListProps> = ({
  campaigns,
  onCampaignSelect,
  getStatusLabel,
  onRefresh,
}) => {
  const [confirmDeleteOpen, setConfirmDeleteOpen] = React.useState(false);
  const [campaignToDelete, setCampaignToDelete] = React.useState<any>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  // Thêm hàm xử lý xóa chương trình
  const handleDeleteClick = (event: React.MouseEvent, campaign: any) => {
    event.stopPropagation(); // Ngăn không cho sự kiện lan sang hàng (ngăn mở chi tiết)
    setCampaignToDelete(campaign);
    setConfirmDeleteOpen(true);
  };

  // Cập nhật hàm handleConfirmDelete để hiển thị thông báo thành công trước khi refresh
  const handleConfirmDelete = async () => {
    if (!campaignToDelete) return;

    setIsDeleting(true);
    try {
      await instance.delete(
        `/api/Campaign/delete-campaign/${campaignToDelete.id}`
      );

      // Cập nhật UI trước khi gọi callback
      // Xóa campaign đã bị xóa khỏi campaigns (state local)
      const updatedCampaigns = campaigns.filter(
        (c) => c.id !== campaignToDelete.id
      );
      // Nếu có prop setCampaigns từ parent, gọi nó để cập nhật
      // setCampaigns(updatedCampaigns);

      // Hiển thị thông báo thành công
      toast.success("Xóa chương trình thành công!");

      // Đóng dialog
      setConfirmDeleteOpen(false);
      setCampaignToDelete(null);

      // Gọi onRefresh để làm mới data từ server
      onRefresh();
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
    setConfirmDeleteOpen(false);
    setCampaignToDelete(null);
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "info"; // Planned
      case 1:
        return "warning"; // In Progress
      case 2:
        return "success"; // Completed
      case 3:
        return "error"; // Cancelled
      default:
        return "default";
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

  return (
    <Box>
      {campaigns.length === 0 ? (
        <Alert severity="info">
          Không có chương trình tiêm chủng nào trong danh mục này.
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="vaccination programs table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Tên chương trình
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Loại</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Ngày tạo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Người tạo</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Số lịch</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow
                  key={campaign.id}
                  hover
                  onClick={() => onCampaignSelect(campaign)}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                      {campaign.name}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {campaign.description.length > 50
                        ? `${campaign.description.substring(0, 50)}...`
                        : campaign.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{getCampaignTypeLabel(campaign.type)}</TableCell>
                  <TableCell>{formatDate(campaign.createAt)}</TableCell>
                  <TableCell>{campaign.createdBy || "N/A"}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(campaign.status)}
                      color={getStatusColor(campaign.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {campaign.schedules ? campaign.schedules.length : 0} lịch
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex" }}>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCampaignSelect(campaign);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      {/* Only show delete button for admins */}
                      {isAdmin() && (
                        <Tooltip title="Xóa chương trình">
                          <IconButton
                            color="error"
                            onClick={(e) => handleDeleteClick(e, campaign)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog xác nhận xóa */}
      <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa chương trình{" "}
            <strong>{campaignToDelete?.name}</strong>?<br />
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
    </Box>
  );
};

export default VaccinationProgramList;
