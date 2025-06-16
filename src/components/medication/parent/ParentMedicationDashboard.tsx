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
import axios from "axios";

// Mock data imports - would be replaced with API calls
import { medicationRequests, medicationLogs } from "../../../utils/mockData";
import MedicationLogView from "../../medication/MedicationLogView";

// New interface for student data based on API response
interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  class: string;
  schoolYear: string;
  image: string;
  healthRecord?: {
    id: string;
    height: string;
    weight: string;
    bloodType: string;
    allergies: string;
    chronicDiseases: string;
    pastMedicalHistory: string;
    visionLeft: string;
    visionRight: string;
    hearingLeft: string;
    hearingRight: string;
    vaccinationHistory: string;
    otherNotes: string;
  };
}

interface StudentOption {
  id: string;
  name: string;
}

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
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch students associated with the parent
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const baseUrl =
          process.env.REACT_APP_BASE_URL || "http://localhost:5112";
        const response = await axios.get<Student[]>(
          `${baseUrl}/api/Student/get-student-by-parent-id/${parentId}`
        );

        // Transform the API response into the format needed for student options
        const options: StudentOption[] = response.data.map((student) => ({
          id: student.id,
          name: student.fullName,
        }));

        setStudentOptions(options);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [parentId]);

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
            loading={loading}
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
