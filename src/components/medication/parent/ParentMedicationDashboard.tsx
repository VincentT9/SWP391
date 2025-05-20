import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Modal,
  Button,
} from "@mui/material";
import MedicationRequestForm from "./MedicationRequestForm";
import MedicationRequestList from "./MedicationRequestList";
import { MedicationRequest, MedicationLog } from "../../../models/types";

// Mock data imports - would be replaced with API calls
import { medicationRequests, medicationLogs } from "../../../utils/mockData";
import MedicationLogView from "../../medication/MedicationLogView";

interface ParentMedicationDashboardProps {
  parentId: string;
}

const ParentMedicationDashboard: React.FC<ParentMedicationDashboardProps> = ({
  parentId,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<MedicationLog[]>([]);

  // Mock student data - would come from API
  const studentOptions = [
    { id: "1", name: "Nguyen Van An" },
    { id: "2", name: "Le Thi Binh" },
    { id: "3", name: "Pham Van Cuong" },
  ];

  // Load parent's medication requests
  useEffect(() => {
    const parentRequests = medicationRequests.filter(
      (req) => req.parentId === parentId
    );
    setRequests(parentRequests);
  }, [parentId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRequestSubmitted = () => {
    // Refresh the request list
    const parentRequests = medicationRequests.filter(
      (req) => req.parentId === parentId
    );
    setRequests(parentRequests);

    // Switch to the list view tab
    setTabValue(1);
  };

  const handleViewLogs = (requestId: string) => {
    const logs = medicationLogs.filter(
      (log) => log.medicationRequestId === requestId
    );
    setSelectedRequestId(requestId);
    setSelectedLogs(logs);
    setLogModalOpen(true);
  };

  const handleCloseLogModal = () => {
    setLogModalOpen(false);
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
            <Tab label="Gửi thuốc" />
            <Tab label="Danh sách thuốc đã gửi" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <MedicationRequestForm
            parentId={parentId}
            onRequestSubmitted={handleRequestSubmitted}
            studentOptions={studentOptions}
          />
        )}

        {tabValue === 1 && (
          <MedicationRequestList
            requests={requests}
            onViewLogs={handleViewLogs}
          />
        )}

        <Modal
          open={logModalOpen}
          onClose={handleCloseLogModal}
          aria-labelledby="medication-log-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Nhật ký uống thuốc
            </Typography>

            {selectedLogs.length > 0 ? (
              <MedicationLogView logs={selectedLogs} />
            ) : (
              <Typography variant="body1" color="textSecondary">
                Chưa có nhật ký uống thuốc nào.
              </Typography>
            )}

            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button onClick={handleCloseLogModal}>Đóng</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default ParentMedicationDashboard;
