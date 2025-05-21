import React, { useState, useEffect } from "react";
import { Typography, Box, Tabs, Tab, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { MedicalEventForm, MedicalEventsList, MedicalEventDetails } from ".";
import { mockMedicalEvents } from "../../../utils/mockData";
import { MedicalEvent } from "../../../models/types";

interface NurseMedicalEventsDashboardProps {
  nurseId: string;
  nurseName: string;
}

const NurseMedicalEventsDashboard: React.FC<
  NurseMedicalEventsDashboardProps
> = ({ nurseId, nurseName }) => {
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState<MedicalEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MedicalEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  useEffect(() => {
    // In a real app, we would fetch from an API
    setEvents(mockMedicalEvents);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateEvent = () => {
    setIsCreating(true);
    setIsViewingDetails(false);
    setSelectedEvent(null);
  };

  const handleEventSelect = (event: MedicalEvent) => {
    setSelectedEvent(event);
    setIsViewingDetails(true);
    setIsCreating(false);
  };

  const handleSaveEvent = (event: MedicalEvent) => {
    // In a real app, we would save to the database via API
    if (selectedEvent) {
      // Updating existing event
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      // Adding new event
      const newEvent = {
        ...event,
        id: `event${events.length + 1}`,
        attendedBy: nurseName,
      };
      setEvents([newEvent, ...events]);
    }

    setIsCreating(false);
    setIsViewingDetails(false);
    setSelectedEvent(null);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setSelectedEvent(null);
  };

  const handleBackToList = () => {
    setIsViewingDetails(false);
    setSelectedEvent(null);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Quản lý sự kiện y tế</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateEvent}
        >
          Ghi nhận sự kiện mới
        </Button>
      </Box>

      {!isCreating && !isViewingDetails && (
        <>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Tất cả sự kiện" />
              <Tab label="Đang theo dõi" />
              <Tab label="Đã ổn định" />
            </Tabs>
          </Paper>

          <MedicalEventsList
            events={events.filter((event) => {
              if (tabValue === 0) return true;
              if (tabValue === 1) return event.outcome === "referred";
              if (tabValue === 2) return event.outcome === "resolved";
              return true;
            })}
            onEventSelect={handleEventSelect}
          />
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

      {isViewingDetails && selectedEvent && (
        <MedicalEventDetails event={selectedEvent} onBack={handleBackToList} />
      )}
    </Box>
  );
};

export default NurseMedicalEventsDashboard;
