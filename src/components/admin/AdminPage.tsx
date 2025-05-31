import React, { useState, useEffect } from 'react';
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
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

// Mock data theo User entity
const mockUsers = [
  { 
    id: 1, 
    username: 'admin1', 
    fullName: 'Nguyễn Văn Admin',
    email: 'admin1@school.com', 
    phoneNumber: '0123456789',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    userRole: 0, // Admin
    image: null,
    isDeleted: false
  },
  { 
    id: 2, 
    username: 'teacher1', 
    fullName: 'Trần Thị Giáo Viên',
    email: 'teacher1@school.com', 
    phoneNumber: '0987654321',
    address: '456 Đường XYZ, Quận 2, TP.HCM',
    userRole: 1, // Teacher
    image: null,
    isDeleted: false
  },
  { 
    id: 3, 
    username: 'parent1', 
    fullName: 'Lê Văn Phụ Huynh',
    email: 'parent1@school.com', 
    phoneNumber: '0555666777',
    address: '789 Đường DEF, Quận 3, TP.HCM',
    userRole: 2, // Parent
    image: null,
    isDeleted: true
  },
];

const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState({ userRole: 0 }); // Mock admin user
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  // Check admin permission
  useEffect(() => {
    if (currentUser.userRole !== 0) { // UserRole.Admin = 0
      alert('Bạn không có quyền truy cập trang này!');
      return;
    }
  }, [currentUser]);

  // Don't render if not admin
  if (currentUser.userRole !== 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Truy cập bị từ chối</Typography>
            <Typography>Bạn không có quyền truy cập trang quản trị này.</Typography>
          </Alert>
          <Button variant="contained" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </Box>
      </Container>
    );
  }

  const getUserRoleText = (role: number) => {
    switch (role) {
      case 0: return 'Quản trị viên';
      case 1: return 'Giáo viên';
      case 2: return 'Phụ huynh';
      default: return 'Không xác định';
    }
  };

  const getUserRoleColor = (role: number) => {
    switch (role) {
      case 0: return 'error';
      case 1: return 'primary';
      case 2: return 'default';
      default: return 'default';
    }
  };

  const handleOpenDialog = (user?: any) => {
    setSelectedUser(user);
    setFormData(user || {
      username: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      address: '',
      userRole: 2,
      isDeleted: false
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleSave = () => {
    console.log('Saving user:', formData);
    // Handle save logic here
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      console.log('Deleting user:', id);
      // Handle delete logic here
    }
  };

  const handleToggleStatus = (id: number) => {
    console.log('Toggling user status:', id);
    // Handle toggle active/inactive
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <SecurityIcon sx={{ fontSize: 40, color: '#1976d2', mr: 2 }} />
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              Quản lý người dùng
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý tài khoản và phân quyền người dùng trong hệ thống
            </Typography>
          </Box>
        </Box>

        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Danh sách người dùng ({mockUsers.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
              >
                Thêm người dùng
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Avatar</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tên đăng nhập</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Họ tên</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Avatar sx={{ bgcolor: '#1976d2' }}>
                          {user.fullName.charAt(0)}
                        </Avatar>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>{user.username}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>
                        <Chip
                          label={getUserRoleText(user.userRole)}
                          color={getUserRoleColor(user.userRole) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.isDeleted ? 'Vô hiệu' : 'Hoạt động'}
                          color={user.isDeleted ? 'default' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleOpenDialog(user)}
                          color="primary"
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleToggleStatus(user.id)}
                          color={user.isDeleted ? 'success' : 'warning'}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          {user.isDeleted ? '✓' : '⏸'}
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(user.id)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog for Add/Edit User */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
              <TextField
                label="Tên đăng nhập"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Họ và tên"
                value={formData.fullName || ''}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Số điện thoại"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                multiline
                rows={2}
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={formData.userRole || 2}
                  onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                  label="Vai trò"
                >
                  <MenuItem value={0}>Quản trị viên</MenuItem>
                  <MenuItem value={1}>Giáo viên</MenuItem>
                  <MenuItem value={2}>Phụ huynh</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleSave} variant="contained">
              {selectedUser ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminPage;