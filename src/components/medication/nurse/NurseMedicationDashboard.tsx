import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import { format, addDays, parseISO } from "date-fns";
import NurseMedicationList from "./NurseMedicationList";
import MedicationAdministrationForm from "./MedicationAdministrationForm";
import { MedicationRequest } from "../../../models/types";
import MedicationRequestList from "./MedicationRequestList";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../utils/axiosConfig";
// API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_BASE_URL;

// Interface for API medication request
interface ApiMedicationRequest {
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
    healthRecord: any;
  };
  medicalStaff: any;
}

interface MedicationAdminLog {
  id: string;
  medicationRequestId: string;
  administeredTime: string;
  wasAdministered: boolean;
  reasonForNotAdministering?: string;
  notes?: string;
  studentConditionBefore?: string;
  studentConditionAfter?: string;
  createdAt: string;
}

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
  const [todayMedications, setTodayMedications] = useState<ApiMedicationRequest[]>(
    []
  );
  const [apiMedicationRequests, setApiMedicationRequests] = useState<ApiMedicationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all medication requests
  useEffect(() => {
    // Fetch medication requests from API
    fetchMedicationRequests();
    fetchTodayMedications();
  }, []);

  const fetchMedicationRequests = async () => {
    setIsLoading(true);
    try {
      // Using the correct API endpoint from the image
      const response = await instance.get(
        `${API_BASE_URL}/api/MedicationRequest/get-all-medication-requests`
      );
      console.log("Medication requests response:", response.data);
      setApiMedicationRequests(response.data);
      
      // Convert API format to local format for compatibility with existing components
      const convertedRequests = response.data.map((req: ApiMedicationRequest) => {
        // Calculate end date by adding numberOfDayToTake to startDate
        const startDate = parseISO(req.startDate);
        const calculatedEndDate = addDays(startDate, req.numberOfDayToTake - 1); // subtract 1 because first day counts
        const endDateStr = format(calculatedEndDate, 'yyyy-MM-dd');
        
        return {
          id: req.id,
          studentId: req.student.id,
          studentName: req.student.fullName,
          medicationName: req.medicationName,
          dosage: req.dosage,
          instructions: req.instructions,
          startDate: req.startDate,
          endDate: endDateStr, // Use calculated end date
          status: statusNumberToString(req.status),
          receivedBy: req.medicalStaff?.id || null,
          receivedAt: req.medicalStaff ? new Date() : null,
          updatedAt: new Date(),
        };
      });
      
      setRequests(convertedRequests);
    } catch (error) {
      console.error("Error fetching medication requests:", error);
      toast.error("Không thể tải danh sách yêu cầu thuốc. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTodayMedications = async () => {
    setIsLoading(true);
    try {
      // Get all accepted medication requests (status 1)
      const response = await instance.get(
        `${API_BASE_URL}/api/MedicationRequest/get-medication-requests-by-status/1`
      );
      
      console.log("All accepted medication requests:", response.data.length);
      
      // Get today's date without time component for accurate comparison
      const today = new Date();
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const medicationsForToday = response.data.filter((req: ApiMedicationRequest) => {
        // Only include medications assigned to this nurse
        if (req.medicalStaff?.id !== nurseId) {
          return false;
        }
        
        // Parse the start date and calculate end date
        const startDate = parseISO(req.startDate);
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        
        // Calculate end date by adding numberOfDayToTake to startDate
        const calculatedEndDate = addDays(startDateOnly, req.numberOfDayToTake - 1);
        
        // Check if today is within the medication date range
        const isInDateRange = todayDateOnly >= startDateOnly && todayDateOnly <= calculatedEndDate;
        
        // Debugging logs
        console.log(`Medication: ${req.medicationName}, Start: ${format(startDateOnly, 'yyyy-MM-dd')}, End: ${format(calculatedEndDate, 'yyyy-MM-dd')}, InRange: ${isInDateRange}`);
        
        return isInDateRange;
      });
      
      console.log(`Found ${medicationsForToday.length} medications for today`);
      setTodayMedications(medicationsForToday);
    } catch (error) {
      console.error("Error fetching today's medications:", error);
      toast.error("Không thể tải danh sách thuốc cần cho uống hôm nay.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to convert numeric status to string status
  const statusNumberToString = (statusNumber: number): string => {
    switch (statusNumber) {
      case 0: return "requested";
      case 1: return "received";
      case 2: return "rejected";
      case 3: return "completed";
      default: return "unknown";
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReceiveMedication = async (requestId: string) => {
    try {
      // In a real implementation, you would call the API to update the medication status
      await instance.put(`${API_BASE_URL}/api/MedicationRequest/update-medication-request/${requestId}`, {
        status: 1, // 1 = received
        medicalStaffId: nurseId
      });
      
      // Refresh medication requests after receiving
      fetchMedicationRequests();
      fetchTodayMedications();
    } catch (error) {
      console.error("Error receiving medication:", error);
    }
  };

  const handleMedicationAdministered = async (
    requestId: string,
    wasAdministered: boolean,
    description: string  // Simplified to just take a description string instead of object
  ) => {
    try {
      // Create medication diary entry using the exact API schema
      await instance.post(`${API_BASE_URL}/api/MedicaDiary/create`, {
        medicationReqId: requestId,
        status: wasAdministered ? 1 : 0, // 1 for administered, 0 for not administered
        description: description
      });

      
      if (wasAdministered) {
        toast.success("Đã ghi nhận thông tin dùng thuốc của học sinh");
      } else {
        toast.info("Đã ghi nhận thông tin hủy lần uống thuốc");
      }
      
      // Refresh the medications list
      await fetchTodayMedications();
    } catch (error) {
      console.error("Error logging medication administration:", error);
      toast.error("Không thể cập nhật thông tin dùng thuốc. Vui lòng thử lại sau.");
    }
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
            <Tab label="Thuốc cần cho uống" />
            <Tab label="Yêu cầu đã xác nhận" />
            <Tab label="Yêu cầu chờ xử lý" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Thuốc cần cho học sinh uống hôm nay (
              {format(new Date(), "dd/MM/yyyy")})
            </Typography>

            {isLoading ? (
              <Typography>Đang tải dữ liệu...</Typography>
            ) : todayMedications.length === 0 ? (
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
                      onMedicationAdministered={(wasGiven, description) => 
                        handleMedicationAdministered(medication.id, wasGiven, description)
                      }
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <NurseMedicationList
            requests={requests.filter(req => req.status === "received" && req.receivedBy === nurseId)}
            onReceiveMedication={handleReceiveMedication}
            isLoading={isLoading}
            nurseId={nurseId}
          />
        )}

        {tabValue === 2 && (
          <MedicationRequestList 
            requests={apiMedicationRequests}
            onAccept={(requestId) => {
              // Just refresh the data after a successful operation
              fetchMedicationRequests();
              fetchTodayMedications();
            }}
            onReject={(requestId) => {
              // Just refresh the data after a successful operation
              fetchMedicationRequests();
            }}
            isLoading={isLoading}
            nurseId={nurseId}
          />
        )}
      </Box>
    </Container>
  );
};





export default NurseMedicationDashboard;
