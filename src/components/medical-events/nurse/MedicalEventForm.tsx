import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Autocomplete,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { MedicalEvent, MedicationGiven, Student } from "../../../models/types";
import { mockMedicalSupplies } from "../../../utils/mockData";

// Mock data for students - in a real app, this would come from API
const mockStudents: Student[] = [
  {
    id: "student1",
    firstName: "Nguyễn",
    lastName: "Văn A",
    dateOfBirth: new Date("2010-05-15"),
    gender: "male",
    grade: "7",
    class: "7A",
    parentId: "parent1",
    healthRecordId: "hr1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "student2",
    firstName: "Trần",
    lastName: "Thị B",
    dateOfBirth: new Date("2011-03-22"),
    gender: "female",
    grade: "6",
    class: "6B",
    parentId: "parent2",
    healthRecordId: "hr2",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "student3",
    firstName: "Lê",
    lastName: "Văn C",
    dateOfBirth: new Date("2009-11-10"),
    gender: "male",
    grade: "8",
    class: "8C",
    parentId: "parent3",
    healthRecordId: "hr3",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Common symptoms for quick selection
const commonSymptoms = [
  "Sốt",
  "Đau đầu",
  "Đau bụng",
  "Buồn nôn",
  "Nôn",
  "Đau họng",
  "Ho",
  "Chảy máu",
  "Xước da",
  "Bầm tím",
  "Đau tai",
  "Mệt mỏi",
  "Chóng mặt",
  "Khó thở",
];

interface MedicalEventFormProps {
  nurseId: string;
  nurseName: string;
  initialEvent?: MedicalEvent;
  onSave: (event: MedicalEvent) => void;
  onCancel: () => void;
}

const MedicalEventForm: React.FC<MedicalEventFormProps> = ({
  nurseId,
  nurseName,
  initialEvent,
  onSave,
  onCancel,
}) => {
  const isEditing = !!initialEvent;
  const [student, setStudent] = useState<Student | null>(
    isEditing
      ? mockStudents.find((s) => s.id === initialEvent.studentId) || null
      : null
  );
  const [eventDate, setEventDate] = useState<Date>(
    isEditing ? new Date(initialEvent.date) : new Date()
  );
  const [eventType, setEventType] = useState<string>(
    isEditing ? initialEvent.type : "injury"
  );
  const [description, setDescription] = useState<string>(
    isEditing ? initialEvent.description : ""
  );
  const [symptoms, setSymptoms] = useState<string[]>(
    isEditing ? initialEvent.symptoms : []
  );
  const [treatment, setTreatment] = useState<string>(
    isEditing ? initialEvent.treatment : ""
  );
  const [outcome, setOutcome] = useState<string>(
    isEditing ? initialEvent.outcome : "resolved"
  );
  const [notifyParent, setNotifyParent] = useState<boolean>(
    isEditing ? initialEvent.notifiedParent : false
  );
  const [notes, setNotes] = useState<string>(
    isEditing ? initialEvent.notes || "" : ""
  );
  const [medicationsGiven, setMedicationsGiven] = useState<MedicationGiven[]>(
    isEditing ? initialEvent.medicationsGiven : []
  );

  // Supplies used in treatment
  const [selectedSupply, setSelectedSupply] = useState<string>("");
  const [selectedMedication, setSelectedMedication] = useState<string>("");
  const [selectedMedicationDosage, setSelectedMedicationDosage] =
    useState<string>("");
  const [selectedSupplyQuantity, setSelectedSupplyQuantity] =
    useState<number>(1);

  // Form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!student) {
      newErrors.student = "Vui lòng chọn học sinh";
    }

    if (!description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả sự kiện";
    }

    if (!treatment.trim()) {
      newErrors.treatment = "Vui lòng nhập biện pháp xử lý";
    }

    if (symptoms.length === 0) {
      newErrors.symptoms = "Vui lòng chọn ít nhất một triệu chứng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMedicationAdd = () => {
    if (!selectedMedication || !selectedMedicationDosage) return;

    // Create a new medication given entry
    const newMedicationGiven: MedicationGiven = {
      id: `med-${Date.now()}`,
      medicationId: selectedMedication,
      medicationName: selectedMedication, // In a real app, would look up the name
      dosage: selectedMedicationDosage,
      time: new Date(),
      administeredBy: nurseName,
    };

    // Add to the medications given array
    setMedicationsGiven([...medicationsGiven, newMedicationGiven]);

    // Clear the form fields
    setSelectedMedication("");
    setSelectedMedicationDosage("");
  };

  const handleSupplyAdd = () => {
    if (!selectedSupply) return;

    // In a real app, we would record this in the database
    // and update inventory counts

    // For now, just add to treatment text
    const supplyInfo = mockMedicalSupplies.find((s) => s.id === selectedSupply);
    if (supplyInfo) {
      setTreatment(
        treatment +
          (treatment ? ", " : "") +
          `Sử dụng ${selectedSupplyQuantity} ${supplyInfo.unit} ${supplyInfo.name}`
      );
    }

    setSelectedSupply("");
    setSelectedSupplyQuantity(1);
  };

  const handleSaveEvent = () => {
    if (!validateForm()) return;

    if (!student) return; // TypeScript safety

    const eventData: MedicalEvent = {
      id: initialEvent?.id || "",
      studentId: student.id,
      date: eventDate,
      type: eventType as "injury" | "illness" | "emergency" | "other",
      description,
      symptoms,
      treatment,
      medicationsGiven,
      outcome: outcome as
        | "resolved"
        | "referred"
        | "sent home"
        | "hospitalized",
      attendedBy: nurseName,
      notifiedParent: notifyParent,
      notifiedAt: notifyParent ? new Date() : undefined,
      parentResponse: "",
      notes,
    };

    onSave(eventData);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? "Cập nhật sự kiện y tế" : "Ghi nhận sự kiện y tế mới"}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Autocomplete
              options={mockStudents}
              getOptionLabel={(option) =>
                `${option.lastName} ${option.firstName} - Lớp ${option.class}`
              }
              value={student}
              onChange={(_, newValue) => setStudent(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn học sinh"
                  variant="outlined"
                  required
                  error={!!errors.student}
                  helperText={errors.student}
                />
              )}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Thời gian xảy ra"
                value={eventDate}
                onChange={(newValue) => setEventDate(newValue || new Date())}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth required>
              <InputLabel id="event-type-label">Loại sự kiện</InputLabel>
              <Select
                labelId="event-type-label"
                value={eventType}
                label="Loại sự kiện"
                onChange={(e) => setEventType(e.target.value)}
              >
                <MenuItem value="injury">Chấn thương</MenuItem>
                <MenuItem value="illness">Bệnh</MenuItem>
                <MenuItem value="emergency">Khẩn cấp</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth required>
              <InputLabel id="outcome-label">Kết quả xử lý</InputLabel>
              <Select
                labelId="outcome-label"
                value={outcome}
                label="Kết quả xử lý"
                onChange={(e) => setOutcome(e.target.value)}
              >
                <MenuItem value="resolved">Đã ổn định</MenuItem>
                <MenuItem value="referred">Chuyển tuyến</MenuItem>
                <MenuItem value="sent home">Cho về nhà</MenuItem>
                <MenuItem value="hospitalized">Nhập viện</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Mô tả chi tiết"
          multiline
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          error={!!errors.description}
          helperText={errors.description}
        />

        <Autocomplete
          multiple
          freeSolo
          options={commonSymptoms}
          value={symptoms}
          onChange={(_, newValue) => setSymptoms(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Triệu chứng"
              placeholder="Thêm triệu chứng"
              variant="outlined"
              required
              error={!!errors.symptoms}
              helperText={errors.symptoms}
            />
          )}
        />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Vật tư y tế đã sử dụng
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
            }}
          >
            <Box sx={{ flex: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="supply-label">Chọn vật tư</InputLabel>
                <Select
                  labelId="supply-label"
                  value={selectedSupply}
                  label="Chọn vật tư"
                  onChange={(e) => setSelectedSupply(e.target.value)}
                >
                  {mockMedicalSupplies.map((supply) => (
                    <MenuItem key={supply.id} value={supply.id}>
                      {supply.name} ({supply.quantity} {supply.unit})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                type="number"
                label="Số lượng"
                InputProps={{ inputProps: { min: 1 } }}
                value={selectedSupplyQuantity}
                onChange={(e) =>
                  setSelectedSupplyQuantity(parseInt(e.target.value) || 1)
                }
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleSupplyAdd}
                disabled={!selectedSupply}
              >
                Thêm
              </Button>
            </Box>
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Biện pháp xử lý"
          multiline
          rows={3}
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          required
          error={!!errors.treatment}
          helperText={errors.treatment}
        />

        <TextField
          fullWidth
          label="Ghi chú"
          multiline
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <FormControlLabel
          control={
            <Switch
              checked={notifyParent}
              onChange={(e) => setNotifyParent(e.target.checked)}
            />
          }
          label="Thông báo cho phụ huynh"
        />
        {notifyParent && (
          <FormHelperText>
            Phụ huynh sẽ được thông báo về sự kiện y tế này
          </FormHelperText>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            sx={{ mr: 2 }}
          >
            Hủy
          </Button>
          <Button variant="contained" color="primary" onClick={handleSaveEvent}>
            {isEditing ? "Cập nhật" : "Lưu"}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default MedicalEventForm;
