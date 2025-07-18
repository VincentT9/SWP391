import React, { useState, useEffect } from "react";
import { Typography, Box, Tabs, Tab, Button, Paper, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MedicalIncident } from "../../../models/types";
import PageHeader from "../../common/PageHeader";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { MedicalEventForm, MedicalEventsList } from "../nurse";
import MedicalEventDetails from "../nurse/MedicalEventDetails";

interface AdminMedicalEventsDashboardProps {
  adminId: string;
  adminName: string;
}

const AdminMedicalEventsDashboard: React.FC<
  AdminMedicalEventsDashboardProps
> = ({ adminId, adminName }) => {
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState<MedicalIncident[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MedicalIncident | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/medical-incident/all');
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching incidents:", err);
      setError("Có lỗi khi tải dữ liệu sự kiện y tế");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateEvent = () => {
    setIsCreating(true);
    setSelectedEvent(null);
    setIsEditing(false);
    setIsViewingDetails(false);
  };

  const handleViewDetails = (event: MedicalIncident) => {
    setSelectedEvent(event);
    setIsViewingDetails(true);
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleEditEvent = (event: MedicalIncident) => {
    setSelectedEvent(event);
    setIsEditing(true);
    setIsViewingDetails(false);
    setIsCreating(false);
  };

  const handleSaveEvent = async (incidentData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      await axiosInstance.post('/api/medical-incident/create', incidentData);
      await fetchIncidents();
      setIsCreating(false);
      setIsViewingDetails(false);
      setSelectedEvent(null);
      toast.success("Tạo sự kiện y tế thành công");
    } catch (err) {
      console.error("Error creating incident:", err);
      setError("Có lỗi khi tạo mới sự kiện y tế");
      toast.error("Có lỗi khi tạo sự kiện y tế");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (incidentData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!selectedEvent?.id) {
        throw new Error("Không tìm thấy ID sự kiện");
      }
      
      const updateData = {
        incidentType: incidentData.incidentType,
        incidentDate: incidentData.incidentDate,
        description: incidentData.description,
        actionsTaken: incidentData.actionsTaken,
        outcome: incidentData.outcome,
        status: incidentData.status,
        parentNotified: incidentData.parentNotified || false,
        parentNotificationDate: incidentData.parentNotificationDate || null
      };
      
      await axiosInstance.put(`/api/medical-incident/update/${selectedEvent.id}`, updateData);
      await fetchIncidents();
      
      setIsEditing(false);
      setIsViewingDetails(false);
      setSelectedEvent(null);
      toast.success("Đã cập nhật sự kiện y tế thành công!");
    } catch (err) {
      console.error("Error updating incident:", err);
      setError("Có lỗi khi cập nhật sự kiện y tế");
      toast.error("Có lỗi khi cập nhật sự kiện y tế");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await axiosInstance.delete(`/api/medical-incident/delete/${eventId}`);
      await fetchIncidents();
      toast.success("Xóa sự kiện y tế thành công");
    } catch (error) {
      console.error("Error deleting medical incident:", error);
      toast.error("Có lỗi khi xóa sự kiện y tế");
    }
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setSelectedEvent(null);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedEvent(null);
  };

  const handleBackToList = () => {
    setIsViewingDetails(false);
    setSelectedEvent(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <PageHeader 
        title="Quản lý sự kiện y tế" 
        subtitle={`Quản trị viên: ${adminName}`} 
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {isCreating && (
        <MedicalEventForm
          nurseId={adminId}
          nurseName={adminName}
          onSave={handleSaveEvent}
          onCancel={handleCancelCreate}
          isEditMode={false}
        />
      )}

      {isEditing && selectedEvent && (
        <MedicalEventForm
          nurseId={adminId}
          nurseName={adminName}
          initialEvent={selectedEvent}
          onSave={handleUpdateEvent}
          onCancel={handleCancelEdit}
          isEditMode={true}
        />
      )}

      {isViewingDetails && selectedEvent && (
        <MedicalEventDetails 
          event={selectedEvent} 
          onBack={handleBackToList} 
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onRefresh={fetchIncidents}
        />
      )}

      {!isCreating && !isEditing && !isViewingDetails && (
        <Paper sx={{ mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Tất cả sự kiện" />
                <Tab label="Theo dõi" />
                <Tab label="Đã xử lý" />
              </Tabs>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateEvent}
                sx={{ ml: 2 }}
              >
                Thêm sự kiện mới
              </Button>
            </Box>
          </Box>

          <Box sx={{ p: 2 }}>
            <MedicalEventsList
              events={events}
              onEventSelect={handleViewDetails}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default AdminMedicalEventsDashboard;
