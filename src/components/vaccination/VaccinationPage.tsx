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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
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
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [refresh, setRefresh] = useState(0);

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
        setCampaigns(
          Array.isArray(response.data) ? response.data : [response.data]
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching vaccination campaigns:", err);
        setError(
          "Không thể tải danh sách chương trình tiêm chủng. Vui lòng thử lại sau."
        );
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [tabValue, refresh]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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

  // Thêm hàm xử lý refresh
  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Quản lý chương trình tiêm chủng
        </Typography>

        {!isCreating && !isViewingDetails && (
          <>
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
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
                sx={{ ml: 2 }}
              >
                Tạo chương trình
              </Button>
            </Box>

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
              <VaccinationProgramList
                campaigns={campaigns}
                onCampaignSelect={handleCampaignSelect}
                getStatusLabel={getStatusLabel}
                onRefresh={handleRefresh} // Thêm prop này
              />
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
            onDeleteSuccess={() => handleBackToList(true)} // Thêm prop mới
          />
        )}
      </Box>
    </Container>
  );
};

export default VaccinationPage;
