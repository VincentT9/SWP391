import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  Alert,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { format } from "date-fns";

interface VaccinationProgramListProps {
  campaigns: any[];
  onCampaignSelect: (campaign: any) => void;
  getStatusLabel: (status: number) => string;
}

const VaccinationProgramList: React.FC<VaccinationProgramListProps> = ({
  campaigns,
  onCampaignSelect,
  getStatusLabel,
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "info"; // Planned
      case 1:
        return "warning"; // In progress
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
                <TableCell sx={{ fontWeight: "bold" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} hover>
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
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        color="primary"
                        onClick={() => onCampaignSelect(campaign)}
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

export default VaccinationProgramList;
