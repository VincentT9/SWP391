import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Alert,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import VaccinationProgramList from "./VaccinationProgramList";
import VaccinationProgramForm from "./VaccinationProgramForm";
import VaccinationProgramDetails from "./VaccinationProgramDetails";
import instance from "../../utils/axiosConfig";

const VaccinationPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<any[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [refresh, setRefresh] = useState(0);

  // Thay đổi kiểu dữ liệu của state typeFilter từ number | null thành string | number
  const [typeFilter, setTypeFilter] = useState<string | number>("all"); // Sử dụng "all" thay vì null

  const navigate = useNavigate();

  // Load vaccination campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        let url = "/api/Campaign/get-all-campaigns";

        // Filter by status if tab is not "All"
        if (tabValue > 0 && tabValue <= 4) {
          const status = tabValue - 1; // Adjust to match status enum
          url = `/api/Campaign/get-campaigns-by-status/${status}`;
        }

        const response = await instance.get(url);
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setCampaigns(data);

        // Áp dụng lọc theo loại chương trình
        applyFilters(data);

        setError(null);
      } catch (err) {
        console.error("Error fetching vaccination campaigns:", err);
        setError(
          "Không thể tải danh sách chương trình tiêm chủng. Vui lòng thử lại sau."
        );
        setCampaigns([]);
        setFilteredCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [tabValue, refresh]);

  // Thêm useEffect để áp dụng bộ lọc khi type filter thay đổi
  useEffect(() => {
    applyFilters(campaigns);
  }, [typeFilter, campaigns]);

  // Hàm áp dụng bộ lọc
  const applyFilters = (data: any[]) => {
    if (!data.length) {
      setFilteredCampaigns([]);
      return;
    }

    let result = [...data];

    // Áp dụng lọc theo loại chương trình nếu có
    if (typeFilter !== "all") {
      // Sử dụng "all" thay vì null
      result = result.filter((campaign) => campaign.type === typeFilter);
    }

    setFilteredCampaigns(result);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Hàm xử lý thay đổi bộ lọc loại chương trình
  const handleTypeFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newTypeFilter: string | number | null // Cập nhật kiểu dữ liệu phù hợp
  ) => {
    // Nếu newTypeFilter là null, gán thành "all", nếu không thì giữ nguyên
    setTypeFilter(newTypeFilter === null ? "all" : newTypeFilter);
  };

  const handleCreateClick = () => {
    setIsCreating(true);
    setIsViewingDetails(false);
  };

  const handleCampaignSelect = (campaign: any) => {
    setSelectedCampaign(campaign);
    setIsViewingDetails(true);
    setIsCreating(false);
  };

  const handleSaveCampaign = async (campaignData: any) => {
    try {
      const newCampaignData = {
        name: campaignData.campaignName,
        description: campaignData.description,
        status: 0, // Mặc định là "Đã lên kế hoạch"
        type: campaignData.type, // Sử dụng type đã chọn từ form
      };

      await instance.post("/api/Campaign/create-campaign", newCampaignData);
      toast.success(
        campaignData.type === 0
          ? "Tạo chương trình tiêm chủng thành công!"
          : "Tạo chương trình khám sức khỏe thành công!"
      );
      setIsCreating(false);
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error("Không thể tạo chương trình. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsViewingDetails(false);
  };

  const handleBackToList = (shouldRefresh = false) => {
    setIsViewingDetails(false);
    if (shouldRefresh) {
      setRefresh((prev) => prev + 1); // Refresh danh sách
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0:
        return "Đã lên kế hoạch";
      case 1:
        return "Đang tiến hành";
      case 2:
        return "Đã hoàn thành";
      case 3:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Hàm xử lý refresh
  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  // Lấy tổng số chương trình theo từng loại
  const countByType = {
    all: campaigns.length,
    vaccination: campaigns.filter((c) => c.type === 0).length,
    healthcheck: campaigns.filter((c) => c.type === 1).length,
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Quản lý chương trình tiêm chủng
        </Typography>

        {!isCreating && !isViewingDetails && (
          <>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <FilterAltIcon
                      fontSize="small"
                      sx={{ verticalAlign: "middle", mr: 0.5 }}
                    />
                    Lọc theo loại chương trình:
                  </Typography>
                  <ToggleButtonGroup
                    value={typeFilter}
                    exclusive
                    onChange={handleTypeFilterChange}
                    aria-label="campaign type filter"
                    size="small"
                  >
                    <ToggleButton value="all" aria-label="all types">
                      Tất cả ({countByType.all})
                    </ToggleButton>
                    <ToggleButton value={0} aria-label="vaccination programs">
                      <VaccinesIcon fontSize="small" sx={{ mr: 0.5 }} />
                      Tiêm chủng ({countByType.vaccination})
                    </ToggleButton>
                    <ToggleButton
                      value={1}
                      aria-label="health checkup programs"
                    >
                      <MedicalInformationIcon
                        fontSize="small"
                        sx={{ mr: 0.5 }}
                      />
                      Khám sức khỏe ({countByType.healthcheck})
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateClick}
                >
                  Tạo chương trình
                </Button>
              </Stack>
            </Paper>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Paper
                sx={{ flexGrow: 1, borderBottom: 1, borderColor: "divider" }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="Tất cả" />
                  <Tab label="Lên kế hoạch" />
                  <Tab label="Đang tiến hành" />
                  <Tab label="Đã hoàn thành" />
                  <Tab label="Đã hủy" />
                </Tabs>
              </Paper>
            </Box>

            {typeFilter !== "all" && (
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={`Đang lọc: ${
                    typeFilter === 0 ? "Tiêm chủng" : "Khám sức khỏe"
                  }`}
                  color="primary"
                  variant="outlined"
                  onDelete={() => setTypeFilter("all")}
                  sx={{ mr: 1 }}
                />
              </Box>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {filteredCampaigns.length === 0 && !loading && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Không có chương trình nào phù hợp với bộ lọc hiện tại.
                  </Alert>
                )}
                <VaccinationProgramList
                  campaigns={filteredCampaigns} // Sử dụng danh sách đã lọc
                  onCampaignSelect={handleCampaignSelect}
                  getStatusLabel={getStatusLabel}
                  onRefresh={handleRefresh}
                />
              </>
            )}
          </>
        )}

        {isCreating && (
          <VaccinationProgramForm
            onSave={handleSaveCampaign}
            onCancel={handleCancel}
          />
        )}

        {isViewingDetails && selectedCampaign && (
          <VaccinationProgramDetails
            campaign={selectedCampaign}
            onBack={handleBackToList}
            getStatusLabel={getStatusLabel}
            onDeleteSuccess={() => handleBackToList(true)}
          />
        )}
      </Box>
    </Container>
  );
};

export default VaccinationPage;
