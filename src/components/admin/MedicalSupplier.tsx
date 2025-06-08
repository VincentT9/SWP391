import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Image as ImageIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext'; // Fix import path

// SupplyType enum mapping
enum SupplyType {
  Medication = 0,
  Equipment = 1,
  ConsumableSupply = 2
}


// Mock data theo MedicalSupplier entity
const mockMedicalSuppliers = [
  {
    id: 1,
    supplyName: 'Paracetamol 500mg',
    supplyType: SupplyType.Medication,
    unit: 'viên',
    quantity: 150,
    supplier: 'Công ty Dược A',
    image: ['paracetamol1.jpg', 'paracetamol2.jpg'],
    isDeleted: false,
    createdAt: '2024-01-15',
    updatedAt: '2024-05-20'
  },
  {
    id: 2,
    supplyName: 'Máy đo huyết áp điện tử',
    supplyType: SupplyType.Equipment,
    unit: 'cái',
    quantity: 3,
    supplier: 'Công ty Thiết bị Y tế ABC',
    image: ['blood_pressure_monitor.jpg'],
    isDeleted: false,
    createdAt: '2024-02-10',
    updatedAt: '2024-05-15'
  },
  {
    id: 3,
    supplyName: 'Băng gạc vô trùng',
    supplyType: SupplyType.ConsumableSupply,
    unit: 'cuộn',
    quantity: 200,
    supplier: 'Công ty Vật tư Y tế DEF',
    image: ['gauze1.jpg', 'gauze2.jpg'],
    isDeleted: false,
    createdAt: '2024-03-05',
    updatedAt: '2024-05-18'
  },
  {
    id: 4,
    supplyName: 'Amoxicillin 250mg',
    supplyType: SupplyType.Medication,
    unit: 'viên',
    quantity: 25,
    supplier: 'Công ty Dược B',
    image: ['amoxicillin.jpg'],
    isDeleted: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-05-22'
  },
  {
    id: 5,
    supplyName: 'Kim tiêm 5ml',
    supplyType: SupplyType.ConsumableSupply,
    unit: 'hộp',
    quantity: 15,
    supplier: 'Công ty Vật tư Y tế GHI',
    image: ['syringe.jpg'],
    isDeleted: false,
    createdAt: '2024-02-28',
    updatedAt: '2024-05-25'
  }
];

const MedicalSupplierPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth(); // Use AuthContext với user và loading
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [filterType, setFilterType] = useState<number | 'all'>('all');

  // Loading state while checking authentication
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
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
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6">Chưa đăng nhập</Typography>
            <Typography>Vui lòng đăng nhập để truy cập trang này.</Typography>
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
            startIcon={<LockIcon />}
          >
            Đăng nhập
          </Button>
        </Box>
      </Container>
    );
  }

  // Check admin permission (role === 'admin')
  if (user.role == 'Parent') {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Truy cập bị từ chối</Typography>
            <Typography>
              Bạn không có quyền truy cập trang quản lý vật tư y tế. 
              Chỉ quản trị viên mới có thể truy cập trang này.
            </Typography>
          </Alert>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              Về trang chủ
            </Button>
            <Button 
              variant="contained" 
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  // Helper function để hiển thị tên role
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'nurse': return 'Y tá';
      case 'parent': return 'Phụ huynh';
      case 'student': return 'Học sinh';
      default: return 'Không xác định';
    }
  };

  const getSupplyTypeText = (type: SupplyType) => {
    switch (type) {
      case SupplyType.Medication: return 'Thuốc';
      case SupplyType.Equipment: return 'Thiết bị';
      case SupplyType.ConsumableSupply: return 'Vật tư tiêu hao';
      default: return 'Không xác định';
    }
  };

  const getSupplyTypeColor = (type: SupplyType) => {
    switch (type) {
      case SupplyType.Medication: return 'primary';
      case SupplyType.Equipment: return 'secondary';
      case SupplyType.ConsumableSupply: return 'warning';
      default: return 'default';
    }
  };

  const getFilteredData = () => {
    if (filterType === 'all') {
      return mockMedicalSuppliers.filter(item => !item.isDeleted);
    }
    return mockMedicalSuppliers.filter(item => 
      !item.isDeleted && item.supplyType === filterType
    );
  };

  const getLowStockItems = () => {
    return mockMedicalSuppliers.filter(item => {
      if (item.isDeleted) return false;
      switch (item.supplyType) {
        case SupplyType.Medication: return item.quantity < 50;
        case SupplyType.Equipment: return item.quantity < 2;
        case SupplyType.ConsumableSupply: return item.quantity < 30;
        default: return false;
      }
    });
  };

  const handleOpenDialog = (item?: any) => {
    setSelectedItem(item);
    setFormData(item || {
      supplyName: '',
      supplyType: SupplyType.Medication,
      unit: '',
      quantity: 0,
      supplier: '',
      image: []
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      console.log('Saving medical supplier:', formData);
      // TODO: Call API to save/update medical supplier
      // const response = await apiRequest('/medical-suppliers', {
      //   method: selectedItem ? 'PUT' : 'POST',
      //   body: JSON.stringify(formData)
      // });
      
      // Show success message
      alert(selectedItem ? 'Cập nhật vật tư thành công!' : 'Thêm vật tư thành công!');
      handleCloseDialog();
      
      // TODO: Refresh data from API
    } catch (error) {
      console.error('Error saving medical supplier:', error);
      alert('Có lỗi xảy ra khi lưu vật tư!');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa vật tư này?')) {
      try {
        console.log('Deleting medical supplier:', id);
        // TODO: Call API to soft delete medical supplier
        // await apiRequest(`/medical-suppliers/${id}`, {
        //   method: 'DELETE'
        // });
        
        alert('Xóa vật tư thành công!');
        // TODO: Refresh data from API
      } catch (error) {
        console.error('Error deleting medical supplier:', error);
        alert('Có lỗi xảy ra khi xóa vật tư!');
      }
    }
  };

  const lowStockItems = getLowStockItems();
  const filteredData = getFilteredData();

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        {/* Header with user info */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <InventoryIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
            <Box>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                Quản lý vật tư y tế
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quản lý thuốc, thiết bị và vật tư tiêu hao trong kho
              </Typography>
            </Box>
          </Box>
          
          {/* User info với AuthContext data */}
          <Card sx={{ minWidth: 250 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={user.avatar} 
                  sx={{ width: 40, height: 40, bgcolor: '#1976d2' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Đăng nhập với tư cách
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{user.username}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={getRoleDisplayName(user.role)}
                color="error" 
                size="small" 
                sx={{ mt: 1, width: '100%' }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Alert cho low stock */}
        {lowStockItems.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6">Cảnh báo tồn kho</Typography>
            <Typography>
              Có {lowStockItems.length} vật tư sắp hết hàng. Vui lòng kiểm tra và bổ sung kịp thời.
            </Typography>
          </Alert>
        )}

        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            {/* Header with filters and add button */}
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
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
                    <MenuItem value={SupplyType.ConsumableSupply}>Vật tư tiêu hao</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
              >
                Thêm vật tư
              </Button>
            </Box>

            {/* Statistics row */}
            <Box sx={{ px: 3, pb: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: '#e3f2fd' }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      {mockMedicalSuppliers.filter(i => i.supplyType === SupplyType.Medication && !i.isDeleted).length}
                    </Typography>
                    <Typography variant="body2">Loại thuốc</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: '#f3e5f5' }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#7b1fa2', fontWeight: 'bold' }}>
                      {mockMedicalSuppliers.filter(i => i.supplyType === SupplyType.Equipment && !i.isDeleted).length}
                    </Typography>
                    <Typography variant="body2">Thiết bị</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: '#fff3e0' }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#f57c00', fontWeight: 'bold' }}>
                      {mockMedicalSuppliers.filter(i => i.supplyType === SupplyType.ConsumableSupply && !i.isDeleted).length}
                    </Typography>
                    <Typography variant="body2">Vật tư tiêu hao</Typography>
                  </CardContent>
                </Card>
                <Card sx={{ flex: 1, minWidth: 200, bgcolor: '#ffebee' }}>
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
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
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Hình ảnh</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tên vật tư</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Loại</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Đơn vị</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Nhà cung cấp</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Cập nhật cuối</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((item) => {
                    const isLowStock = lowStockItems.some(low => low.id === item.id);
                    
                    return (
                      <TableRow key={item.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {item.image && item.image.length > 0 ? (
                              <Box sx={{ display: 'flex', gap: 0.5 }}>
                                {item.image.slice(0, 2).map((img, index) => (
                                  <Avatar
                                    key={index}
                                    src={`/images/${img}`}
                                    sx={{ width: 40, height: 40 }}
                                  >
                                    <ImageIcon />
                                  </Avatar>
                                ))}
                                {item.image.length > 2 && (
                                  <Avatar sx={{ width: 40, height: 40, bgcolor: '#f5f5f5', color: '#666' }}>
                                    +{item.image.length - 2}
                                  </Avatar>
                                )}
                              </Box>
                            ) : (
                              <Avatar sx={{ width: 40, height: 40, bgcolor: '#f5f5f5' }}>
                                <ImageIcon sx={{ color: '#999' }} />
                              </Avatar>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {item.supplyName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
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
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ fontWeight: isLowStock ? 'bold' : 'normal' }}>
                              {item.quantity}
                            </Typography>
                            {isLowStock && (
                              <WarningIcon sx={{ color: '#ff9800', fontSize: 16 }} />
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
                            {new Date(item.updatedAt).toLocaleDateString('vi-VN')}
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
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <InventoryIcon sx={{ fontSize: 64, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Không có vật tư nào
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {filterType === 'all' 
                    ? 'Chưa có vật tư nào trong kho' 
                    : `Không có vật tư loại "${getSupplyTypeText(filterType as SupplyType)}"`
                  }
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
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedItem ? 'Chỉnh sửa vật tư' : 'Thêm vật tư mới'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Tên vật tư"
                value={formData.supplyName || ''}
                onChange={(e) => setFormData({ ...formData, supplyName: e.target.value })}
                fullWidth
                required
                error={!formData.supplyName}
                helperText={!formData.supplyName ? 'Tên vật tư là bắt buộc' : ''}
              />
              
              <FormControl fullWidth required>
                <InputLabel>Loại vật tư</InputLabel>
                <Select
                  value={formData.supplyType ?? SupplyType.Medication}
                  onChange={(e) => setFormData({ ...formData, supplyType: e.target.value })}
                  label="Loại vật tư"
                >
                  <MenuItem value={SupplyType.Medication}>Thuốc</MenuItem>
                  <MenuItem value={SupplyType.Equipment}>Thiết bị</MenuItem>
                  <MenuItem value={SupplyType.ConsumableSupply}>Vật tư tiêu hao</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Số lượng"
                  type="number"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  sx={{ flex: 2 }}
                  required
                  inputProps={{ min: 0 }}
                  error={formData.quantity < 0}
                  helperText={formData.quantity < 0 ? 'Số lượng phải >= 0' : ''}
                />
                <TextField
                  label="Đơn vị"
                  value={formData.unit || ''}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  sx={{ flex: 1 }}
                  required
                  error={!formData.unit}
                />
              </Box>

              <TextField
                label="Nhà cung cấp"
                value={formData.supplier || ''}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
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
                      const fileNames = files.map(file => file.name);
                      setFormData({ ...formData, image: fileNames });
                    }}
                  />
                </Button>
                {formData.image && formData.image.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Đã chọn {formData.image.length} ảnh: {formData.image.join(', ')}
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
              disabled={!formData.supplyName || !formData.unit || formData.quantity < 0}
            >
              {selectedItem ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default MedicalSupplierPage;