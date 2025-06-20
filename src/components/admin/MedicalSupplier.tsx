import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  IconButton,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Badge,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Image as ImageIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext"; // Fix import path
import axios from "axios";
import instance from "../../utils/axiosConfig"; // Import axios instance

// SupplyType enum mapping
enum SupplyType {
  Medication = 0,
  Equipment = 1,
  ConsumableSupply = 2,
}

const MedicalSupplierPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Use AuthContext với user và loading
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [filterType, setFilterType] = useState<number | "all">("all");
  const [medicalSuppliers, setMedicalSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await instance.get(
        `${process.env.REACT_APP_MEDICAL_SUPPLIER_API}/get-all-suppliers`
      );
      setMedicalSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Không thể tải dữ liệu vật tư y tế. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a single supplier by ID
  const fetchSupplierById = async (id: number) => {
    try {
      const response = await instance.get(
        `${process.env.REACT_APP_MEDICAL_SUPPLIER_API}/get-supplier-by-id/${id}`
      );
      return response.data;
    } catch (err) {
      console.error(`Error fetching supplier with ID ${id}:`, err);
      throw new Error("Không thể tải thông tin vật tư");
    }
  };

  // Create a new supplier
  const createSupplier = async (supplierData: any) => {
    try {
      const response = await instance.post(
        `${process.env.REACT_APP_MEDICAL_SUPPLIER_API}/create-supplier`,
        supplierData
      );
      return response.data;
    } catch (err) {
      console.error("Error creating supplier:", err);
      throw new Error("Không thể tạo vật tư mới");
    }
  };

  // Update an existing supplier
  const updateSupplier = async (id: number, supplierData: any) => {
    try {
      const response = await instance.put(
        `${process.env.REACT_APP_MEDICAL_SUPPLIER_API}/update-supplier/${id}`,
        supplierData
      );
      return response.data;
    } catch (err) {
      console.error(`Error updating supplier with ID ${id}:`, err);
      throw new Error("Không thể cập nhật vật tư");
    }
  };

  // Delete a supplier
  const deleteSupplier = async (id: number) => {
    try {
      const response = await instance.delete(
        `${process.env.REACT_APP_MEDICAL_SUPPLIER_API}/delete-supplier/${id}`
      );
      return response.data;
    } catch (err) {
      console.error(`Error deleting supplier with ID ${id}:`, err);
      throw new Error("Không thể xóa vật tư");
    }
  };

  // Load suppliers on component mount
  useEffect(() => {
    if (user && user.isAuthenticated && user.role !== "Parent") {
      fetchSuppliers();
    }
  }, [user]);

  // Loading state while checking authentication
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang kiểm tra quyền truy cập...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Check if user is authenticated (user exists và isAuthenticated)
  if (!user || !user.isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6">Chưa đăng nhập</Typography>
            <Typography>Vui lòng đăng nhập để truy cập trang này.</Typography>
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            startIcon={<LockIcon />}
          >
            Đăng nhập
          </Button>
        </Box>
      </Container>
    );
  }

  // Check admin permission (role === 'admin')
  if (user.role == "Parent") {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Truy cập bị từ chối</Typography>
            <Typography>
              Bạn không có quyền truy cập trang quản lý vật tư y tế. Chỉ quản
              trị viên mới có thể truy cập trang này.
            </Typography>
          </Alert>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
            <Button variant="contained" onClick={() => window.history.back()}>
              Quay lại
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Đang tải dữ liệu vật tư y tế...
          </Typography>
        </Box>
      </Container>
    );
  }

  // Show error message if fetching failed
  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Lỗi</Typography>
            <Typography>{error}</Typography>
          </Alert>
          <Button variant="contained" onClick={() => fetchSuppliers()}>
            Thử lại
          </Button>
        </Box>
      </Container>
    );
  }

  // Helper function để hiển thị tên role
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Quản trị viên";
      case "nurse":
        return "Y tá";
      case "parent":
        return "Phụ huynh";
      case "student":
        return "Học sinh";
      default:
        return "Không xác định";
    }
  };

  const getSupplyTypeText = (type: SupplyType) => {
    switch (type) {
      case SupplyType.Medication:
        return "Thuốc";
      case SupplyType.Equipment:
        return "Thiết bị";
      case SupplyType.ConsumableSupply:
        return "Vật tư tiêu hao";
      default:
        return "Không xác định";
    }
  };

  const getSupplyTypeColor = (type: SupplyType) => {
    switch (type) {
      case SupplyType.Medication:
        return "primary";
      case SupplyType.Equipment:
        return "secondary";
      case SupplyType.ConsumableSupply:
        return "warning";
      default:
        return "default";
    }
  };

  const getFilteredData = () => {
    if (filterType === "all") {
      return medicalSuppliers.filter((item) => !item.isDeleted);
    }
    return medicalSuppliers.filter(
      (item) => !item.isDeleted && item.supplyType === filterType
    );
  };

  const getLowStockItems = () => {
    return medicalSuppliers.filter((item) => {
      if (item.isDeleted) return false;
      switch (item.supplyType) {
        case SupplyType.Medication:
          return item.quantity < 50;
        case SupplyType.Equipment:
          return item.quantity < 2;
        case SupplyType.ConsumableSupply:
          return item.quantity < 30;
        default:
          return false;
      }
    });
  };

  const handleOpenDialog = async (item?: any) => {
    if (item) {
      try {
        const supplierData = await fetchSupplierById(item.id);
        setSelectedItem(supplierData);
        setFormData(supplierData);
      } catch (err) {
        alert("Không thể tải thông tin vật tư. Vui lòng thử lại.");
        return;
      }
    } else {
      setSelectedItem(null);
      setFormData({
        supplyName: "",
        supplyType: SupplyType.Medication,
        unit: "",
        quantity: 0,
        supplier: "",
        image: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (selectedItem) {
        await updateSupplier(selectedItem.id, formData);
        alert("Cập nhật vật tư thành công!");
      } else {
        await createSupplier(formData);
        alert("Thêm vật tư thành công!");
      }
      handleCloseDialog();
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving medical supplier:", error);
      alert("Có lỗi xảy ra khi lưu vật tư!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vật tư này?")) {
      try {
        setIsLoading(true);
        await deleteSupplier(id);
        alert("Xóa vật tư thành công!");
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting medical supplier:", error);
        alert("Có lỗi xảy ra khi xóa vật tư!");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const lowStockItems = getLowStockItems();
  const filteredData = getFilteredData();

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        {/* Header with user info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <InventoryIcon sx={{ fontSize: 40, color: "#2e7d32", mr: 2 }} />
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#2e7d32" }}
              >
                Quản lý vật tư y tế
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quản lý thuốc, thiết bị và vật tư tiêu hao trong kho
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Alert cho low stock */}
        {lowStockItems.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6">Cảnh báo tồn kho</Typography>
            <Typography>
              Có {lowStockItems.length} vật tư sắp hết hàng. Vui lòng kiểm tra
              và bổ sung kịp thời.
            </Typography>
          </Alert>
        )}

        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            {/* Header with filters and add button */}
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Danh sách vật tư ({filteredData.length})
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Lọc theo loại</InputLabel>
                  <Select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Lọc theo loại"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value={SupplyType.Medication}>Thuốc</MenuItem>
                    <MenuItem value={SupplyType.Equipment}>Thiết bị</MenuItem>
                    <MenuItem value={SupplyType.ConsumableSupply}>
                      Vật tư tiêu hao
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#45a049" } }}
              >
                Thêm vật tư
              </Button>
            </Box>

            {/* Statistics row */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: "#e3f2fd" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#1976d2", fontWeight: "bold" }}
                    >
                      {
                        medicalSuppliers.filter(
                          (i) =>
                            i.supplyType === SupplyType.Medication &&
                            !i.isDeleted
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2">Loại thuốc</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: "#f3e5f5" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#7b1fa2", fontWeight: "bold" }}
                    >
                      {
                        medicalSuppliers.filter(
                          (i) =>
                            i.supplyType === SupplyType.Equipment &&
                            !i.isDeleted
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2">Thiết bị</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: "#fff3e0" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#f57c00", fontWeight: "bold" }}
                    >
                      {
                        medicalSuppliers.filter(
                          (i) =>
                            i.supplyType === SupplyType.ConsumableSupply &&
                            !i.isDeleted
                        ).length
                      }
                    </Typography>
                    <Typography variant="body2">Vật tư tiêu hao</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: "#ffebee" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#d32f2f", fontWeight: "bold" }}
                    >
                      {lowStockItems.length}
                    </Typography>
                    <Typography variant="body2">Sắp hết hàng</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Box>

            {/* Main table */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Hình ảnh</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Tên vật tư
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Loại</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Số lượng</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Đơn vị</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Nhà cung cấp
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Cập nhật cuối
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => {
                    const isLowStock = lowStockItems.some(
                      (low) => low.id === item.id
                    );

                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {item.image && item.image.length > 0 ? (
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                {item.image
                                  .slice(0, 2)
                                  .map((img: string, index: number) => (
                                    <Avatar
                                      key={index}
                                      src={`/images/${img}`}
                                      sx={{ width: 40, height: 40 }}
                                    >
                                      <ImageIcon />
                                    </Avatar>
                                  ))}
                                {item.image.length > 2 && (
                                  <Avatar
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      bgcolor: "#f5f5f5",
                                      color: "#666",
                                    }}
                                  >
                                    +{item.image.length - 2}
                                  </Avatar>
                                )}
                              </Box>
                            ) : (
                              <Avatar
                                sx={{
                                  width: 40,
                                  height: 40,
                                  bgcolor: "#f5f5f5",
                                }}
                              >
                                <ImageIcon sx={{ color: "#999" }} />
                              </Avatar>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              {item.supplyName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              ID: {item.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getSupplyTypeText(item.supplyType)}
                            color={getSupplyTypeColor(item.supplyType) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: isLowStock ? "bold" : "normal",
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            {isLowStock && (
                              <WarningIcon
                                sx={{ color: "#ff9800", fontSize: 16 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {item.supplier}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(item.updatedAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenDialog(item)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                            title="Chỉnh sửa"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(item.id)}
                            color="error"
                            size="small"
                            title="Xóa"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Empty state */}
            {filteredData.length === 0 && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <InventoryIcon sx={{ fontSize: 64, color: "#bdbdbd", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Không có vật tư nào
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  {filterType === "all"
                    ? "Chưa có vật tư nào trong kho"
                    : `Không có vật tư loại "${getSupplyTypeText(
                        filterType as SupplyType
                      )}"`}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Thêm vật tư đầu tiên
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedItem ? "Chỉnh sửa vật tư" : "Thêm vật tư mới"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                label="Tên vật tư"
                value={formData.supplyName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, supplyName: e.target.value })
                }
                fullWidth
                required
                error={!formData.supplyName}
                helperText={
                  !formData.supplyName ? "Tên vật tư là bắt buộc" : ""
                }
              />

              <FormControl fullWidth required>
                <InputLabel>Loại vật tư</InputLabel>
                <Select
                  value={formData.supplyType ?? SupplyType.Medication}
                  onChange={(e) =>
                    setFormData({ ...formData, supplyType: e.target.value })
                  }
                  label="Loại vật tư"
                >
                  <MenuItem value={SupplyType.Medication}>Thuốc</MenuItem>
                  <MenuItem value={SupplyType.Equipment}>Thiết bị</MenuItem>
                  <MenuItem value={SupplyType.ConsumableSupply}>
                    Vật tư tiêu hao
                  </MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Số lượng"
                  type="number"
                  value={formData.quantity || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                  sx={{ flex: 2 }}
                  required
                  inputProps={{ min: 0 }}
                  error={formData.quantity < 0}
                  helperText={formData.quantity < 0 ? "Số lượng phải >= 0" : ""}
                />
                <TextField
                  label="Đơn vị"
                  value={formData.unit || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  sx={{ flex: 1 }}
                  required
                  error={!formData.unit}
                />
              </Box>

              <TextField
                label="Nhà cung cấp"
                value={formData.supplier || ""}
                onChange={(e) =>
                  setFormData({ ...formData, supplier: e.target.value })
                }
                fullWidth
              />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Hình ảnh (tùy chọn)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  fullWidth
                >
                  Chọn hình ảnh
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const fileNames = files.map((file) => file.name);
                      setFormData({ ...formData, image: fileNames });
                    }}
                  />
                </Button>
                {formData.image && formData.image.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Đã chọn {formData.image.length} ảnh:{" "}
                      {formData.image.join(", ")}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={
                !formData.supplyName || !formData.unit || formData.quantity < 0
              }
            >
              {selectedItem ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MedicalSupplierPage;
