import React, { useState, useEffect } from "react";
import { Typography, Box, Tabs, Tab, Button, Paper, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MedicalEventForm, MedicalEventsList, MedicalEventDetails } from ".";
import { MedicalIncident } from "../../../models/types";
import PageHeader from "../../common/PageHeader";
import axios from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import instance from "../../../utils/axiosConfig";
interface NurseMedicalEventsDashboardProps {
  nurseId: string;
  nurseName: string;
}

const NurseMedicalEventsDashboard: React.FC<
  NurseMedicalEventsDashboardProps
> = ({ nurseId, nurseName }) => {
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
      const response = await instance.get('/api/medical-incident/all');
      setEvents(response.data);
    } catch (err) {
      console.error("Error fetching incidents:", err);
      // setError("Có lỗi khi tải dữ liệu sự kiện y tế");
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
    setIsViewingDetails(false);
    setSelectedEvent(null);
  };

  const handleEventSelect = (event: MedicalIncident) => {
    setSelectedEvent(event);
    setIsViewingDetails(true);
    setIsCreating(false);
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
      const response = await instance.post('/api/medical-incident/create', incidentData);
      console.log(response);
      const notification = {
            campaignId: null,
            incidientId: response.data.id,
          }
      // Refresh incidents list after creating a new one
      await fetchIncidents();
      
      setIsCreating(false);
      setIsViewingDetails(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error creating incident:", err);
      // setError("Có lỗi khi tạo mới sự kiện y tế");
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
      
      // Format the data according to the API schema
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
      
      // Update the incident
      await instance.put(`/api/medical-incident/update/${selectedEvent.id}`, updateData);
      
      // If there are new medical supplies to add, process them
      if (incidentData.medicalSupplierUsage && incidentData.medicalSupplierUsage.length > 0) {
        // Get only the new supplies (those not in the original event)
        const originalSupplies = selectedEvent.medicalSupplyUsages || [];
        const newSupplies = incidentData.medicalSupplierUsage.filter(
          (newSupply: any) => !originalSupplies.some(
            (origSupply: any) => (origSupply.medicalSupplierId || origSupply.supplyId) === (newSupply.medicalSupplierId || newSupply.supplyId) && 
            (origSupply.quantityUsed || origSupply.quantity) === (newSupply.quantityUsed || newSupply.quantity)
          )
        );
        
        // Update supplier quantities for any new supplies added
        for (const supply of newSupplies) {
          // Get current supplier details
          const supplierResponse = await instance.get(`/api/MedicalSupplier/get-supplier-by-id/${supply.medicalSupplierId || supply.supplyId}`);
          const supplierData = supplierResponse.data;
          
          // Calculate new quantity
          const newQuantity = Math.max(0, supplierData.quantity - (supply.quantityUsed || supply.quantity));
          
          // Update the supplier inventory
          await instance.put(`/api/MedicalSupplier/update-supplier/${supply.medicalSupplierId || supply.supplyId}`, {
            ...supplierData,
            quantity: newQuantity
          });
        }
      }
      
      // Refresh incidents list after updating
      await fetchIncidents();
      
      setIsEditing(false);
      setIsViewingDetails(false);
      setSelectedEvent(null);
      toast.success("Đã cập nhật sự kiện y tế thành công!");
    } catch (err) {
      console.error("Error updating incident:", err);
      // setError("Có lỗi khi cập nhật sự kiện y tế");
    } finally {
      setLoading(false);
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
    <Box>
      <PageHeader 
        title="Quản lý sự kiện y tế"
        subtitle="Ghi nhận và theo dõi các sự kiện y tế của học sinh tại trường"
        showRefresh={true}
        onRefresh={fetchIncidents}
        actions={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateEvent}
            disabled={loading}
          >
            Ghi nhận sự kiện mới
          </Button>
        }
      />

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: "rgba(231, 76, 60, 0.1)" }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      )}

      {!isCreating && !isViewingDetails && !isEditing && (
        <>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Tất cả sự kiện" />
              <Tab label="Đang theo dõi" />
              <Tab label="Đã ổn định" />
            </Tabs>
          </Paper>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <MedicalEventsList
              events={events.filter((event) => {
                if (tabValue === 0) return true;
                if (tabValue === 1) return event.status === 0; // Ongoing
                if (tabValue === 2) return event.status === 1; // Resolved
                return true;
              })}
              onEventSelect={handleEventSelect}
            />
          )}
        </>
      )}

      {isCreating && (
        <MedicalEventForm
          nurseId={nurseId}
          nurseName={nurseName}
          onSave={handleSaveEvent}
          onCancel={handleCancelCreate}
        />
      )}

      {isEditing && selectedEvent && (
        <MedicalEventForm
          nurseId={nurseId}
          nurseName={nurseName}
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
          isNurse={true}
        />
      )}
    </Box>
  );
};

export default NurseMedicalEventsDashboard;
