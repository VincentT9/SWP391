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
  Chip,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import { Visibility as VisibilityIcon } from "@mui/icons-material";
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
  // Helper function to format date safely
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "info"; // Planned
      case 1:
        return "warning"; // InProgress
      case 2:
        return "success"; // Completed
      case 3:
        return "error"; // Cancelled
      default:
        return "default";
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
                <TableCell sx={{ fontWeight: "bold" }}>Loại vaccine</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} hover>
                  <TableCell sx={{ maxWidth: 250 }}>
                    <Typography variant="body2" fontWeight="medium" noWrap>
                      {campaign.campaignName}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" noWrap>
                      {campaign.description.length > 50
                        ? `${campaign.description.substring(0, 50)}...`
                        : campaign.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{campaign.vaccineType}</TableCell>
                  <TableCell>
                    {formatDate(campaign.startDate)} -{" "}
                    {formatDate(campaign.endDate)}
                  </TableCell>
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
