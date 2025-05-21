import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import { format } from "date-fns";
import NurseMedicationList from "./NurseMedicationList";
import MedicationAdministrationForm from "./MedicationAdministrationForm";
import { MedicationRequest } from "../../../models/types";

// Mock data imports - would be replaced with API calls
import { medicationRequests } from "../../../utils/mockData";

interface NurseMedicationDashboardProps {
  nurseId: string;
  nurseName: string;
}

const NurseMedicationDashboard: React.FC<NurseMedicationDashboardProps> = ({
  nurseId,
  nurseName,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [todayMedications, setTodayMedications] = useState<MedicationRequest[]>(
    []
  );

  // Load all medication requests
  useEffect(() => {
    // In a real app, this would fetch from API
    setRequests([...medicationRequests]);

    // Filter medications for today
    const today = new Date();
    const medicationsForToday = medicationRequests.filter((req) => {
      // Only include medications that are in the "received" status
      if (req.status !== "received") return false;

      // Check if today is within the medication date range
      const startDate = new Date(req.startDate);
      const endDate = new Date(req.endDate);
      return today >= startDate && today <= endDate;
    });

    setTodayMedications(medicationsForToday);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReceiveMedication = (requestId: string) => {
    // Find the request
    const requestIndex = medicationRequests.findIndex(
      (req) => req.id === requestId
    );
    if (requestIndex !== -1) {
      // Update the request status
      medicationRequests[requestIndex].status = "received";
      medicationRequests[requestIndex].receivedBy = nurseId;
      medicationRequests[requestIndex].receivedAt = new Date();
      medicationRequests[requestIndex].updatedAt = new Date();

      // Update local state
      setRequests([...medicationRequests]);

      // If the medication should start today, add it to the today medications list
      const today = new Date();
      const startDate = new Date(medicationRequests[requestIndex].startDate);
      const endDate = new Date(medicationRequests[requestIndex].endDate);

      if (today >= startDate && today <= endDate) {
        setTodayMedications((prev) => [
          ...prev,
          medicationRequests[requestIndex],
        ]);
      }
    }
  };

  const handleMedicationAdministered = () => {
    // Refresh the medications for today (in a real app, this would call the API)
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý thuốc
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="medication management tabs"
          >
            <Tab label="Thuốc hôm nay" />
            <Tab label="Danh sách thuốc" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Thuốc cần cho học sinh uống hôm nay (
              {format(new Date(), "dd/MM/yyyy")})
            </Typography>

            {todayMedications.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                Hôm nay không có học sinh nào cần uống thuốc.
              </Typography>
            ) : (
              <Box>
                {todayMedications.map((medication) => (
                  <Box key={medication.id} sx={{ mb: 3 }}>
                    <MedicationAdministrationForm
                      medicationRequest={medication}
                      nurseName={nurseName}
                      onMedicationAdministered={handleMedicationAdministered}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <NurseMedicationList
            requests={requests}
            onReceiveMedication={handleReceiveMedication}
          />
        )}
      </Box>
    </Container>
  );
};

export default NurseMedicationDashboard;
