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
  ArrowBackIos as ArrowBackIosIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";
import axios from "axios";
import instance from "../../utils/axiosConfig";
import { toast } from "react-toastify"; // Import toast

// SupplyType enum mapping
enum SupplyType {
  Medication = 0,
  Equipment = 1,
  ConsumableSupply = 2,
}

// Danh sách đơn vị
const UNIT_OPTIONS = [
  "viên", "hộp", "lọ", "túi", "chai", "ống", "gói", "vỉ", "kg", "gram", 
  "lít", "ml", "cái", "chiếc", "bộ", "đôi", "thùng", "lon", "tuýp", "miếng"
];

const MedicalSupplierPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [filterType, setFilterType] = useState<number | "all">("all");
  const [medicalSuppliers, setMedicalSuppliers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Thêm state cho detail dialog
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
      // setError("Không thể tải dữ liệu vật tư y tế. Vui lòng thử lại sau.");
      // toast.error("Không thể tải dữ liệu vật tư y tế");
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
      // toast.error("Không thể tải thông tin vật tư");
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
      toast.error("Không thể tạo vật tư mới");
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
      toast.error("Không thể cập nhật vật tư");
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
      toast.error("Không thể xóa vật tư");
      throw new Error("Không thể xóa vật tư");
    }
  };

  // Add image upload function
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5112/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const imageUrl = await response.text();
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Không thể tải lên hình ảnh');
      throw error;
    }
  };

  // Handle multiple image uploads
  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploadingImage(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} không phải là hình ảnh`);
          continue;
        }

        // Validate file size (e.g., max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} quá lớn (tối đa 5MB)`);
          continue;
        }

        const imageUrl = await uploadImage(file);
        uploadedUrls.push(imageUrl);
      }

      if (uploadedUrls.length > 0) {
        const currentImages = formData.image || [];
        setFormData({ 
          ...formData, 
          image: [...currentImages, ...uploadedUrls] 
        });
        toast.success(`Đã tải lên ${uploadedUrls.length} hình ảnh`);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Remove image from form data
  const handleRemoveImage = (indexToRemove: number) => {
    const currentImages = formData.image || [];
    const updatedImages = currentImages.filter((_item: string, index: number) => index !== indexToRemove);
    setFormData({ ...formData, image: updatedImages });
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
      setIsSaving(true);
      if (selectedItem) {
        await updateSupplier(selectedItem.id, formData);
        toast.success("Cập nhật vật tư thành công!");
      } else {
        await createSupplier(formData);
        toast.success("Thêm vật tư thành công!");
      }
      handleCloseDialog();
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving medical supplier:", error);
      // Error toast already handled in create/update functions
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Use a custom confirm dialog or MUI dialog instead of window.confirm
    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa vật tư này?");
    if (confirmed) {
      try {
        setIsLoading(true);
        await deleteSupplier(id);
        toast.success("Xóa vật tư thành công!");
        fetchSuppliers();
      } catch (error) {
        console.error("Error deleting medical supplier:", error);
        // Error toast already handled in deleteSupplier function
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Thêm function để handle click vào hình ảnh
  const handleImageClick = async (item: any) => {
    try {
      const supplierData = await fetchSupplierById(item.id);
      setSelectedDetailItem(supplierData);
      setSelectedImageIndex(0);
      setOpenDetailDialog(true);
    } catch (err) {
      console.error("Error fetching supplier details:", err);
    }
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedDetailItem(null);
    setSelectedImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedDetailItem?.image && selectedImageIndex < selectedDetailItem.image.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
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
            <InventoryIcon sx={{ fontSize: 40, color: "#2980b9", mr: 2 }} />
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#2980b9" }}
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
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: "rgba(41, 128, 185, 0.08)" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#2980b9", fontWeight: "bold" }}
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
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: "rgba(41, 128, 185, 0.08)" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#2980b9", fontWeight: "bold" }}
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
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: "rgba(41, 128, 185, 0.08)" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#2980b9", fontWeight: "bold" }}
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
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: "rgba(41, 128, 185, 0.08)" }}>
                  <CardContent sx={{ p: 2, textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      sx={{ color: "#2980b9", fontWeight: "bold" }}
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
                  <TableRow sx={{ bgcolor: "rgba(41, 128, 185, 0.05)" }}>
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
                                      src={img}
                                      sx={{ 
                                        width: 40, 
                                        height: 40,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                          transform: 'scale(1.1)'
                                        }
                                      }}
                                      onClick={() => handleImageClick(item)}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    >
                                      <ImageIcon />
                                    </Avatar>
                                  ))}
                                {item.image.length > 2 && (
                                  <Avatar
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      bgcolor: "rgba(41, 128, 185, 0.05)",
                                      color: "#666",
                                      cursor: 'pointer',
                                      transition: 'transform 0.2s',
                                      '&:hover': {
                                        transform: 'scale(1.1)'
                                      }
                                    }}
                                    onClick={() => handleImageClick(item)}
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
                                  bgcolor: "rgba(41, 128, 185, 0.05)",
                                  cursor: 'pointer',
                                }}
                                onClick={() => handleImageClick(item)}
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
                                sx={{ color: "#2980b9", fontSize: 16 }}
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
                <InventoryIcon sx={{ fontSize: 64, color: "#2980b9", mb: 2 }} />
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
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            {selectedItem ? "Chỉnh sửa vật tư" : "Thêm vật tư mới"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 3, pt: 2 }}>
              {/* Phần hình ảnh - Cột trái */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#2980b9', fontWeight: 'bold' }}>
                  Hình ảnh vật tư
                </Typography>
                
                {/* Upload Button */}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={
                    isUploadingImage ? (
                      <CircularProgress size={20} />
                    ) : (
                      <ImageIcon />
                    )
                  }
                  fullWidth
                  disabled={isUploadingImage}
                  sx={{ mb: 2, py: 1.5 }}
                >
                  {isUploadingImage ? "Đang tải lên..." : "Chọn và tải lên hình ảnh"}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(e.target.files);
                      }
                    }}
                  />
                </Button>

                {/* Display uploaded images */}
                {formData.image && formData.image.length > 0 ? (
                  <Box>
                    {/* Main image preview */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 300,
                        border: '2px solid #ddd',
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 2,
                        bgcolor: 'rgba(41, 128, 185, 0.05)'
                      }}
                    >
                      <img
                        src={formData.image[0]}
                        alt="Preview"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                      
                      {/* Remove button for main image */}
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(0)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Additional images thumbnails */}
                    {formData.image.length > 1 && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Hình ảnh khác ({formData.image.length - 1}):
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {formData.image.slice(1).map((imageUrl: string, index: number) => (
                            <Box
                              key={index + 1}
                              sx={{
                                position: 'relative',
                                width: 60,
                                height: 60,
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                overflow: 'hidden'
                              }}
                            >
                              <img
                                src={imageUrl}
                                alt={`Thumbnail ${index + 2}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover'
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveImage(index + 1)}
                                sx={{
                                  position: 'absolute',
                                  top: -2,
                                  right: -2,
                                  bgcolor: 'rgba(0,0,0,0.7)',
                                  color: 'white',
                                  width: 20,
                                  height: 20,
                                  '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' }
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 12 }} />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Đã tải lên {formData.image.length} hình ảnh
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 300,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(41, 128, 185, 0.05)',
                      borderRadius: 2,
                      border: '2px dashed #ddd'
                    }}
                  >
                    <Box sx={{ textAlign: 'center', color: '#999' }}>
                      <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                      <Typography variant="body2">
                        Chưa có hình ảnh
                      </Typography>
                      <Typography variant="caption">
                        Hãy chọn hình ảnh để tải lên
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Phần thông tin - Cột phải */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ p: 3, height: 'fit-content' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2980b9', fontWeight: 'bold' }}>
                    Thông tin vật tư
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                      variant="outlined"
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
                        <MenuItem value={SupplyType.Medication}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label="Thuốc" color="primary" size="small" />
                          </Box>
                        </MenuItem>
                        <MenuItem value={SupplyType.Equipment}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label="Thiết bị" color="secondary" size="small" />
                          </Box>
                        </MenuItem>
                        <MenuItem value={SupplyType.ConsumableSupply}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label="Vật tư tiêu hao" color="warning" size="small" />
                          </Box>
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
                        sx={{ flex: 1 }}
                        required
                        inputProps={{ min: 0 }}
                        error={formData.quantity < 0}
                        helperText={formData.quantity < 0 ? "Số lượng phải >= 0" : ""}
                        variant="outlined"
                      />
                      <FormControl sx={{ flex: 1 }} required>
                        <InputLabel>Đơn vị</InputLabel>
                        <Select
                          value={formData.unit || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, unit: e.target.value })
                          }
                          label="Đơn vị"
                          error={!formData.unit}
                        >
                          {UNIT_OPTIONS.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>

                    <TextField
                      label="Nhà cung cấp"
                      value={formData.supplier || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, supplier: e.target.value })
                      }
                      fullWidth
                      variant="outlined"
                      placeholder="Nhập tên nhà cung cấp (tùy chọn)"
                    />

                    {/* Preview thông tin */}
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(41, 128, 185, 0.05)', borderRadius: 1 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        📋 Xem trước thông tin:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="body2">
                          <strong>Tên:</strong> {formData.supplyName || "Chưa nhập"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Loại:</strong> {getSupplyTypeText(formData.supplyType ?? SupplyType.Medication)}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Số lượng:</strong> {formData.quantity || 0} {formData.unit || "đơn vị"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Nhà cung cấp:</strong> {formData.supplier || "Chưa cập nhật"}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Hình ảnh:</strong> {formData.image?.length || 0} ảnh
                        </Typography>
                      </Box>
                    </Box>

                    {/* Validation summary */}
                    {(!formData.supplyName || !formData.unit || formData.quantity < 0) && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          Vui lòng kiểm tra lại thông tin vật tư. Các trường có dấu
                          sao đỏ là bắt buộc.
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </Card>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={isSaving || isUploadingImage}>
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={
                !formData.supplyName || 
                !formData.unit || 
                formData.quantity < 0 || 
                isSaving || 
                isUploadingImage
              }
              startIcon={isSaving ? <CircularProgress size={20} /> : null}
            >
              {isSaving 
                ? "Đang lưu..." 
                : selectedItem 
                ? "Cập nhật" 
                : "Tạo mới"
              }
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detail Dialog với hình ảnh phóng to */}
        <Dialog
          open={openDetailDialog}
          onClose={handleCloseDetailDialog}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" component="div">
              Chi tiết vật tư: {selectedDetailItem?.supplyName}
            </Typography>
            <IconButton onClick={handleCloseDetailDialog}>
              <DeleteIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', gap: 3, pt: 2 }}>
              {/* Phần hình ảnh */}
              <Box sx={{ flex: 1 }}>
                {selectedDetailItem?.image && selectedDetailItem.image.length > 0 ? (
                  <Box>
                    {/* Hình ảnh chính */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: 400,
                        border: '2px solid #ddd',
                        borderRadius: 2,
                        overflow: 'hidden',
                        mb: 2
                      }}
                    >
                      <img
                        src={selectedDetailItem.image[selectedImageIndex]}
                        alt={`${selectedDetailItem.supplyName} - ${selectedImageIndex + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          backgroundColor: 'rgba(41, 128, 185, 0.05)'
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                      
                      {/* Navigation arrows */}
                      {selectedDetailItem.image.length > 1 && (
                        <>
                          <IconButton
                            onClick={handlePrevImage}
                            disabled={selectedImageIndex === 0}
                            sx={{
                              position: 'absolute',
                              left: 8,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                            }}
                          >
                            <ArrowBackIosIcon />
                          </IconButton>
                          <IconButton
                            onClick={handleNextImage}
                            disabled={selectedImageIndex === selectedDetailItem.image.length - 1}
                            sx={{
                              position: 'absolute',
                              right: 8,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: 'white',
                              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                            }}
                          >
                            <ArrowForwardIosIcon />
                          </IconButton>
                        </>
                      )}
                      
                      {/* Image counter */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.875rem'
                        }}
                      >
                        {selectedImageIndex + 1} / {selectedDetailItem.image.length}
                      </Box>
                    </Box>
                    
                    {/* Thumbnail navigation */}
                    {selectedDetailItem.image.length > 1 && (
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        {selectedDetailItem.image.map((img: string, index: number) => (
                          <Avatar
                            key={index}
                            src={img}
                            sx={{
                              width: 60,
                              height: 60,
                              cursor: 'pointer',
                              border: selectedImageIndex === index ? '3px solid #2980b9' : '2px solid #ddd',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)'
                              }
                            }}
                            onClick={() => setSelectedImageIndex(index)}
                          >
                            <ImageIcon />
                          </Avatar>
                        ))}
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'rgba(41, 128, 185, 0.05)',
                      borderRadius: 2,
                      border: '2px dashed #ddd'
                    }}
                  >
                    <Box sx={{ textAlign: 'center', color: '#999' }}>
                      <ImageIcon sx={{ fontSize: 64, mb: 1 }} />
                      <Typography>Chưa có hình ảnh</Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Phần thông tin chi tiết */}
              <Box sx={{ flex: 1 }}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2980b9', fontWeight: 'bold' }}>
                    Thông tin chi tiết
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Tên vật tư
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {selectedDetailItem?.supplyName}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Loại vật tư
                      </Typography>
                      <Chip
                        label={getSupplyTypeText(selectedDetailItem?.supplyType)}
                        color={getSupplyTypeColor(selectedDetailItem?.supplyType) as any}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Số lượng
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2980b9' }}>
                          {selectedDetailItem?.quantity}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Đơn vị
                        </Typography>
                        <Typography variant="body1">
                          {selectedDetailItem?.unit}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Nhà cung cấp
                      </Typography>
                      <Typography variant="body1">
                        {selectedDetailItem?.supplier || 'Chưa cập nhật'}
                      </Typography>
                    </Box>

                    {/* Kiểm tra tồn kho */}
                    {lowStockItems.some(low => low.id === selectedDetailItem?.id) && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="subtitle2">
                          ⚠️ Cảnh báo: Vật tư sắp hết hàng!
                        </Typography>
                      </Alert>
                    )}
                  </Box>
                </Card>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                handleCloseDetailDialog();
                handleOpenDialog(selectedDetailItem);
              }}
              variant="outlined"
              startIcon={<EditIcon />}
            >
              Chỉnh sửa
            </Button>
            <Button onClick={handleCloseDetailDialog}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MedicalSupplierPage;
