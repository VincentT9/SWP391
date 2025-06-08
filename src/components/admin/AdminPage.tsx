import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  // Paper,
  IconButton,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";

// Interface cho User từ API
interface User {
  id: number;
  username: string;
  name: string;
  phone?: string;
  address?: string;
  role: any;
  avatar?: string;
  isAuthenticated: boolean;
  isActive?: boolean;
}

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState<string>("");

  // Thêm state để quản lý dialog xác nhận
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    userId: null as number | null,
  });

  // Helper function để hiển thị tên role
  const getRoleDisplayName = (role: any) => {
    switch (role) {
      case 0:
        return "Quản trị viên";
      case 2:
        return "Y tá";
      case 1:
        return "Phụ huynh";
      default:
        return "Không xác định";
    }
  };

  const BASE_API = process.env.REACT_APP_BASE_URL;
  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${BASE_API}/api/User/get-all-users`, // Sử dụng BASE_API từ .env
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      // Xử lý data - có thể là array hoặc single object
      const usersData = Array.isArray(data) ? data : [data];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Không thể tải dữ liệu người dùng. Vui lòng thử lại.");
      // Fallback to mock data for demo
    } finally {
      setLoading(false);
    }
  };

  // useEffect phải được gọi ở top level - TRƯỚC các early returns
  useEffect(() => {
    // Chỉ fetch khi user đã được authenticate và là admin
    if (user && user.isAuthenticated && user.role?.toLowerCase() === "admin") {
      fetchUsers();
    }
  }, [user]);

  // Loading state while checking authentication
  if (authLoading) {
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

  // Check if user is authenticated
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

  // Check admin permission - REAL CHECK
  if (user.role?.toLowerCase() !== "admin") {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert
            severity="error"
            sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "center" }}
          >
            <Typography variant="h6">Truy cập bị từ chối</Typography>
            <Typography>
              Bạn không có quyền truy cập trang quản trị này. Chỉ quản trị viên
              mới có thể truy cập.
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

  const getUserRoleText = (role: any) => {
    switch (role) {
      case 0:
        return "Quản trị viên";
      case 2:
        return "Y tá";
      case 1:
        return "Phụ huynh";
      default:
        return "Không xác định";
    }
  };

  const getUserRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "error";
      case "nurse":
        return "primary";
      case "parent":
        return "default";
      default:
        return "default";
    }
  };

  const handleOpenDialog = (userData?: User) => {
    setSelectedUser(userData || null);
    setFormData(
      userData || {
        username: "",
        name: "",
        phone: "",
        address: "",
        role: "parent",
        isActive: true,
      }
    );
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      console.log("Saving user:", formData);
      // TODO: Call API to save/update user
      toast.success(
        selectedUser
          ? "Cập nhật người dùng thành công!"
          : "Thêm người dùng thành công!"
      );
      handleCloseDialog();
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Có lỗi xảy ra khi lưu người dùng!");
    }
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDialog({
      open: true,
      userId: id,
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.userId) {
      try {
        console.log("Deleting user:", confirmDialog.userId);
        // Gọi API xóa ở đây
        toast.success("Xóa người dùng thành công!");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Có lỗi xảy ra khi xóa người dùng!");
      } finally {
        setConfirmDialog({ open: false, userId: null });
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDialog({ open: false, userId: null });
  };

  // Check if user can edit role (admin cannot edit other admin's role)
  const canEditRole = (userData: User): boolean => {
    return userData.role?.toLowerCase() !== "admin";
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Header with current user info */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <SecurityIcon sx={{ fontSize: 40, color: "#1976d2", mr: 2 }} />
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                Quản lý người dùng
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quản lý tài khoản và phân quyền người dùng trong hệ thống
              </Typography>
            </Box>
          </Box>

          {/* Current user info */}
          <Card sx={{ minWidth: 250 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                  src={user.avatar}
                  sx={{ width: 40, height: 40, bgcolor: "#1976d2" }}
                >
                  {user.name?.charAt(0) || user.username?.charAt(0) || "?"}
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Đăng nhập với tư cách
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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
                sx={{ mt: 1, width: "100%" }}
              />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchUsers}
            disabled={loading}
          >
            Làm mới
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Danh sách người dùng ({users.length})
                {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#45a049" } }}
                disabled={loading}
              >
                Thêm người dùng
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Avatar</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Tên đăng nhập
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Họ tên</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Số điện thoại
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Vai trò</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Trạng thái
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Đang tải dữ liệu...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        sx={{ textAlign: "center", py: 4 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Không có dữ liệu người dùng
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((userData) => (
                      <TableRow key={userData.id} hover>
                        <TableCell>
                          <Avatar
                            src={userData.avatar}
                            sx={{ bgcolor: "#1976d2" }}
                          >
                            {userData.name?.charAt(0) ||
                              userData.username?.charAt(0) ||
                              "?"}
                          </Avatar>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {userData.username}
                        </TableCell>
                        <TableCell>{userData.name}</TableCell>
                        <TableCell>{userData.phone || "Chưa có"}</TableCell>
                        <TableCell>
                          <Chip
                            label={getUserRoleText(userData.role)}
                            color={getUserRoleColor(userData.role) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              userData.isActive !== false
                                ? "Hoạt động"
                                : "Vô hiệu"
                            }
                            color={
                              userData.isActive !== false
                                ? "success"
                                : "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenDialog(userData)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                            title="Chỉnh sửa"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(userData.id)}
                            color="error"
                            size="small"
                            title="Xóa"
                            disabled={userData.role?.toLowerCase() === "admin"}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog for Add/Edit User */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                label="Tên đăng nhập"
                value={formData.username || ""}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                fullWidth
                required
                disabled={selectedUser?.role?.toLowerCase() === "admin"}
              />
              <TextField
                label="Họ và tên"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Số điện thoại"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Địa chỉ"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                multiline
                rows={2}
                fullWidth
              />
              <FormControl
                fullWidth
                required
                disabled={selectedUser ? !canEditRole(selectedUser) : false}
              >
                <InputLabel>Vai trò</InputLabel>
                <Select
                  value={formData.role || "parent"}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  label="Vai trò"
                >
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                  <MenuItem value="nurse">Y tá</MenuItem>
                  <MenuItem value="parent">Phụ huynh</MenuItem>
                  <MenuItem value="student">Học sinh</MenuItem>
                </Select>
              </FormControl>
              {selectedUser && !canEditRole(selectedUser) && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Không thể thay đổi vai trò của quản trị viên khác.
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleSave} variant="contained">
              {selectedUser ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirm Delete Dialog */}
        <Dialog
          open={confirmDialog.open}
          onClose={handleCancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>Bạn có chắc chắn muốn xóa người dùng này?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Hủy</Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminPage;
