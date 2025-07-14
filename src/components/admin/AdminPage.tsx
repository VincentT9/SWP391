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
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material";
import { useAuth } from "../auth/AuthContext";
import PageHeader from "../common/PageHeader";

// Interface cho User từ API - cập nhật theo response thực tế
interface User {
  id: string; // Đổi từ number sang string
  username: string;
  fullName: string | null; // Đổi từ name sang fullName
  phoneNumber: string | null; // Đổi từ phone sang phoneNumber
  address: string | null;
  email: string;
  userRole: number; // Đổi từ role sang userRole
  image: string | null; // Đổi từ avatar sang image
  isAuthenticated?: boolean;
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

  // Helper function để hiển thị tên role - cập nhật theo userRole number
  const getRoleDisplayName = (userRole: number) => {
    switch (userRole) {
      case 0:
        return "Quản trị viên";
      case 1:
        return "Phụ huynh";
      case 2:
        return "Y tá";
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
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${BASE_API}/api/User/get-all-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();


      // Xử lý data - có thể là array hoặc single object
      const usersData = Array.isArray(data) ? data : [data];
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      // setError("Không thể tải dữ liệu người dùng. Vui lòng thử lại.");
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

  const getUserRoleText = (userRole: number) => {
    switch (userRole) {
      case 0:
        return "Quản trị viên";
      case 1:
        return "Phụ huynh";
      case 2:
        return "Y tá";
      default:
        return "Không xác định";
    }
  };

  const getUserRoleColor = (userRole: number) => {
    switch (userRole) {
      case 0:
        return "error"; // Admin
      case 2:
        return "primary"; // Y tá
      case 1:
        return "default"; // Phụ huynh
      default:
        return "default";
    }
  };

  const handleOpenDialog = (userData?: User) => {
    setSelectedUser(userData || null);
    if (userData) {
      // Editing existing user - keep all fields
      setFormData({
        username: userData.username || "",
        fullName: userData.fullName || "",
        phoneNumber: userData.phoneNumber || "",
        address: userData.address || "",
        email: userData.email || "",
        userRole: userData.userRole,
        isActive: userData.isActive !== false,
      });
    } else {
      // Adding new user - only include username, password, email
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        userRole: 1, // Default is parent
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({});
  };

  // Modified handleSave function to use different API endpoints for create vs update
  const handleSave = async () => {
    try {

      const token = localStorage.getItem("authToken");

      // Make sure we don't allow changing to admin role (0)
      if (
        formData.userRole === 0 &&
        (!selectedUser || selectedUser.userRole !== 0)
      ) {
        toast.error("Không thể cấp quyền quản trị viên!");
        return;
      }

      // Validate passwords match when adding new user
      if (!selectedUser) {
        if (!formData.password) {
          toast.error("Mật khẩu không được để trống!");
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp!");
          return;
        }
      }

      // Use different endpoints for create vs update
      let url, method, requestData;

      if (selectedUser) {
        // UPDATE existing user
        url = `${BASE_API}/api/User/update-user/${selectedUser.id}`;
        method = "PUT";
        requestData = {
          id: selectedUser.id,
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          userRole: parseInt(formData.userRole),
          username: formData.username,
          isActive: true,
        };
      } else {
        // CREATE new user - using new User creation API
        url = `${BASE_API}/api/User`; // New endpoint for user creation
        method = "POST";
        requestData = {
          username: formData.username,
          password: formData.password,
          email: formData.email,
          fullName: formData.fullName || "",
          phoneNumber: formData.phoneNumber || "",
          address: formData.address || "",
          userRole: parseInt(formData.userRole),
          image: "", // Adding empty image field as required by the new API
        };
      }





      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error Response:", errorData);
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
        <PageHeader 
          title="Quản lý người dùng"
          subtitle="Quản lý tài khoản và phân quyền người dùng trong hệ thống"
          showRefresh={true}
          onRefresh={fetchUsers}
          actions={
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
            >
              Thêm người dùng
            </Button>
          }
        />

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
                  <TableRow sx={{ bgcolor: "rgba(41, 128, 185, 0.05)" }}>
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
                            sx={{ bgcolor: "#2980b9" }}
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
                label="Tên đăng nhập *"
                value={formData.username || ""}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                fullWidth
                required
                disabled={!!selectedUser} // Disable username field during update
              />

              {/* Add these fields for both new and existing users */}
              <TextField
                label="Họ và tên *"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
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

              <TextField
                label="Email *"
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                fullWidth
                required
                disabled={!!selectedUser} // Disable email field during update
              />

              {/* Add role selection for new users too */}
              <FormControl fullWidth required>
                <InputLabel>Vai trò *</InputLabel>
                <Select
                  value={formData.userRole || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, userRole: e.target.value })
                  }
                  label="Vai trò"
                >
                  {selectedUser?.userRole === 0 && (
                    <MenuItem value={0}>Quản trị viên</MenuItem>
                  )}
                  <MenuItem value={1}>Phụ huynh</MenuItem>
                  <MenuItem value={2}>Y tá</MenuItem>
                </Select>
              </FormControl>

              {/* Add Password fields only for new user creation */}
              {!selectedUser && (
                <>
                  <TextField
                    label="Mật khẩu *"
                    type="password"
                    value={formData.password || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    fullWidth
                    required
                  />
                  <TextField
                    label="Xác nhận mật khẩu *"
                    type="password"
                    value={formData.confirmPassword || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    fullWidth
                    required
                    error={
                      formData.password !== formData.confirmPassword &&
                      formData.confirmPassword !== ""
                    }
                    helperText={
                      formData.password !== formData.confirmPassword &&
                      formData.confirmPassword !== ""
                        ? "Mật khẩu xác nhận không khớp"
                        : ""
                    }
                  />
                </>
              )}

              {/* Keep existing alerts */}
              {selectedUser && selectedUser.userRole === 0 && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Không thể thay đổi vai trò của quản trị viên.
                </Alert>
              )}
              {selectedUser && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Tên đăng nhập và email không thể thay đổi sau khi tạo tài
                  khoản.
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
