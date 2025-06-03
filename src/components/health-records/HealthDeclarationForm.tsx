import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";

type FormData = {
  studentId: string;
  height: number;
  weight: number;
  bloodType: string;
  allergies: Array<{
    name: string;
    severity: "mild" | "moderate" | "severe";
    symptoms: string;
    treatment: string;
  }>;
  chronicConditions: Array<{
    name: string;
    diagnosisDate: string;
    notes: string;
  }>;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes: string;
};

const steps = [
  "Thông tin cơ bản",
  "Dị ứng",
  "Bệnh mãn tính",
  "Liên hệ khẩn cấp",
];

const HealthDeclarationForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      studentId: "",
      height: 0,
      weight: 0,
      bloodType: "",
      allergies: [],
      chronicConditions: [],
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      notes: "",
    },
  });

  const {
    fields: allergyFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray({
    control,
    name: "allergies",
  });

  const {
    fields: conditionFields,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray({
    control,
    name: "chronicConditions",
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      console.log("Health declaration submitted:", data);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Khai báo sức khỏe thành công!");
      navigate("/health-records");
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#1976d2", fontWeight: "bold" }}
            >
              Thông tin cơ bản về sức khỏe
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 2 }}>
                <Controller
                  name="studentId"
                  control={control}
                  rules={{ required: "Vui lòng chọn học sinh" }}
                  render={({ field }) => (
                    <FormControl fullWidth error={!!errors.studentId}>
                      <InputLabel>Chọn học sinh</InputLabel>
                      <Select {...field} label="Chọn học sinh">
                        <MenuItem value="student1">
                          Nguyễn Văn A - Lớp 1A
                        </MenuItem>
                        <MenuItem value="student2">
                          Trần Thị B - Lớp 2B
                        </MenuItem>
                        <MenuItem value="student3">Lê Văn C - Lớp 3C</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="bloodType"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Nhóm máu</InputLabel>
                      <Select {...field} label="Nhóm máu">
                        <MenuItem value="">Chưa xác định</MenuItem>
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
                  )}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="height"
                  control={control}
                  rules={{
                    required: "Chiều cao là bắt buộc",
                    min: { value: 50, message: "Chiều cao phải > 50cm" },
                    max: { value: 250, message: "Chiều cao phải ≤ 250cm" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Chiều cao (cm)"
                      type="text" // Thay đổi từ "number" thành "text"
                      error={!!errors.height}
                      helperText={errors.height?.message}
                      onChange={(e) => {
                        // Loại bỏ các ký tự không phải số
                        const value = e.target.value.replace(/[e+\-]/g, '').replace(/[^0-9]/g, '');
                        field.onChange(value ? Number(value) : '');
                      }}
                      InputProps={{
                        inputProps: { 
                          inputMode: "numeric", // Hiển thị bàn phím số trên mobile
                          pattern: "[0-9]*",    // Pattern HTML5
                        }
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="weight"
                  control={control}
                  rules={{
                    required: "Cân nặng là bắt buộc",
                    min: { value: 10, message: "Cân nặng phải > 10kg" },
                    max: { value: 150, message: "Cân nặng phải ≤ 150kg" },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Cân nặng (kg)"
                      type="text" // Thay đổi từ "number" thành "text"
                      error={!!errors.weight}
                      helperText={errors.weight?.message}
                      onChange={(e) => {
                        // Loại bỏ các ký tự không phải số
                        const value = e.target.value.replace(/[e+\-]/g, '').replace(/[^0-9]/g, '');
                        field.onChange(value ? Number(value) : '');
                      }}
                      InputProps={{
                        inputProps: { 
                          inputMode: "numeric", // Hiển thị bàn phím số trên mobile
                          pattern: "[0-9]*",    // Pattern HTML5
                        }
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#ff9800", fontWeight: "bold" }}
              >
                Thông tin dị ứng
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  appendAllergy({
                    name: "",
                    severity: "mild",
                    symptoms: "",
                    treatment: "",
                  })
                }
                variant="outlined"
              >
                Thêm dị ứng
              </Button>
            </Box>

            {allergyFields.length === 0 ? (
              <Alert severity="info">
                Chưa có thông tin dị ứng nào. Nhấn "Thêm dị ứng" để bổ sung.
              </Alert>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {allergyFields.map((field, index) => (
                  <Paper key={field.id} sx={{ p: 3, bgcolor: "#fff3e0" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Dị ứng #{index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => removeAllergy(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Controller
                            name={`allergies.${index}.name`}
                            control={control}
                            rules={{ required: "Tên dị ứng là bắt buộc" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Tên dị ứng"
                                error={!!errors.allergies?.[index]?.name}
                                helperText={
                                  errors.allergies?.[index]?.name?.message
                                }
                              />
                            )}
                          />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Controller
                            name={`allergies.${index}.severity`}
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <InputLabel>Mức độ</InputLabel>
                                <Select {...field} label="Mức độ">
                                  <MenuItem value="mild">Nhẹ</MenuItem>
                                  <MenuItem value="moderate">
                                    Trung bình
                                  </MenuItem>
                                  <MenuItem value="severe">Nặng</MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </Box>
                      </Box>

                      <Controller
                        name={`allergies.${index}.symptoms`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Triệu chứng"
                            multiline
                            rows={2}
                          />
                        )}
                      />

                      <Controller
                        name={`allergies.${index}.treatment`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Cách điều trị"
                            multiline
                            rows={2}
                          />
                        )}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#f44336", fontWeight: "bold" }}
              >
                Bệnh mãn tính
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  appendCondition({ name: "", diagnosisDate: "", notes: "" })
                }
                variant="outlined"
              >
                Thêm bệnh mãn tính
              </Button>
            </Box>

            {conditionFields.length === 0 ? (
              <Alert severity="info">
                Chưa có thông tin bệnh mãn tính nào. Nhấn "Thêm bệnh mãn tính"
                để bổ sung.
              </Alert>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {conditionFields.map((field, index) => (
                  <Paper key={field.id} sx={{ p: 3, bgcolor: "#ffebee" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        Bệnh mãn tính #{index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => removeCondition(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "column", md: "row" },
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Controller
                            name={`chronicConditions.${index}.name`}
                            control={control}
                            rules={{ required: "Tên bệnh là bắt buộc" }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Tên bệnh"
                                error={
                                  !!errors.chronicConditions?.[index]?.name
                                }
                                helperText={
                                  errors.chronicConditions?.[index]?.name
                                    ?.message
                                }
                              />
                            )}
                          />
                        </Box>

                        <Box sx={{ flex: 1 }}>
                          <Controller
                            name={`chronicConditions.${index}.diagnosisDate`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Ngày chẩn đoán"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Box>
                      </Box>

                      <Controller
                        name={`chronicConditions.${index}.notes`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Ghi chú"
                            multiline
                            rows={3}
                          />
                        )}
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        );

      case 3:
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#4caf50", fontWeight: "bold" }}
            >
              Thông tin liên hệ khẩn cấp
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="emergencyContact.name"
                  control={control}
                  rules={{ 
                    required: "Tên người liên hệ là bắt buộc",
                    pattern: {
                      // Pattern chấp nhận chữ cái, khoảng trắng và chữ cái có dấu tiếng Việt
                      value: /^[a-zA-ZÀ-ỹ\s]+$/,
                      message: "Tên người liên hệ chỉ được chứa chữ cái"
                    }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Tên người liên hệ"
                      error={!!errors.emergencyContact?.name}
                      helperText={errors.emergencyContact?.name?.message}
                      onChange={(e) => {
                        // Loại bỏ các ký tự không phải chữ cái hoặc khoảng trắng
                        const value = e.target.value.replace(/[^a-zA-ZÀ-ỹ\s]/g, '');
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Controller
                  name="emergencyContact.relationship"
                  control={control}
                  rules={{ required: "Mối quan hệ là bắt buộc" }}
                  render={({ field }) => (
                    <FormControl
                      fullWidth
                      error={!!errors.emergencyContact?.relationship}
                    >
                      <InputLabel>Mối quan hệ</InputLabel>
                      <Select {...field} label="Mối quan hệ">
                        <MenuItem value="father">Bố</MenuItem>
                        <MenuItem value="mother">Mẹ</MenuItem>
                        <MenuItem value="grandfather">Ông</MenuItem>
                        <MenuItem value="grandmother">Bà</MenuItem>
                        <MenuItem value="uncle">Chú/Bác</MenuItem>
                        <MenuItem value="aunt">Cô/Dì</MenuItem>
                        <MenuItem value="other">Khác</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Controller
                  name="emergencyContact.phone"
                  control={control}
                  rules={{
                    required: "Số điện thoại là bắt buộc",
                    pattern: {
                      value: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ (phải có 10-11 chữ số)",
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Số điện thoại"
                      error={!!errors.emergencyContact?.phone}
                      helperText={errors.emergencyContact?.phone?.message}
                      onChange={(e) => {
                        // Loại bỏ chữ 'e' và dấu '+' và các ký tự không phải số
                        const value = e.target.value
                          .replace(/[e+]/g, "")
                          .replace(/[^0-9]/g, "");
                        field.onChange(value);
                      }}
                      inputProps={{
                        inputMode: "numeric", // Hiển thị bàn phím số trên mobile
                        pattern: "[0-9]*", // Thêm pattern HTML5
                      }}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: 2 }}>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Ghi chú thêm"
                      multiline
                      rows={4}
                      placeholder="Thông tin bổ sung về sức khỏe của học sinh..."
                    />
                  )}
                />
              </Box>
            </Box>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Khai báo sức khỏe học sinh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Vui lòng điền đầy đủ thông tin sức khỏe của học sinh
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, p: 3 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              {renderStepContent(activeStep)}
            </CardContent>
          </Card>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Quay lại
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={<SaveIcon />}
                  sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#45a049" } }}
                >
                  {loading ? "Đang lưu..." : "Hoàn thành"}
                </Button>
              ) : (
                <Button onClick={handleNext} variant="contained">
                  Tiếp theo
                </Button>
              )}
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default HealthDeclarationForm;
