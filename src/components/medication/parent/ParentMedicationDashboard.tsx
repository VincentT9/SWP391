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
import MedicationIcon from "@mui/icons-material/Medication";
import MedicationRequestForm from "./MedicationRequestForm";
import MedicationRequestList from "./MedicationRequestList";
import MedicationLogView from "../MedicationLogView";
import MedicationDiaryView from "../MedicationDiaryView"; // Import component mới
import PageHeader from "../../common/PageHeader";
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
  const [loadingDiary, setLoadingDiary] = useState(false); // State riêng cho loading diary
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

  // Hàm kiểm tra và cập nhật trạng thái các yêu cầu đã hết hạn
  const checkAndUpdateExpiredRequests = async (requests: MedicationRequestFromAPI[], baseUrl: string) => {
    // Kiểm tra requests có phải là array không
    if (!Array.isArray(requests)) {
      console.error('Requests is not an array:', requests);
      return;
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    console.log(`Checking expired requests on ${todayStr}`);

    for (const request of requests) {
      // Kiểm tra request và student có tồn tại không
      if (!request || !request.student || !request.student.id) {
        console.log('Skipping invalid request:', request);
        continue;
      }

      // Chỉ kiểm tra các yêu cầu có trạng thái "received" (status = 1)
      if (request.status === 1) {
        // Tính ngày kết thúc: startDate + numberOfDayToTake
        const startDate = new Date(request.startDate);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + request.numberOfDayToTake);
        const endDateStr = endDate.toISOString().split('T')[0];
        
        console.log(`Request ${request.id}: Start ${request.startDate}, Days: ${request.numberOfDayToTake}, End: ${endDateStr}, Today: ${todayStr}`);

        // Nếu ngày hiện tại >= ngày kết thúc, cập nhật thành "completed" (status = 2)
        if (todayStr >= endDateStr) {
          try {
            console.log(`Updating request ${request.id} to completed status`);
            
            // Payload đầy đủ theo API documentation
            const updatePayload = {
              studentId: request.student.id,
              medicationName: request.medicationName,
              dosage: request.dosage,
              numberOfDayToTake: request.numberOfDayToTake,
              instructions: request.instructions,
              imagesMedicalInvoice: request.imagesMedicalInvoice || [],
              startDate: request.startDate,
              status: 2, // 2 = completed
              medicalStaffId: request.medicalStaff?.id || null
            };
            
            await instance.put(`${baseUrl}/api/MedicationRequest/update-medication-request/${request.id}`, updatePayload);
            
            console.log(`Successfully updated medication request ${request.id} to completed status`);
            
            // Cập nhật trạng thái trong array local để hiển thị ngay lập tức
            request.status = 2;
          } catch (error) {
            console.error(`Error updating medication request ${request.id}:`, error);
          }
        } else {
          console.log(`Request ${request.id} is still active (ends on ${endDateStr})`);
        }
      }
    }
  };

  // Fetch medication requests for all students using the specified API
  const fetchMedicationRequests = useCallback(
    async (students: Student[]) => {
      const baseUrl = process.env.REACT_APP_BASE_URL;
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
            
            console.log(`Added ${response.data.length} requests from student ${student.fullName}, total now: ${allApiData.length}`);
            console.log('Sample request structure:', response.data[0]);

            // Note: We'll map to internal format after checking expired requests
          } catch (studentError: any) {
            // Xử lý trường hợp không có yêu cầu thuốc cho học sinh này (HTTP 500 hoặc lỗi khác)
            // console.log(
            //   `No medication requests found for student ${student.fullName} (ID: ${student.id}):`,
            //   studentError.response?.status || studentError.message
            // );
            // Không thêm gì vào allRequests cho học sinh này, tiếp tục với học sinh tiếp theo
          }
        }

        console.log('Final allApiData before processing:', allApiData, 'Type:', typeof allApiData, 'IsArray:', Array.isArray(allApiData));
        console.log('Sample allApiData structure:', allApiData[0]);

        // Map requests trước, sau đó mới check expired
        const allRequests: MedicationRequestType[] = [];
        console.log('Starting to map requests, students:', students.length);
        
        for (const student of students) {
          if (!Array.isArray(allApiData)) {
            console.error('allApiData is not an array:', allApiData);
            continue;
          }
          
          console.log(`Processing student: ${student.fullName} (ID: ${student.id})`);
          console.log('All available request student names:', allApiData.map(req => (req as any).studentName || 'no studentName'));
          
          // Sử dụng studentName từ API response thực tế
          const studentApiRequests = allApiData.filter(req => 
            req && (req as any).studentName === student.fullName
          );
          
          console.log(`Found ${studentApiRequests.length} API requests for student ${student.fullName}:`, studentApiRequests);
          
          const studentRequests = studentApiRequests.map((req) => {
            const mapped = adaptApiToInternalMedicationRequest(req, student, parentId);
            console.log(`Mapped request ${req.id} for ${student.fullName}:`, mapped);
            return mapped;
          });
          
          allRequests.push(...studentRequests);
        }

        console.log(`Total mapped requests before checking expired: ${allRequests.length}`, allRequests);
        
        // Check và update expired requests sau khi đã map
        if (allRequests.length > 0) {
          console.log('Checking expired requests on 2025-07-18');
          const today = new Date();
          const baseUrl = process.env.REACT_APP_BASE_URL;
          const updatedRequests = [...allRequests];
          
          for (let i = 0; i < updatedRequests.length; i++) {
            const request = updatedRequests[i];
            // Tính ngày kết thúc từ startDate + daysRequired
            const startDate = new Date(request.startDate);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + request.daysRequired);
            
            console.log(`Request ${request.id}: Status=${request.status}, Start=${request.startDate}, Days=${request.daysRequired}, Calculated End=${endDate.toISOString().split('T')[0]}, Today=${today.toISOString().split('T')[0]}`);
            
            // Nếu là status 'received' và đã qua ngày kết thúc thì update thành 'completed'
            if (request.status === 'received' && today >= endDate) {
              console.log(`Updating expired request ${request.id} from ${request.status} to completed via API`);
              
              try {
                // Lấy thông tin từ API response gốc
                const originalApiRequest = allApiData.find(apiReq => apiReq.id === request.id);
                console.log('Original API request:', originalApiRequest);
                
                // Gọi API update status theo format đúng
                const updatePayload = {
                  studentId: request.studentId,
                  medicationName: request.medicationName,
                  dosage: parseInt(request.dosage),
                  numberOfDayToTake: request.daysRequired,
                  instructions: request.instructions,
                  imagesMedicalInvoice: originalApiRequest?.imagesMedicalInvoice || [],
                  startDate: originalApiRequest?.startDate || request.startDate.toISOString(),
                  status: 2, // 2 = completed
                  medicalStaffId: originalApiRequest?.medicalStaff?.id || null
                };
                
                console.log('Update payload:', updatePayload);
                
                await instance.put(`${baseUrl}/api/MedicationRequest/update-medication-request/${request.id}`, updatePayload);
                
                // Update local state
                updatedRequests[i] = { ...request, status: 'completed' as const };
                console.log(`Successfully updated request ${request.id} to completed status`);
              } catch (error) {
                console.error(`Error updating request ${request.id}:`, error);
              }
            }
          }
          
          console.log(`Final requests after checking expired: ${updatedRequests.length}`, updatedRequests);
          setRequests(updatedRequests);
        } else {
          setRequests(allRequests);
        }

        // console.log("Requests by status:", {
        //   requested: allRequests.filter(r => r.status === 'requested').length,
        //   received: allRequests.filter(r => r.status === 'received').length,
        //   completed: allRequests.filter(r => r.status === 'completed').length,
        //   cancelled: allRequests.filter(r => r.status === 'cancelled').length
        // });

        setAllApiRequests(allApiData);
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
    setLoadingDiary(true); // Sử dụng loadingDiary thay vì loading
    try {
      const baseUrl = process.env.REACT_APP_BASE_URL;

      // Step 1: Get medication request details to get medical diary IDs
      const medicationResponse = await instance.get(
        `${baseUrl}/api/MedicationRequest/get-medication-request-by-id/${requestId}`
      );
      
      const medicationData = medicationResponse.data;
      console.log("Medication request data:", medicationData);
      
      // Step 2: Get medical diary IDs from the response
      const medicalDiaryData = medicationData.medicalDiaries || [];
      console.log("Medical diary data:", medicalDiaryData);
      
      // Extract IDs from the medical diary objects
      let medicalDiaryIds: string[] = [];
      
      if (Array.isArray(medicalDiaryData)) {
        medicalDiaryIds = medicalDiaryData.map((diary: any) => {
          // If diary is an object with an id property
          if (typeof diary === 'object' && diary.id) {
            return diary.id;
          }
          // If diary is already a string (ID)
          if (typeof diary === 'string') {
            return diary;
          }
          return null;
        }).filter(Boolean); // Remove null values
      }
      
      console.log("Extracted medical diary IDs:", medicalDiaryIds);
      
      if (medicalDiaryIds.length === 0) {
        // If no IDs found, try to use the medical diary data directly
        if (medicalDiaryData.length > 0) {
          console.log("Using medical diary data directly:", medicalDiaryData);
          setMedicationDiaries(medicalDiaryData);
          setLogModalOpen(true);
          return;
        } else {
          setMedicationDiaries([]);
          setLogModalOpen(true);
          return;
        }
      }
      
      // Step 3: Fetch each diary entry using /api/MedicaDiary/{medicadiaryID}
      const diaryPromises = medicalDiaryIds.map((diaryId: string) =>
        instance.get(`${baseUrl}/api/MedicaDiary/${diaryId}`)
      );
      
      const diaryResponses = await Promise.all(diaryPromises);
      const diaryEntries = diaryResponses.map(response => response.data);
      
      console.log("Fetched diary entries:", diaryEntries);

      // Lưu dữ liệu nhật ký vào state
      setMedicationDiaries(diaryEntries);

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
      setLoadingDiary(false); // Sử dụng loadingDiary thay vì loading
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
        <PageHeader 
          title="Gửi thuốc và theo dõi yêu cầu"
          subtitle="Gửi thuốc và theo dõi lịch uống thuốc của con"
          showRefresh={true}
          onRefresh={() => window.location.reload()}
        />

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
              <Box sx={{ mb: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                  Tổng quan yêu cầu thuốc
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'warning.50', 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'warning.200',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {requests.filter(r => r.status === 'requested').length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'warning.main' }}>
                      Đã gửi
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'info.50', 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'info.200',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {requests.filter(r => r.status === 'received').length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'info.main' }}>
                      Đã nhận
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'success.50', 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'success.200',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {requests.filter(r => r.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'success.main' }}>
                      Hoàn thành
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: 'error.50', 
                    borderRadius: 1, 
                    border: 1, 
                    borderColor: 'error.200',
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                      {requests.filter(r => r.status === 'cancelled').length}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'error.main' }}>
                      Đã hủy
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

            {loadingDiary ? (
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
