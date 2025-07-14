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
  // Component sử dụng các API sau:
  // 1. /api/Student/get-student-by-parent-id/{parentID} - Lấy danh sách học sinh theo phụ huynh
  // 2. /api/MedicationRequest/get-medication-requests-by-student-id/{studentID} - Lấy yêu cầu thuốc theo học sinh
  // 3. /api/MedicaDiary/student/{studentId} - Lấy nhật ký uống thuốc theo học sinh

  const [tabValue, setTabValue] = useState(0);
  const [requests, setRequests] = useState<MedicationRequestType[]>([]);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState<MedicationLogType[]>([]);
  const [studentOptions, setStudentOptions] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshData, setRefreshData] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MedicationRequestFromAPI | null>(null);
  const [allApiRequests, setAllApiRequests] = useState<
    MedicationRequestFromAPI[]
  >([]);
  const [medicationDiaries, setMedicationDiaries] = useState<
    MedicationDiaryEntry[]
  >([]);

  // Fetch medication requests for all students using the specified API
  const fetchMedicationRequests = useCallback(
    async (students: Student[]) => {
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const allRequests: MedicationRequestType[] = [];
      let allApiData: MedicationRequestFromAPI[] = [];

      try {
        // Fetch medication requests for each student using the specified API endpoint
        for (const student of students) {
          try {
            const response = await instance.get<MedicationRequestFromAPI[]>(
              `${baseUrl}/api/MedicationRequest/get-medication-requests-by-student-id/${student.id}`
            );

            // console.log(
            //   `Received medication requests for student ${student.fullName} (ID: ${student.id}):`,
            //   response.data
            // );

            // Store original API data
            allApiData = [...allApiData, ...response.data];

            // Map API response to our component's format with proper status handling
            const studentRequests = response.data.map((req) =>
              adaptApiToInternalMedicationRequest(req, student, parentId)
            );

            allRequests.push(...studentRequests);
          } catch (studentError: any) {
            // Xử lý trường hợp không có yêu cầu thuốc cho học sinh này (HTTP 500 hoặc lỗi khác)
            // console.log(
            //   `No medication requests found for student ${student.fullName} (ID: ${student.id}):`,
            //   studentError.response?.status || studentError.message
            // );
            // Không thêm gì vào allRequests cho học sinh này, tiếp tục với học sinh tiếp theo
          }
        }


        // console.log("Requests by status:", {
        //   requested: allRequests.filter(r => r.status === 'requested').length,
        //   received: allRequests.filter(r => r.status === 'received').length,
        //   completed: allRequests.filter(r => r.status === 'completed').length,
        //   cancelled: allRequests.filter(r => r.status === 'cancelled').length
        // });

        setAllApiRequests(allApiData);
        setRequests(allRequests);
      } catch (error: any) {
        // Chỉ báo lỗi nếu có lỗi nghiêm trọng khác (không phải lỗi không tìm thấy dữ liệu)
        console.error("Error fetching medication requests:", error);
        // setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      }
    },
    [parentId]
  );

  // Fetch students by parent ID and their medication requests
  useEffect(() => {
    const fetchStudentsAndMedicationRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.REACT_APP_BASE_URL;
        
        // Fetch students using the specified API
        const studentsResponse = await instance.get<Student[]>(
          `${baseUrl}/api/Student/get-student-by-parent-id/${parentId}`
        );


        const options: StudentOption[] = studentsResponse.data.map(
          (student) => ({
            id: student.id,
            name: student.fullName,
          })
        );

        setStudentOptions(options);

        // Fetch medication requests for each student using the specified API
        await fetchMedicationRequests(studentsResponse.data);
      } catch (error) {
        console.error("Error fetching students and medication requests:", error);
        // setError("Không thể tải danh sách học sinh và yêu cầu thuốc. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentsAndMedicationRequests();
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
      const baseUrl = process.env.REACT_APP_BASE_URL;

      // Gọi API lấy danh sách nhật ký uống thuốc dựa vào studentId
      const response = await instance.get<MedicationDiaryEntry[]>(
        `${baseUrl}/api/MedicaDiary/student/${studentId}`
      );



      // Lưu dữ liệu nhật ký vào state
      setMedicationDiaries(response.data);

      // Mở modal để hiển thị nhật ký
      setLogModalOpen(true);
    } catch (error: any) {
      console.error("Error fetching medication diaries:", error);
      // Xử lý trường hợp không có nhật ký uống thuốc
      if (error.response?.status === 500) {
        setMedicationDiaries([]);
        setLogModalOpen(true);
      } else {
        // setError("Không thể lấy dữ liệu nhật ký uống thuốc. Vui lòng thử lại sau.");
      }
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
            {/* Hiển thị thống kê trạng thái yêu cầu thuốc */}
            {!loading && requests.length > 0 && (
              <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Tổng quan yêu cầu thuốc
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="text.secondary">
                      Đã gửi: {requests.filter(r => r.status === 'requested').length}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="success.main">
                      Đã nhận: {requests.filter(r => r.status === 'received').length}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="info.main">
                      Hoàn thành: {requests.filter(r => r.status === 'completed').length}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <Typography variant="body2" color="error.main">
                      Đã hủy: {requests.filter(r => r.status === 'cancelled').length}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : requests.length === 0 ? (
              <Box sx={{ textAlign: "center", my: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  Hiện không có yêu cầu thuốc nào
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Bạn có thể tạo yêu cầu thuốc mới ở tab "Gửi thuốc"
                </Typography>
              </Box>
            ) : (
              <MedicationRequestList
                requests={requests}
                onViewLogs={handleViewLogs}
                onViewDetail={handleViewDetail}
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
            ) : medicationDiaries.length === 0 ? (
              <Box sx={{ textAlign: "center", my: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Hiện chưa có nhật ký uống thuốc nào
                </Typography>
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
