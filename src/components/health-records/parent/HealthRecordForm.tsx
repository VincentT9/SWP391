import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  FormControlLabel,
  Switch,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { mockStudents } from "../../../utils/mockData";
import {
  HealthRecord,
  Student,
  Allergy,
  ChronicCondition,
  VisionAssessment,
  HearingAssessment,
} from "../../../models/types";

interface HealthRecordFormProps {
  studentId: string;
  initialRecord: HealthRecord | null;
  onSave: (record: HealthRecord) => void;
  onCancel: () => void;
}

const HealthRecordForm: React.FC<HealthRecordFormProps> = ({
  studentId,
  initialRecord,
  onSave,
  onCancel,
}) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [height, setHeight] = useState(initialRecord?.height || 0);
  const [weight, setWeight] = useState(initialRecord?.weight || 0);
  const [bloodType, setBloodType] = useState<
    "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | ""
  >(initialRecord?.bloodType || "");

  // Allergies
  const [allergies, setAllergies] = useState<Allergy[]>(
    initialRecord?.allergies || []
  );
  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({
    name: "",
    severity: "mild",
    symptoms: "",
    treatment: "",
    dateIdentified: new Date(),
  });

  // Chronic Conditions
  const [chronicConditions, setChronicConditions] = useState<
    ChronicCondition[]
  >(initialRecord?.chronicConditions || []);
  const [newCondition, setNewCondition] = useState<Partial<ChronicCondition>>({
    name: "",
    diagnosisDate: new Date(),
    medications: [],
    notes: "",
  });

  // Vision Assessment
  const [visionAssessment, setVisionAssessment] = useState<
    VisionAssessment | undefined
  >(initialRecord?.visionAssessment);
  const [hasVisionData, setHasVisionData] = useState(
    !!initialRecord?.visionAssessment
  );

  // Hearing Assessment
  const [hearingAssessment, setHearingAssessment] = useState<
    HearingAssessment | undefined
  >(initialRecord?.hearingAssessment);
  const [hasHearingData, setHasHearingData] = useState(
    !!initialRecord?.hearingAssessment
  );

  useEffect(() => {
    // Get student info
    const foundStudent = mockStudents.find((s) => s.id === studentId);
    if (foundStudent) {
      setStudent(foundStudent);
    }
  }, [studentId]);

  const handleAddAllergy = () => {
    if (!newAllergy.name || !newAllergy.symptoms || !newAllergy.treatment)
      return;

    const allergyToAdd: Allergy = {
      id: `allergy-${Date.now()}`,
      name: newAllergy.name || "",
      severity: newAllergy.severity as "mild" | "moderate" | "severe",
      symptoms: newAllergy.symptoms || "",
      treatment: newAllergy.treatment || "",
      dateIdentified: newAllergy.dateIdentified || new Date(),
    };

    setAllergies([...allergies, allergyToAdd]);
    setNewAllergy({
      name: "",
      severity: "mild",
      symptoms: "",
      treatment: "",
      dateIdentified: new Date(),
    });
  };

  const handleRemoveAllergy = (id: string) => {
    setAllergies(allergies.filter((a) => a.id !== id));
  };

  const handleAddChronicCondition = () => {
    if (!newCondition.name) return;

    const conditionToAdd: ChronicCondition = {
      id: `condition-${Date.now()}`,
      name: newCondition.name || "",
      diagnosisDate: newCondition.diagnosisDate || new Date(),
      medications: [],
      notes: newCondition.notes || "",
    };

    setChronicConditions([...chronicConditions, conditionToAdd]);
    setNewCondition({
      name: "",
      diagnosisDate: new Date(),
      medications: [],
      notes: "",
    });
  };

  const handleRemoveChronicCondition = (id: string) => {
    setChronicConditions(chronicConditions.filter((c) => c.id !== id));
  };

  const handleSaveRecord = () => {
    if (!student) return;

    // Create vision and hearing assessment if switched on
    const finalVisionAssessment = hasVisionData
      ? {
          id: visionAssessment?.id || `vision-${Date.now()}`,
          date: visionAssessment?.date || new Date(),
          leftEye: visionAssessment?.leftEye || 0,
          rightEye: visionAssessment?.rightEye || 0,
          wearsCorrective: visionAssessment?.wearsCorrective || false,
          notes: visionAssessment?.notes || "",
        }
      : undefined;

    const finalHearingAssessment = hasHearingData
      ? {
          id: hearingAssessment?.id || `hearing-${Date.now()}`,
          date: hearingAssessment?.date || new Date(),
          leftEar: hearingAssessment?.leftEar || "normal",
          rightEar: hearingAssessment?.rightEar || "normal",
          notes: hearingAssessment?.notes || "",
        }
      : undefined;

    const healthRecord: HealthRecord = {
      id: initialRecord?.id || `record-${Date.now()}`,
      studentId: student.id,
      height,
      weight,
      bloodType: bloodType === "" ? undefined : bloodType,
      allergies,
      chronicConditions,
      visionAssessment: finalVisionAssessment,
      hearingAssessment: finalHearingAssessment,
      medicalHistory: initialRecord?.medicalHistory || [],
      immunizations: initialRecord?.immunizations || [],
      lastUpdated: new Date(),
    };

    onSave(healthRecord);
  };

  if (!student) {
    return <Typography>Không tìm thấy thông tin học sinh.</Typography>;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cập nhật hồ sơ sức khỏe
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {student.lastName} {student.firstName} - Lớp {student.class}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        {/* Basic Information */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <TextField
                label="Chiều cao (cm)"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                sx={{ width: "200px" }}
                inputProps={{ min: 0 }}
              />

              <TextField
                label="Cân nặng (kg)"
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                sx={{ width: "200px" }}
                inputProps={{ min: 0 }}
              />

              <FormControl sx={{ width: "200px" }}>
                <InputLabel>Nhóm máu</InputLabel>
                <Select
                  value={bloodType}
                  onChange={(e) => {
                    // Using type assertion to fix TypeScript error
                    const value = e.target.value as typeof bloodType;
                    setBloodType(value);
                  }}
                  label="Nhóm máu"
                >
                  <MenuItem value="">
                    <em>Chưa xác định</em>
                  </MenuItem>
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Allergies */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Dị ứng
            </Typography>

            {allergies.length > 0 && (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {allergies.map((allergy) => (
                  <Box
                    key={allergy.id}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      position: "relative",
                    }}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveAllergy(allergy.id)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {allergy.name} - Mức độ:{" "}
                      {allergy.severity === "mild"
                        ? "Nhẹ"
                        : allergy.severity === "moderate"
                        ? "Trung bình"
                        : "Nặng"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Triệu chứng:</strong> {allergy.symptoms}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Điều trị:</strong> {allergy.treatment}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Thêm dị ứng mới
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Tên dị ứng"
                  fullWidth
                  value={newAllergy.name}
                  onChange={(e) =>
                    setNewAllergy({ ...newAllergy, name: e.target.value })
                  }
                />

                <FormControl fullWidth>
                  <InputLabel>Mức độ</InputLabel>
                  <Select
                    value={newAllergy.severity}
                    label="Mức độ"
                    onChange={(e) =>
                      setNewAllergy({
                        ...newAllergy,
                        severity: e.target.value as
                          | "mild"
                          | "moderate"
                          | "severe",
                      })
                    }
                  >
                    <MenuItem value="mild">Nhẹ</MenuItem>
                    <MenuItem value="moderate">Trung bình</MenuItem>
                    <MenuItem value="severe">Nặng</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Triệu chứng"
                  fullWidth
                  multiline
                  rows={2}
                  value={newAllergy.symptoms}
                  onChange={(e) =>
                    setNewAllergy({ ...newAllergy, symptoms: e.target.value })
                  }
                />

                <TextField
                  label="Điều trị"
                  fullWidth
                  multiline
                  rows={2}
                  value={newAllergy.treatment}
                  onChange={(e) =>
                    setNewAllergy({ ...newAllergy, treatment: e.target.value })
                  }
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày phát hiện"
                    value={newAllergy.dateIdentified}
                    onChange={(date) =>
                      setNewAllergy({
                        ...newAllergy,
                        dateIdentified: date || new Date(),
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddAllergy}
                  disabled={
                    !newAllergy.name ||
                    !newAllergy.symptoms ||
                    !newAllergy.treatment
                  }
                >
                  Thêm dị ứng
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Chronic Conditions */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Bệnh mãn tính
            </Typography>

            {chronicConditions.length > 0 && (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {chronicConditions.map((condition) => (
                  <Box
                    key={condition.id}
                    sx={{
                      p: 2,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      position: "relative",
                    }}
                  >
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveChronicCondition(condition.id)}
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>

                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {condition.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Ngày chẩn đoán:</strong>{" "}
                      {condition.diagnosisDate.toLocaleDateString("vi-VN")}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Ghi chú:</strong> {condition.notes}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Thêm bệnh mãn tính
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Tên bệnh"
                  fullWidth
                  value={newCondition.name}
                  onChange={(e) =>
                    setNewCondition({ ...newCondition, name: e.target.value })
                  }
                />

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày chẩn đoán"
                    value={newCondition.diagnosisDate}
                    onChange={(date) =>
                      setNewCondition({
                        ...newCondition,
                        diagnosisDate: date || new Date(),
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>

                <TextField
                  label="Ghi chú"
                  fullWidth
                  multiline
                  rows={2}
                  value={newCondition.notes}
                  onChange={(e) =>
                    setNewCondition({ ...newCondition, notes: e.target.value })
                  }
                />

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddChronicCondition}
                  disabled={!newCondition.name}
                >
                  Thêm bệnh mãn tính
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>

        {/* Vision Assessment */}
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Thị lực</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={hasVisionData}
                    onChange={(e) => setHasVisionData(e.target.checked)}
                  />
                }
                label="Nhập thông tin thị lực"
              />
            </Box>

            {hasVisionData && (
              <Stack spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày đo"
                    value={visionAssessment?.date || new Date()}
                    onChange={(date) =>
                      setVisionAssessment({
                        ...visionAssessment!,
                        id: visionAssessment?.id || `vision-${Date.now()}`,
                        date: date || new Date(),
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    label="Thị lực mắt trái"
                    type="number"
                    value={visionAssessment?.leftEye || 0}
                    onChange={(e) =>
                      setVisionAssessment({
                        ...visionAssessment!,
                        id: visionAssessment?.id || `vision-${Date.now()}`,
                        leftEye: Number(e.target.value),
                      })
                    }
                    inputProps={{ step: 0.1, min: 0, max: 1 }}
                    sx={{ flex: 1 }}
                  />

                  <TextField
                    label="Thị lực mắt phải"
                    type="number"
                    value={visionAssessment?.rightEye || 0}
                    onChange={(e) =>
                      setVisionAssessment({
                        ...visionAssessment!,
                        id: visionAssessment?.id || `vision-${Date.now()}`,
                        rightEye: Number(e.target.value),
                      })
                    }
                    inputProps={{ step: 0.1, min: 0, max: 1 }}
                    sx={{ flex: 1 }}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={visionAssessment?.wearsCorrective || false}
                      onChange={(e) =>
                        setVisionAssessment({
                          ...visionAssessment!,
                          id: visionAssessment?.id || `vision-${Date.now()}`,
                          wearsCorrective: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Có đeo kính"
                />

                <TextField
                  label="Ghi chú"
                  fullWidth
                  multiline
                  rows={2}
                  value={visionAssessment?.notes || ""}
                  onChange={(e) =>
                    setVisionAssessment({
                      ...visionAssessment!,
                      id: visionAssessment?.id || `vision-${Date.now()}`,
                      notes: e.target.value,
                    })
                  }
                />
              </Stack>
            )}
          </CardContent>
        </Card>

        {/* Hearing Assessment */}
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Thính lực</Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={hasHearingData}
                    onChange={(e) => setHasHearingData(e.target.checked)}
                  />
                }
                label="Nhập thông tin thính lực"
              />
            </Box>

            {hasHearingData && (
              <Stack spacing={2}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày đo"
                    value={hearingAssessment?.date || new Date()}
                    onChange={(date) =>
                      setHearingAssessment({
                        ...hearingAssessment!,
                        id: hearingAssessment?.id || `hearing-${Date.now()}`,
                        date: date || new Date(),
                      })
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>

                <FormControl fullWidth>
                  <InputLabel>Thính lực tai trái</InputLabel>
                  <Select
                    value={hearingAssessment?.leftEar || "normal"}
                    label="Thính lực tai trái"
                    onChange={(e) =>
                      setHearingAssessment({
                        ...hearingAssessment!,
                        id: hearingAssessment?.id || `hearing-${Date.now()}`,
                        leftEar: e.target.value as
                          | "normal"
                          | "mild loss"
                          | "moderate loss"
                          | "severe loss",
                      })
                    }
                  >
                    <MenuItem value="normal">Bình thường</MenuItem>
                    <MenuItem value="mild loss">Giảm nhẹ</MenuItem>
                    <MenuItem value="moderate loss">Giảm trung bình</MenuItem>
                    <MenuItem value="severe loss">Giảm nặng</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Thính lực tai phải</InputLabel>
                  <Select
                    value={hearingAssessment?.rightEar || "normal"}
                    label="Thính lực tai phải"
                    onChange={(e) =>
                      setHearingAssessment({
                        ...hearingAssessment!,
                        id: hearingAssessment?.id || `hearing-${Date.now()}`,
                        rightEar: e.target.value as
                          | "normal"
                          | "mild loss"
                          | "moderate loss"
                          | "severe loss",
                      })
                    }
                  >
                    <MenuItem value="normal">Bình thường</MenuItem>
                    <MenuItem value="mild loss">Giảm nhẹ</MenuItem>
                    <MenuItem value="moderate loss">Giảm trung bình</MenuItem>
                    <MenuItem value="severe loss">Giảm nặng</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Ghi chú"
                  fullWidth
                  multiline
                  rows={2}
                  value={hearingAssessment?.notes || ""}
                  onChange={(e) =>
                    setHearingAssessment({
                      ...hearingAssessment!,
                      id: hearingAssessment?.id || `hearing-${Date.now()}`,
                      notes: e.target.value,
                    })
                  }
                />
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button variant="outlined" onClick={onCancel} sx={{ mr: 2 }}>
          Hủy
        </Button>
        <Button variant="contained" color="primary" onClick={handleSaveRecord}>
          Lưu thông tin
        </Button>
      </Box>
    </Paper>
  );
};

export default HealthRecordForm;
