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

// Interface cho User từ API - cập nhật theo response thực tế
interface User {
  id: string; // Đổi từ number sang string
  username: string;
  name: string;
  phone?: string;
  address?: string;
  role: string;
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
    userId: null as string | null, // Đổi từ number sang string
  });

  // Helper function để hiển thị tên role
  const getRoleDisplayName = (role: string) => {
    switch (role?.toLowerCase()) {
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

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://my.api.mockaroo.com/account.json?key=c12b5dc0&__method=POST",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm token vào header
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
    } finally {
      setLoading(false);
    }
  };

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

  const getUserRoleText = (role: string) => {
    switch (role?.toLowerCase()) {
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

  const getUserRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "error";
      case "nurse":
        return "primary";
      case "parent":
        return "default";
      case "student":
        return "secondary";
      default:
        return "default";
    }
  };

  const handleOpenDialog = (userData?: User) => {
    setSelectedUser(userData || null);
    setFormData(
      userData || {
        username: "",
        fullName: "",
        phoneNumber: "",
        address: "",
        email: "",
        userRole: 1, // Default là phụ huynh
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
      const token = localStorage.getItem("authToken");

      const url = selectedUser
        ? `${BASE_API}/api/User/update-user/${selectedUser.id}`
        : `${BASE_API}/api/User/create-user`;

      const method = selectedUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: formData.username,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          email: formData.email,
          userRole: parseInt(formData.userRole),
          ...(selectedUser && { id: selectedUser.id }),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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

  const handleDeleteClick = (id: string) => {
    setConfirmDialog({
      open: true,
      userId: id,
    });
  };

  const handleConfirmDelete = async () => {
    if (confirmDialog.userId) {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `${BASE_API}/api/User/delete-user/${confirmDialog.userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

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
    return userData.userRole !== 0; // userRole 0 là admin
  };

  // Fix lỗi 1: user.role là string, cần convert sang number hoặc tạo function mapping
  const mapUserRoleToNumber = (role: string): number => {
    switch (role?.toLowerCase()) {
      case "admin":
        return 0;
      case "parent":
        return 1;
      case "medicalstaff":
        return 2;
      default:
        return 1; // Default là parent
    }
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
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
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
                        colSpan={8}
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
                        colSpan={8}
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
                            src={userData.image || undefined}
                            sx={{ bgcolor: "#1976d2" }}
                          >
                            {userData.fullName?.charAt(0) ||
                              userData.username?.charAt(0) ||
                              "?"}
                          </Avatar>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {userData.username}
                        </TableCell>
                        <TableCell>{userData.fullName || "Chưa có"}</TableCell>
                        <TableCell>{userData.email || "Chưa có"}</TableCell>
                        <TableCell>
                          {userData.phoneNumber || "Chưa có"}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getUserRoleText(userData.userRole)}
                            color={getUserRoleColor(userData.userRole) as any}
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
                            disabled={userData.userRole === 0} // Không cho xóa admin
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
                disabled={selectedUser?.userRole === 0} // Không cho sửa username admin
              />
              <TextField
                label="Họ và tên"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                fullWidth
                required
              />
              <TextField
                label="Số điện thoại"
                value={formData.phoneNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
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
                  value={formData.userRole || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, userRole: e.target.value })
                  }
                  label="Vai trò"
                >
                  <MenuItem value={0}>Quản trị viên</MenuItem>
                  <MenuItem value={1}>Phụ huynh</MenuItem>
                  <MenuItem value={2}>Y tá</MenuItem>
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
