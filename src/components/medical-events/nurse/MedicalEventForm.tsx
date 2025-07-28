import React, { useState, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
  CreateMedicalIncidentRequest,
  MedicalSupplyUsage,
} from "../../../models/types";
import { toast } from "react-toastify";
import instance from "../../../utils/axiosConfig";

// Student interface for form
interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number;
  class: string;
  schoolYear: string;
  image: string;
}

// Supply interface matching the API response
interface MedicalSupplier {
  id: string;
  supplyName: string;
  supplyType: number;
  unit: string;
  quantity: number;
  supplier: string;
  image: string[];
}

interface MedicalEventFormProps {
  nurseId: string;
  nurseName: string;
  initialEvent?: any;
  onSave: (event: any) => void; // Changed to 'any' to handle both create and update requests
  onCancel: () => void;
  isEditMode?: boolean;
}

const MedicalEventForm: React.FC<MedicalEventFormProps> = ({
  nurseId,
  nurseName,
  initialEvent,
  onSave,
  onCancel,
  isEditMode = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingSupplies, setLoadingSupplies] = useState(false);
  const [allStudents, setAllStudents] = useState<Student[]>([]); // Store all students
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]); // Store filtered students
  const [studentSearchText, setStudentSearchText] = useState("");
  const [medicalSuppliers, setMedicalSuppliers] = useState<MedicalSupplier[]>(
    []
  );

  const [student, setStudent] = useState<Student | null>(
    initialEvent
      ? {
          id: initialEvent.student.id,
          studentCode: initialEvent.student.studentCode,
          fullName: initialEvent.student.fullName,
          dateOfBirth: initialEvent.student.dateOfBirth,
          gender: initialEvent.student.gender,
          class: initialEvent.student.class,
          schoolYear: initialEvent.student.schoolYear,
          image: initialEvent.student.image || "",
        }
      : null
  );
  const [incidentDate, setIncidentDate] = useState<Date>(
    initialEvent ? new Date(initialEvent.incidentDate) : new Date()
  );
  const [incidentType, setIncidentType] = useState<number>(
    initialEvent ? initialEvent.incidentType : 0
  );
  const [description, setDescription] = useState<string>(
    initialEvent ? initialEvent.description : ""
  );
  const [actionsTaken, setActionsTaken] = useState<string>(
    initialEvent ? initialEvent.actionsTaken : ""
  );
  const [outcome, setOutcome] = useState<string>(
    initialEvent ? initialEvent.outcome : ""
  );
  const [status, setStatus] = useState<number>(
    initialEvent ? initialEvent.status : 0
  );
  const [notifyParent, setNotifyParent] = useState<boolean>(
    initialEvent ? initialEvent.parentNotified : false
  );
  const [medicalSupplyUsages, setMedicalSupplyUsages] = useState<
    MedicalSupplyUsage[]
  >(
    initialEvent && initialEvent.medicalSupplyUsages
      ? initialEvent.medicalSupplyUsages.map((usage: any) => ({
          medicalSupplierId: usage.supplyId || usage.medicalSupplierId,
          quantityUsed: usage.quantity || usage.quantityUsed,
          usageDate: usage.usageDate || new Date().toISOString(),
          notes: usage.notes || "",
        }))
      : []
  );

  // Supply usage states
  const [selectedSupplyId, setSelectedSupplyId] = useState<string>("");
  const [selectedSupplyQuantity, setSelectedSupplyQuantity] =
    useState<number>(1);
  const [selectedSupplyNotes, setSelectedSupplyNotes] = useState<string>("");

  // Form validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch all students on component mount
  useEffect(() => {
    const fetchAllStudents = async () => {
      setLoading(true);
      try {
        const response = await instance.get("/api/Student/get-all-students");
        setAllStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        // toast.error('Không thể tải danh sách học sinh');
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  // Fetch all medical suppliers on component mount
  useEffect(() => {
    const fetchMedicalSuppliers = async () => {
      setLoadingSupplies(true);
      try {
        const response = await instance.get(
          "/api/MedicalSupplier/get-all-suppliers"
        );
        setMedicalSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching medical suppliers:", error);
        // toast.error('Không thể tải danh sách vật tư y tế');
      } finally {
        setLoadingSupplies(false);
      }
    };

    fetchMedicalSuppliers();
  }, []);

  // Filter students client-side based on search text
  const filterStudents = (searchText: string) => {
    if (!searchText || searchText.length < 1) {
      // When search text is empty, show all students
      setFilteredStudents(allStudents);
      return;
    }

    const filtered = allStudents.filter(
      (student: Student) =>
        student.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.studentCode.toLowerCase().includes(searchText.toLowerCase()) ||
        student.class?.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredStudents(filtered);
  };

  const handleStudentChange = async (value: Student | null) => {
    setStudent(value);
    if (value) {
      try {
        // In a real app, we would fetch student details including health record
        // const response = await axios.get(`/api/Student/get-student-by-id/${value.id}`);
        // const studentData = response.data;
        // Additional logic here if needed
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    }
  };

  const addSupplyUsage = async () => {
    if (!selectedSupplyId) {
      setErrors({ ...errors, supply: "Vui lòng chọn vật tư y tế" });
      return;
    }

    if (selectedSupplyQuantity <= 0) {
      setErrors({ ...errors, supplyQuantity: "Số lượng phải lớn hơn 0" });
      return;
    }

    try {
      // Get detailed information about the selected medical supply
      const response = await instance.get(
        `/api/MedicalSupplier/get-supplier-by-id/${selectedSupplyId}`
      );
      const supplyDetails = response.data;

      // Check if we have enough quantity available
      if (supplyDetails.quantity < selectedSupplyQuantity) {
        setErrors({
          ...errors,
          supplyQuantity: `Chỉ còn ${supplyDetails.quantity} ${supplyDetails.unit} trong kho`,
        });
        return;
      }

      // Check if this supply is already in our list (in case of edit mode)
      const existingSupplyIndex = medicalSupplyUsages.findIndex(
        (supply) => supply.medicalSupplierId === selectedSupplyId
      );

      if (existingSupplyIndex >= 0 && initialEvent?.medicalSupplyUsages) {
        // Check if it's an original supply in edit mode
        const isOriginalSupply = initialEvent.medicalSupplyUsages.some(
          (supply: any) =>
            (supply.medicalSupplierId || supply.supplyId) === selectedSupplyId
        );

        if (isOriginalSupply) {
          setErrors({
            ...errors,
            supply:
              "Vật tư này đã được sử dụng trước đây, vui lòng chọn vật tư khác",
          });
          return;
        }

        // Update existing supply quantity if it's a new supply
        const updatedSupplies = [...medicalSupplyUsages];
        updatedSupplies[existingSupplyIndex].quantityUsed +=
          selectedSupplyQuantity;

        // Update the actions taken field with the supply usage information
        setActionsTaken((prev) => {
          const supplyInfo = `Sử dụng thêm ${selectedSupplyQuantity} ${supplyDetails.unit} ${supplyDetails.supplyName}`;
          return prev ? `${prev}, ${supplyInfo}` : supplyInfo;
        });

        setMedicalSupplyUsages(updatedSupplies);
      } else {
        // Add the supply to the list
        const newSupplyUsage: MedicalSupplyUsage = {
          medicalSupplierId: selectedSupplyId,
          quantityUsed: selectedSupplyQuantity,
          usageDate: new Date().toISOString(),
          notes: selectedSupplyNotes,
        };

        // Update the actions taken field with the supply usage information
        setActionsTaken((prev) => {
          const supplyInfo = `Sử dụng ${selectedSupplyQuantity} ${supplyDetails.unit} ${supplyDetails.supplyName}`;
          return prev ? `${prev}, ${supplyInfo}` : supplyInfo;
        });

        setMedicalSupplyUsages([...medicalSupplyUsages, newSupplyUsage]);
      }

      setSelectedSupplyId("");
      setSelectedSupplyQuantity(1);
      setSelectedSupplyNotes("");

      // Clear any supply errors
      const { supply, supplyQuantity, ...otherErrors } = errors;
      setErrors(otherErrors);
    } catch (error) {
      console.error("Error fetching medical supply details:", error);
      // toast.error('Không thể tải thông tin vật tư y tế');
    }
  };

  const removeSupplyUsage = (index: number) => {
    // In edit mode, check if this is an original supply that can't be removed
    if (isEditMode && initialEvent?.medicalSupplyUsages) {
      const supplyToRemove = medicalSupplyUsages[index];

      // Check if the supply to remove is from the original event
      const isOriginalSupply = initialEvent.medicalSupplyUsages.some(
        (supply: any) =>
          (supply.medicalSupplierId || supply.supplyId) ===
          supplyToRemove.medicalSupplierId
      );

      if (isOriginalSupply) {
        toast.error(
          "Không thể xóa vật tư đã được sử dụng trong sự kiện này trước đây"
        );
        return;
      }
    }

    // Remove the supply if it's new or if we're not in edit mode
    const updatedSupplies = [...medicalSupplyUsages];
    updatedSupplies.splice(index, 1);
    setMedicalSupplyUsages(updatedSupplies);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!student) {
      newErrors.student = "Vui lòng chọn học sinh";
    }

    if (!description.trim()) {
      newErrors.description = "Vui lòng nhập mô tả sự kiện";
    }

    if (!actionsTaken.trim()) {
      newErrors.actionsTaken = "Vui lòng nhập hành động đã thực hiện";
    }

    if (!outcome.trim()) {
      newErrors.outcome = "Vui lòng nhập kết quả";
    }

    // Check medical supply usages
    if (medicalSupplyUsages.length > 0) {
      for (const usage of medicalSupplyUsages) {
        const supplierInfo = medicalSuppliers.find(
          (s) => s.id === usage.medicalSupplierId
        );

        if (supplierInfo && usage.quantityUsed > supplierInfo.quantity) {
          newErrors.supplyQuantity = `Vật tư "${supplierInfo.supplyName}" không đủ số lượng (còn ${supplierInfo.quantity} ${supplierInfo.unit})`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!student) {
      return; // This should be caught by validation
    }

    setLoading(true);

    try {
      // For update mode, only send the allowed fields
      if (isEditMode && initialEvent) {
        const updateData = {
          id: initialEvent.id,
          incidentType: incidentType,
          incidentDate: incidentDate.toISOString(),
          description: description,
          actionsTaken: actionsTaken,
          outcome: outcome,
          status: status,
          parentNotified: notifyParent,
          parentNotificationDate: notifyParent
            ? new Date().toISOString()
            : initialEvent.parentNotificationDate,
          // Only include new supply usages that aren't in the original event
          medicalSupplierUsage: medicalSupplyUsages.filter(
            (newSupply) =>
              !initialEvent.medicalSupplyUsages?.some(
                (origSupply: any) =>
                  (origSupply.medicalSupplierId || origSupply.supplyId) ===
                    newSupply.medicalSupplierId &&
                  (origSupply.quantityUsed || origSupply.quantity) ===
                    newSupply.quantityUsed
              )
          ),
        };

        // Update parent notification action text
        if (notifyParent && !initialEvent.parentNotified) {
          if (!updateData.actionsTaken.includes("Đã thông báo cho phụ huynh")) {
            updateData.actionsTaken += "\nĐã thông báo cho phụ huynh.";
          }
        }

        onSave(updateData);
      } else {
        // Create new incident
        const incidentData = {
          studentId: student.id,
          incidentType: incidentType,
          incidentDate: incidentDate.toISOString(),
          description: description,
          actionsTaken: actionsTaken,
          outcome: outcome,
          status: status,
          medicalSupplierUsage: medicalSupplyUsages,
        };

        // If parent notification is enabled for new incidents
        if (notifyParent) {
          if (!actionsTaken.includes("Đã thông báo cho phụ huynh")) {
            incidentData.actionsTaken += "\nĐã thông báo cho phụ huynh.";
          }

          // These fields are not in the CreateMedicalIncidentRequest type but might be used by the API
          (incidentData as any).parentNotified = true;
          (incidentData as any).parentNotificationDate =
            new Date().toISOString();
        }

        // When creating, we should also update supplier quantities
        if (medicalSupplyUsages.length > 0) {
          for (const usage of medicalSupplyUsages) {
            try {
              // Get current supplier details
              const supplierResponse = await instance.get(
                `/api/MedicalSupplier/get-supplier-by-id/${usage.medicalSupplierId}`
              );
              const supplierData = supplierResponse.data;

              // Calculate new quantity
              const newQuantity = Math.max(
                0,
                supplierData.quantity - usage.quantityUsed
              );

              // Update the supplier inventory
              await instance.put(
                `/api/MedicalSupplier/update-supplier/${usage.medicalSupplierId}`,
                {
                  supplyName: supplierData.supplyName,
                  supplyType: supplierData.supplyType,
                  unit: supplierData.unit,
                  quantity: newQuantity,
                  supplier: supplierData.supplier,
                  image: supplierData.image,
                }
              );
            } catch (err) {
              console.error(
                `Error updating supply ${usage.medicalSupplierId}:`,
                err
              );
            }
          }
        }

        onSave(incidentData);
      }

      // Show success message
      toast.success(
        isEditMode
          ? "Đã cập nhật sự kiện y tế!"
          : "Đã ghi nhận sự kiện y tế mới!"
      );
    } catch (error) {
      console.error(
        isEditMode
          ? "Error updating medical incident:"
          : "Error creating medical incident:",
        error
      );
      toast.error(
        isEditMode
          ? "Có lỗi xảy ra khi cập nhật sự kiện y tế"
          : "Có lỗi xảy ra khi tạo sự kiện y tế"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {initialEvent ? "Cập nhật sự kiện y tế" : "Ghi nhận sự kiện y tế mới"}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* Student Selection */}
          <FormControl error={!!errors.student} fullWidth>
            <Autocomplete
              id="student-select"
              options={filteredStudents}
              loading={loading}
              value={student}
              onChange={(_, value) => handleStudentChange(value)}
              onInputChange={(_, value) => {
                setStudentSearchText(value);
                filterStudents(value); // Client-side filtering
              }}
              getOptionLabel={(option) =>
                `${option.fullName} - ${option.studentCode} - Lớp ${option.class}`
              }
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>
                    <Typography variant="body1">{option.fullName}</Typography>
                    <Typography variant="caption">
                      {option.studentCode} | Lớp {option.class} | Khóa{" "}
                      {option.schoolYear}
                    </Typography>
                  </Box>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Chọn học sinh"
                  placeholder="Nhập tên hoặc mã học sinh để tìm kiếm"
                  error={!!errors.student}
                  helperText={errors.student || "Nhập tên học sinh để tìm kiếm"}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                    readOnly: isEditMode,
                  }}
                  disabled={isEditMode}
                />
              )}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterOptions={(x) => x} // We use our own filtering logic
              disabled={isEditMode}
            />
            {isEditMode && student && (
              <FormHelperText>
                Không thể thay đổi học sinh trong chế độ sửa
              </FormHelperText>
            )}
          </FormControl>

          {/* Incident DateTime */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Thời gian xảy ra"
              value={incidentDate}
              onChange={(newValue) => newValue && setIncidentDate(newValue)}
              slotProps={{
                textField: { fullWidth: true },
              }}
              disabled={isEditMode}
            />
            {isEditMode && (
              <FormHelperText>
                Không thể thay đổi thời gian xảy ra trong chế độ sửa
              </FormHelperText>
            )}
          </LocalizationProvider>

          {/* Incident Type */}
          <FormControl fullWidth>
            <InputLabel id="incident-type-label">Loại sự kiện</InputLabel>
            <Select
              labelId="incident-type-label"
              id="incident-type"
              value={incidentType}
              label="Loại sự kiện"
              onChange={(e) => setIncidentType(e.target.value as number)}
              disabled={isEditMode}
            >
              <MenuItem value={0}>Bệnh</MenuItem>
              <MenuItem value={1}>Chấn thương</MenuItem>
              <MenuItem value={2}>Khẩn cấp</MenuItem>
            </Select>
            {isEditMode && (
              <FormHelperText>
                Không thể thay đổi loại sự kiện trong chế độ sửa
              </FormHelperText>
            )}
          </FormControl>

          {/* Description */}
          <TextField
            label="Mô tả sự kiện"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
          />

          {/* Actions Taken */}
          <TextField
            label="Hành động đã thực hiện"
            multiline
            rows={3}
            value={actionsTaken}
            onChange={(e) => setActionsTaken(e.target.value)}
            error={!!errors.actionsTaken}
            helperText={errors.actionsTaken}
            fullWidth
          />

          {/* Outcome */}
          <TextField
            label="Kết quả"
            multiline
            rows={2}
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            error={!!errors.outcome}
            helperText={errors.outcome}
            fullWidth
          />

          {/* Status */}
          <FormControl fullWidth>
            <InputLabel id="status-label">Trạng thái</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={status}
              label="Trạng thái"
              onChange={(e) => setStatus(e.target.value as number)}
            >
              <MenuItem value={0}>Đang theo dõi</MenuItem>
              <MenuItem value={1}>Đã ổn định</MenuItem>
            </Select>
          </FormControl>

          {/* Medical Supply Usage */}
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Vật tư y tế đã sử dụng
            </Typography>

            <Box
              sx={{ display: "flex", mb: 2, gap: 2, flexDirection: "column" }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth error={!!errors.supply} sx={{ flex: 2 }}>
                  <InputLabel id="supply-label">Chọn vật tư</InputLabel>
                  <Select
                    labelId="supply-label"
                    id="supply-select"
                    value={selectedSupplyId}
                    label="Chọn vật tư"
                    onChange={(e) =>
                      setSelectedSupplyId(e.target.value as string)
                    }
                    disabled={loadingSupplies}
                  >
                    {loadingSupplies ? (
                      <MenuItem disabled>Đang tải...</MenuItem>
                    ) : (
                      medicalSuppliers.map((supply) => (
                        <MenuItem key={supply.id} value={supply.id}>
                          {supply.supplyName} ({supply.quantity} {supply.unit})
                        </MenuItem>
                      ))
                    )}
                  </Select>
                  {errors.supply && (
                    <FormHelperText>{errors.supply}</FormHelperText>
                  )}
                </FormControl>
                <TextField
                  label="Số lượng"
                  type="number"
                  value={selectedSupplyQuantity}
                  onChange={(e) =>
                    setSelectedSupplyQuantity(parseInt(e.target.value) || 0)
                  }
                  error={!!errors.supplyQuantity}
                  helperText={errors.supplyQuantity}
                  InputProps={{ inputProps: { min: 1 } }}
                  sx={{ flex: 1 }}
                />
              </Box>
              <TextField
                label="Ghi chú sử dụng (tùy chọn)"
                value={selectedSupplyNotes}
                onChange={(e) => setSelectedSupplyNotes(e.target.value)}
                placeholder="VD: Dùng để băng bó vết thương..."
                fullWidth
              />
              <Button
                variant="contained"
                onClick={addSupplyUsage}
                sx={{ alignSelf: "flex-start" }}
                disabled={!selectedSupplyId || loadingSupplies}
              >
                Thêm vật tư
              </Button>
            </Box>

            {medicalSupplyUsages.length > 0 && (
              <Stack spacing={1}>
                {medicalSupplyUsages.map((supply, index) => {
                  const supplierInfo = medicalSuppliers.find(
                    (s) => s.id === supply.medicalSupplierId
                  );

                  // Check if this is an original supply in edit mode
                  const isOriginalSupply =
                    isEditMode &&
                    initialEvent?.medicalSupplyUsages?.some(
                      (origSupply: any) =>
                        (origSupply.medicalSupplierId ||
                          origSupply.supplyId) === supply.medicalSupplierId &&
                        (origSupply.quantityUsed || origSupply.quantity) ===
                          supply.quantityUsed
                    );

                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: isOriginalSupply
                          ? "rgba(41, 128, 185, 0.1)"
                          : "#f8f9fa",
                        p: 1,
                        borderRadius: 1,
                        border: isOriginalSupply
                          ? "1px solid rgba(41, 128, 185, 0.3)"
                          : "none",
                      }}
                    >
                      <Typography sx={{ flex: 1 }}>
                        {supplierInfo
                          ? supplierInfo.supplyName
                          : supply.medicalSupplierId}{" "}
                        - SL: {supply.quantityUsed} {supplierInfo?.unit}
                        {supply.notes && (
                          <span style={{ color: "#666", marginLeft: 8 }}>
                            ({supply.notes})
                          </span>
                        )}
                        {isOriginalSupply && (
                          <span style={{ color: "#2980b9", marginLeft: 8 }}>
                            (Đã sử dụng trước đây)
                          </span>
                        )}
                      </Typography>
                      {!isOriginalSupply && (
                        <Button
                          size="small"
                          color="error"
                          onClick={() => removeSupplyUsage(index)}
                        >
                          Xóa
                        </Button>
                      )}
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Paper>

          {/* Form Actions */}
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}
          >
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Quay lại
            </Button>
            <Button
              variant="contained"
              type="submit"
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Đang xử lý..." : initialEvent ? "Cập nhật" : "Lưu"}
            </Button>
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default MedicalEventForm;
