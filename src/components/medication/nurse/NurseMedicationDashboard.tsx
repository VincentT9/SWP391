import React, { useState, useEffect, useCallback } from "react";
import { Container, Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import { format, addDays, parseISO } from "date-fns";
import NurseMedicationList from "./NurseMedicationList";
import MedicationAdministrationForm from "./MedicationAdministrationForm";
import DailyMedicationManager from "./DailyMedicationManager";
import { MedicationRequest } from "../../../models/types";
import MedicationRequestList from "./MedicationRequestList";
import CompletedExpiredRequestsList from "./CompletedExpiredRequestsList";
import axios from "axios";
import { toast } from "react-toastify";
import instance from "../../../utils/axiosConfig";
import PageHeader from "../../common/PageHeader";
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
  studentCode: string;
  studentName: string;
  medicalStaffId: string;
  medicalStaffName: string | null;
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
  const [refreshKey, setRefreshKey] = useState(0);

  // Load all medication requests
  useEffect(() => {
    // Fetch medication requests from API
    fetchMedicationRequests();
    fetchTodayMedications();
  }, [refreshKey]);

  // Auto refresh every 30 seconds to keep data updated
  useEffect(() => {
    const interval = setInterval(() => {
      if (tabValue === 0) { // Only refresh if on medication administration tab
        fetchTodayMedications();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [tabValue]);

  const refreshData = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  const fetchMedicationRequests = async () => {
    setIsLoading(true);
    try {
      // Using the correct API endpoint from the image
      const response = await instance.get(
        `${API_BASE_URL}/api/MedicationRequest/get-all-medication-requests`
      );

      setApiMedicationRequests(response.data);
      
      // Convert API format to local format for compatibility with existing components
      const convertedRequests = response.data.map((req: ApiMedicationRequest) => {

        // Calculate end date by adding numberOfDayToTake to startDate
        const startDate = parseISO(req.startDate);
        const calculatedEndDate = addDays(startDate, req.numberOfDayToTake - 1); // subtract 1 because first day counts
        const endDateStr = format(calculatedEndDate, 'yyyy-MM-dd');
        
        return {
          id: req.id,
          studentId: req.studentCode,
          studentName: req.studentName,
          medicationName: req.medicationName,
          dosage: req.dosage,
          instructions: req.instructions,
          startDate: req.startDate,
          endDate: endDateStr, // Use calculated end date
          status: statusNumberToString(req.status),
          receivedBy: req.medicalStaffId || null,
          updatedAt: new Date(),
        };
      });
      
      setRequests(convertedRequests);
    } catch (error) {
    
      console.error("Error fetching medication requests:", error);
      // toast.error("Không thể tải danh sách yêu cầu thuốc. Vui lòng thử lại sau.");
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
      

      
      // Get today's date without time component for accurate comparison
      const today = new Date();
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const medicationsForToday = response.data.filter((req: ApiMedicationRequest) => {
        // Only include medications assigned to this nurse
        if (req.medicalStaffId !== nurseId) {
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

        
        return isInDateRange;
      });
      

      setTodayMedications(medicationsForToday);
    } catch (error) {
      console.error("Error fetching today's medications:", error);
      // toast.error("Không thể tải danh sách thuốc cần cho uống hôm nay.");
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
      // Don't create diary entry here since MedicationAdministrationForm already creates it
      // Just show success message and refresh the list

      
      if (wasAdministered) {
        toast.success("Đã ghi nhận thông tin dùng thuốc của học sinh");
      } else {
        toast.info("Đã ghi nhận thông tin hủy lần uống thuốc");
      }
      
      // Refresh the medications list to get updated data
      await fetchTodayMedications();
    } catch (error) {
      console.error("Error refreshing medication list:", error);
      toast.error("Không thể cập nhật danh sách thuốc. Vui lòng làm mới trang.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <PageHeader 
          title="Quản lý thuốc"
          subtitle="Theo dõi và quản lý việc phát thuốc cho học sinh"
          showRefresh={true}
          onRefresh={() => window.location.reload()}
        />

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="medication management tabs"
          >
            <Tab label="Thuốc cần cho uống" />
            <Tab label="Yêu cầu đã xác nhận" />
            <Tab label="Yêu cầu chờ xử lý" />
            <Tab label="Yêu cầu hoàn thành & quá hạn" />
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

        {tabValue === 3 && (
          <CompletedExpiredRequestsList
            nurseId={nurseId}
            isLoading={isLoading}
          />
        )}
      </Box>
    </Container>
  );
};





export default NurseMedicationDashboard;
