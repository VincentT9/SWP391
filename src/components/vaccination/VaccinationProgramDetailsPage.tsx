import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Alert } from "@mui/material";
import VaccinationProgramDetails from "./VaccinationProgramDetails";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify";

const VaccinationProgramDetailsPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    if (!campaignId) return;

    setLoading(true);
    try {
      const response = await instance.get(
        `/api/Campaign/get-campaign-by-id/${campaignId}`
      );
      setCampaign(response.data);
    } catch (err) {
      console.error("Error fetching campaign details:", err);
      // setError("Không thể tải thông tin chương trình. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/vaccination");
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

  const handleDeleteSuccess = () => {
    toast.success("Đã xóa chương trình thành công");
    navigate("/vaccination");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!campaign) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Không tìm thấy thông tin chương trình với ID: {campaignId}
      </Alert>
    );
  }

  return (
    <VaccinationProgramDetails
      campaign={campaign}
      onBack={handleBack}
      getStatusLabel={getStatusLabel}
      onDeleteSuccess={handleDeleteSuccess}
    />
  );
};

export default VaccinationProgramDetailsPage;
