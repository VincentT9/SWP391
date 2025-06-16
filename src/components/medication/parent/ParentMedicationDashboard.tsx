import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Modal,
  CircularProgress,
  Alert,
  Button, // Added Button import
} from "@mui/material";
import MedicationRequestForm from "./MedicationRequestForm";
import MedicationRequestList from "./MedicationRequestList";
import MedicationLogView from "../MedicationLogView";
import MedicationDiaryView from "../MedicationDiaryView"; // Import component mới
import axios from "axios";
import {
  MedicationRequest as MedicationRequestType,
  MedicationLog as MedicationLogType,
  MedicationDiaryEntry,
} from "../../../models/types";
import { addDays as dateAddDays } from "date-fns"; // Renamed to avoid conflict
import instance from "../../../utils/axiosConfig"; // Importing axios instance for API calls
import MedicationRequestDetail from "./MedicationRequestDetail"; // Thêm import cho component mới

// Updated interfaces to match the API responses
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

interface User {
  id: string;
  username: string;
  fullName: string | null;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  userRole: number;
  image: string | null;
  students: Student[];
}

interface StudentOption {
  id: string;
  name: string;
}

interface MedicationRequestFromAPI {
  id: string;
  medicationName: string;
  dosage: number;
  numberOfDayToTake: number;
  instructions: string;
  imagesMedicalInvoice: string[];
  startDate: string;
  endDate: string | null;
  status: number;
  student: {
    id: string;
    studentCode: string;
    fullName: string;
    dateOfBirth: string;
    gender: number;
    class: string;
    schoolYear: string;
    image: string;
    healthRecord: any | null;
  };
  medicalStaff: any | null;
}

// Status mapping function with more specific return type
const mapStatus = (
  statusCode: number
): "requested" | "received" | "completed" | "cancelled" => {
  switch (statusCode) {
    case 0:
      return "requested";
    case 1:
      return "received";
    case 2:
      return "completed";
    case 3:
      return "cancelled";
    default:
      return "requested";
  }
};

// Creating adapter for our internal requests to match the existing model
const adaptApiToInternalMedicationRequest = (
  req: MedicationRequestFromAPI,
  student: Student,
  parentId: string
): MedicationRequestType => {
  return {
    id: req.id,
    studentId: student.id,
    studentName: student.fullName,
    medicationName: req.medicationName,
    components: req.medicationName,
    dosesPerDay: req.dosage,
    daysRequired: req.numberOfDayToTake,
    // Convert string dates to Date objects
    startDate: new Date(req.startDate),
    endDate: req.endDate
      ? new Date(req.endDate)
      : dateAddDays(new Date(req.startDate), req.numberOfDayToTake),
    hasReceipt: req.imagesMedicalInvoice && req.imagesMedicalInvoice.length > 0,
    notes: req.instructions,
    status: mapStatus(req.status),
    parentId: parentId,
    // Convert number dosage to string as required by the type
    dosage: req.dosage.toString(),
    instructions: req.instructions,
    // Convert string dates to Date objects
    createdAt: new Date(req.startDate),
    updatedAt: new Date(req.startDate),
  };
};

interface ParentMedicationDashboardProps {
  parentId: string;
}

const ParentMedicationDashboard: React.FC<ParentMedicationDashboardProps> = ({
  parentId,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState<MedicationRequestType[]>([]);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<MedicationLogType[]>([]);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshData, setRefreshData] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false); // Thêm state để lưu chi tiết yêu cầu và trạng thái modal
  const [selectedRequest, setSelectedRequest] =
    useState<MedicationRequestFromAPI | null>(null);
  const [allApiRequests, setAllApiRequests] = useState<
    MedicationRequestFromAPI[]
  >([]); // Thêm state để lưu phản hồi API gốc
  const [medicationDiaries, setMedicationDiaries] = useState<
    MedicationDiaryEntry[]
  >([]); // Cập nhật state để lưu dữ liệu nhật ký mới

  // Fetch medication requests for all students
  const fetchMedicationRequests = useCallback(
    async (students: Student[]) => {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const allRequests: MedicationRequestType[] = [];
      let allApiData: MedicationRequestFromAPI[] = [];

      try {
        // Fetch medication requests for each student
        for (const student of students) {
          const response = await instance.get<MedicationRequestFromAPI[]>(
            `${baseUrl}/api/MedicationRequest/get-medication-requests-by-student-id/${student.id}`
          );

          console.log(
            `Received medication data for student ${student.fullName}:`,
            response.data
          );

          // Lưu dữ liệu API gốc
          allApiData = [...allApiData, ...response.data];

          // Map API response to our component's format
          const studentRequests = response.data.map((req) =>
            adaptApiToInternalMedicationRequest(req, student, parentId)
          );

          allRequests.push(...studentRequests);
        }

        setAllApiRequests(allApiData);
        setRequests(allRequests);
      } catch (error: any) {
        // Enhanced error logging
        console.error("Error fetching medication requests:", error);

        // Log more detailed error information if available
        if (error.response) {
          console.error("Error response data:", error.response.data);
          console.error("Error response status:", error.response.status);
        } else if (error.request) {
          console.error("Error request:", error.request);
        } else {
          console.error("Error message:", error.message);
        }

        setError("Không thể tải danh sách thuốc. Vui lòng thử lại sau.");
      }
    },
    [parentId]
  );

  // Fetch parent information and students
  useEffect(() => {
    const fetchParentInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.REACT_APP_BASE_URL;
        const response = await instance.get<User>(
          `${baseUrl}/api/User/get-user-by-id/${parentId}`
        );

        // Extract student options from response
        const options: StudentOption[] = response.data.students.map(
          (student) => ({
            id: student.id,
            name: student.fullName,
          })
        );

        setStudentOptions(options);

        // Fetch medication requests for each student
        await fetchMedicationRequests(response.data.students);
      } catch (error) {
        console.error("Error fetching parent information:", error);
        setError("Không thể tải thông tin phụ huynh. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchParentInfo();
  }, [parentId, refreshData, fetchMedicationRequests]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRequestSubmitted = () => {
    // Trigger a refresh of the data
    setRefreshData((prev) => prev + 1);

    // Switch to the list view tab
    setTabValue(1);
  };

  const handleViewLogs = async (requestId: string, studentId: string) => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5112";

      // Gọi API mới lấy danh sách nhật ký uống thuốc dựa vào studentId
      const response = await instance.get<MedicationDiaryEntry[]>(
        `${baseUrl}/api/MedicaDiary/student/${studentId}`
      );

      console.log("Medication diary data:", response.data);

      // Lưu dữ liệu nhật ký vào state
      setMedicationDiaries(response.data);

      // Mở modal để hiển thị nhật ký
      setLogModalOpen(true);
    } catch (error) {
      console.error("Error fetching medication diaries:", error);
      setError(
        "Không thể lấy dữ liệu nhật ký uống thuốc. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseLogModal = () => {
    setLogModalOpen(false);
  };

  // Thêm hàm mở modal chi tiết
  const handleViewDetail = (requestId: string) => {
    // Tìm request từ API response (không phải đã chuyển đổi)
    const apiRequest = allApiRequests.find((req) => req.id === requestId);
    if (apiRequest) {
      setSelectedRequest(apiRequest);
      setDetailModalOpen(true);
    }
  };

  // Thêm hàm đóng modal chi tiết
  const handleCloseDetailModal = () => {
    setDetailModalOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý thuốc
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
          <Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MedicationRequestList
                requests={requests}
                onViewLogs={handleViewLogs}
                onViewDetail={handleViewDetail} // Thêm prop mới
              />
            )}
          </Box>
        )}

        {/* Modal hiển thị chi tiết thuốc */}
        <Modal
          open={detailModalOpen}
          onClose={handleCloseDetailModal}
          aria-labelledby="medication-detail-modal"
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
            {selectedRequest ? (
              <MedicationRequestDetail request={selectedRequest} />
            ) : (
              <Typography>Không tìm thấy thông tin chi tiết</Typography>
            )}
            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Button onClick={handleCloseDetailModal}>Đóng</Button>
            </Box>
          </Box>
        </Modal>

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

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MedicationDiaryView diaries={medicationDiaries} />
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
