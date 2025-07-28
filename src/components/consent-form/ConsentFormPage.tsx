import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  Typography,
  Paper,
  Divider,
  Chip,
  Avatar,
  Stack,
  Card,
  CardContent,
  Badge,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  Container,
  Grid,
  Fade,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Person,
  EventNote,
  Info,
  Assignment,
  TrendingUp,
  Schedule,
  School,
  Refresh,
} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConsentForm } from "../../models/types";
import {
  getConsentFormsByStudentId,
  getConsentFormsByCampaign,
  getConsentFormsByParentId,
  updateConsentForm,
  getAllConsentForms,
  deleteConsentForm,
} from "./index";
import ConsentFormTicket from "./ConsentFormTicket";
import { useAuth } from "../auth/AuthContext";

interface ConsentFormPageProps {
  mode: "parent" | "admin";
  studentId?: string;
  parentId?: string;
  campaignId?: string;
  scheduleId?: string;
}

const ConsentFormPage: React.FC<ConsentFormPageProps> = ({
  mode,
  studentId,
  parentId,
  campaignId,
  scheduleId,
}) => {
  const [consentForms, setConsentForms] = useState<ConsentForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<ConsentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { user } = useAuth();

  const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      if (!loading) {
        setRefreshing(true);
      }

      let data: ConsentForm[] = [];
      if (mode === "parent") {
        const effectiveParentId = parentId || user?.id;
        if (effectiveParentId) {
          data = await getConsentFormsByParentId(effectiveParentId);
        } else if (studentId) {
          data = await getConsentFormsByStudentId(studentId);
        }
      } else if (mode === "admin" && campaignId) {
        data = await getConsentFormsByCampaign(campaignId);
      } else if (mode === "admin") {
        data = await getAllConsentForms();
      }

      if (selectedForm) {
        const updatedSelectedForm = data.find(
          (form) => form.id === selectedForm.id
        );
        if (
          updatedSelectedForm &&
          JSON.stringify(updatedSelectedForm) !== JSON.stringify(selectedForm)
        ) {
          setSelectedForm(updatedSelectedForm);
        }
      }

      setConsentForms(data);
      if (!loading) {
        setRefreshing(false);
      }
      return true;
    } catch (error) {
      console.error("Error fetching consent forms:", error);
      if (!loading) {
        setRefreshing(false);
      }
      return false;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchData();
      setLoading(false);
    };
    loadData();

    if (mode === "admin") {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = setInterval(() => {
        fetchData();
      }, 30000);
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [mode, studentId, parentId, campaignId, scheduleId, user?.id]);

  const handleManualRefresh = () => {
    if (!refreshing) {
      fetchData();
    }
  };

  const handleSubmit = async (payload: {
    campaignId: string;
    studentId: string;
    isApproved: boolean;
    consentDate: string;
    reasonForDecline: string;
  }) => {
    if (!selectedForm) return;
    try {
      const updatedPayload = {
        ...payload,
        updatedBy: user?.id || "current-user",
      };

      await updateConsentForm(selectedForm.id, updatedPayload);

      const updatedForm = {
        ...selectedForm,
        isApproved: payload.isApproved,
        consentDate: new Date(payload.consentDate),
        reasonForDecline: payload.reasonForDecline,
        updatedBy: user?.id || "current-user",
      };

      setConsentForms((prevForms) =>
        prevForms.map((form) =>
          form.id === selectedForm.id ? updatedForm : form
        )
      );

      setSelectedForm(updatedForm);

      if (mode === "admin") {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating consent form:", error);
    }
  };

  const handleDelete = async (formId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa phiếu đồng ý này?")) return;
    try {
      await deleteConsentForm(formId);
      setConsentForms((forms) => forms.filter((f) => f.id !== formId));
      if (selectedForm?.id === formId) setSelectedForm(null);
    } catch (error) {
      alert("Xóa phiếu đồng ý thất bại!");
      console.error(error);
    }
  };

  const getStatusIcon = (isApproved?: boolean, updatedBy?: string | null) => {
    if (!updatedBy) return <HourglassEmpty sx={{ fontSize: 20 }} />;
    if (isApproved === true) return <CheckCircle sx={{ fontSize: 20 }} />;
    if (isApproved === false) return <Cancel sx={{ fontSize: 20 }} />;
    return <HourglassEmpty sx={{ fontSize: 20 }} />;
  };

  const getStatusColor = (
    isApproved?: boolean,
    updatedBy?: string | null
  ): "default" | "success" | "error" | "warning" => {
    if (!updatedBy) return "warning";
    if (isApproved === true) return "success";
    if (isApproved === false) return "error";
    return "warning";
  };

  const getStatusText = (isApproved?: boolean, updatedBy?: string | null) => {
    if (!updatedBy) return "Đang xem xét";
    if (isApproved === true) return "Đã đồng ý";
    if (isApproved === false) return "Đã từ chối";
    return "Đang xem xét";
  };

  const getStats = () => {
    const total = consentForms.length;
    const approved = consentForms.filter(
      (f) => f.updatedBy && f.isApproved === true
    ).length;
    const rejected = consentForms.filter(
      (f) => f.updatedBy && f.isApproved === false
    ).length;
    const pending = consentForms.filter((f) => !f.updatedBy).length;
    return { total, approved, rejected, pending };
  };

  const filteredForms = consentForms.filter((form) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "approved")
      return form.updatedBy && form.isApproved === true;
    if (statusFilter === "rejected")
      return form.updatedBy && form.isApproved === false;
    if (statusFilter === "pending") return !form.updatedBy;
    return true;
  });

  const stats = getStats();

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={400} height={60} />
          <Skeleton variant="text" width={600} height={30} />
        </Box>

        <Stack direction="row" spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Box key={item} sx={{ flex: 1, minWidth: 200 }}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Box>
          ))}
        </Stack>

        <LinearProgress sx={{ borderRadius: 1, height: 6 }} />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Fade in timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 56,
                height: 56,
                boxShadow: 3,
              }}
            >
              <Assignment sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography
                variant="h3"
                fontWeight="700"
                sx={{
                  background:
                    "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                {mode === "parent"
                  ? "Phiếu Đồng Ý Tiêm Chủng"
                  : "Quản Lý Phiếu Đồng Ý"}
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight="400">
                {mode === "parent"
                  ? "Theo dõi và xử lý các phiếu đồng ý cho con em"
                  : "Quản lý toàn bộ phiếu đồng ý trong hệ thống"}
              </Typography>
            </Box>
            {mode === "admin" && (
              <Box sx={{ display: "flex", alignItems: "center", ml: "auto" }}>
                {refreshing ? (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Đang cập nhật...
                    </Typography>
                  </Box>
                ) : (
                  <Tooltip title="Làm mới dữ liệu">
                    <IconButton
                      onClick={handleManualRefresh}
                      color="primary"
                      size="large"
                      sx={{
                        "&:hover": {
                          transform: "rotate(180deg)",
                          transition: "transform 0.5s",
                        },
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}
          </Stack>
        </Box>
      </Fade>

      {/* Statistics Cards - Enhanced Design */}
      {mode === "admin" && (
        <Fade in timeout={1000}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            sx={{ mb: 4, flexWrap: "wrap" }}
          >
            <Card
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                minWidth: 250,
                flex: 1,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "60px",
                  height: "60px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  transform: "translate(20px, -20px)",
                },
              }}
            >
              <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Tổng số phiếu
                    </Typography>
                  </Box>
                  <EventNote sx={{ fontSize: 40, opacity: 0.8 }} />
                </Stack>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <TrendingUp sx={{ fontSize: 16, mr: 1 }} />
                  <Typography variant="caption">Tất cả phiếu đồng ý</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                minWidth: 250,
                flex: 1,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "60px",
                  height: "60px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  transform: "translate(20px, -20px)",
                },
              }}
            >
              <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                      {stats.approved}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Đã đồng ý
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
                </Stack>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Typography variant="caption">
                    {stats.total > 0
                      ? Math.round((stats.approved / stats.total) * 100)
                      : 0}
                    % tỷ lệ chấp nhận
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                minWidth: 250,
                flex: 1,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "60px",
                  height: "60px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  transform: "translate(20px, -20px)",
                },
              }}
            >
              <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                      {stats.pending}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Chờ xử lý
                    </Typography>
                  </Box>
                  <Schedule sx={{ fontSize: 40, opacity: 0.8 }} />
                </Stack>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Typography variant="caption">Cần xem xét ngay</Typography>
                </Box>
              </CardContent>
            </Card>

            <Card
              sx={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                color: "white",
                minWidth: 250,
                flex: 1,
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "60px",
                  height: "60px",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  transform: "translate(20px, -20px)",
                },
              }}
            >
              <CardContent sx={{ p: 3, position: "relative", zIndex: 1 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h3" fontWeight="700" sx={{ mb: 1 }}>
                      {stats.rejected}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Đã từ chối
                    </Typography>
                  </Box>
                  <Cancel sx={{ fontSize: 40, opacity: 0.8 }} />
                </Stack>
                <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                  <Typography variant="caption">
                    {stats.total > 0
                      ? Math.round((stats.rejected / stats.total) * 100)
                      : 0}
                    % tỷ lệ từ chối
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Fade>
      )}

      {/* Main Content */}
      <Fade in timeout={1200}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Left Panel - List */}
          <Box sx={{ width: { xs: "100%", lg: "420px" }, flexShrink: 0 }}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                height: { xs: "auto", lg: "calc(100vh - 400px)" },
                minHeight: { xs: 400, lg: 600 },
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              }}
            >
              {/* Filter Section */}
              <Box
                sx={{
                  p: 3,
                  bgcolor: "grey.50",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="600"
                  color="text.primary"
                >
                  Bộ lọc trạng thái
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={`Tất cả (${consentForms.length})`}
                    color={statusFilter === "all" ? "primary" : "default"}
                    onClick={() => setStatusFilter("all")}
                    variant={statusFilter === "all" ? "filled" : "outlined"}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<CheckCircle />}
                    label={`Đã đồng ý (${stats.approved})`}
                    color={statusFilter === "approved" ? "success" : "default"}
                    onClick={() => setStatusFilter("approved")}
                    variant={
                      statusFilter === "approved" ? "filled" : "outlined"
                    }
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<HourglassEmpty />}
                    label={`Chờ xử lý (${stats.pending})`}
                    color={statusFilter === "pending" ? "warning" : "default"}
                    onClick={() => setStatusFilter("pending")}
                    variant={statusFilter === "pending" ? "filled" : "outlined"}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    icon={<Cancel />}
                    label={`Đã từ chối (${stats.rejected})`}
                    color={statusFilter === "rejected" ? "error" : "default"}
                    onClick={() => setStatusFilter("rejected")}
                    variant={
                      statusFilter === "rejected" ? "filled" : "outlined"
                    }
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
              </Box>

              {/* Header */}
              <Box
                sx={{
                  p: 3,
                  background:
                    "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <School sx={{ fontSize: 28 }} />
                <Typography variant="h6" fontWeight="700">
                  Danh sách Phiếu Đồng Ý ({filteredForms.length})
                </Typography>
              </Box>

              {/* List Content */}
              <Box sx={{ flex: 1, overflow: "auto" }}>
                {filteredForms.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Info sx={{ fontSize: 64, color: "grey.300", mb: 2 }} />
                    <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                      <Typography variant="body1" fontWeight="500">
                        {mode === "parent"
                          ? "Hiện tại chưa có phiếu đồng ý nào cần xử lý cho các con của bạn."
                          : campaignId
                          ? "Chưa có phiếu đồng ý nào cho chương trình này."
                          : "Không có phiếu đồng ý nào trong hệ thống."}
                      </Typography>
                    </Alert>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {filteredForms.map((form, index) => (
                      <React.Fragment key={form.id}>
                        <ListItemButton
                          selected={selectedForm?.id === form.id}
                          onClick={() => setSelectedForm(form)}
                          sx={{
                            py: 3,
                            px: 3,
                            transition: "all 0.3s ease",
                            "&.Mui-selected": {
                              bgcolor: "primary.50",
                              borderRight: 4,
                              borderRightColor: "primary.main",
                              transform: "translateX(4px)",
                            },
                            "&:hover": {
                              bgcolor: "grey.50",
                              transform: "translateX(2px)",
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={3}
                            alignItems="center"
                            width="100%"
                          >
                            <Avatar
                              sx={{
                                bgcolor:
                                  getStatusColor(
                                    form.isApproved,
                                    form.updatedBy
                                  ) === "success"
                                    ? "success.main"
                                    : getStatusColor(
                                        form.isApproved,
                                        form.updatedBy
                                      ) === "error"
                                    ? "error.main"
                                    : getStatusColor(
                                        form.isApproved,
                                        form.updatedBy
                                      ) === "warning"
                                    ? "warning.main"
                                    : "primary.main",
                                width: 48,
                                height: 48,
                                boxShadow: 2,
                              }}
                            >
                              <Person sx={{ fontSize: 24 }} />
                            </Avatar>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="subtitle1"
                                fontWeight="700"
                                noWrap
                                sx={{ mb: 0.5, color: "text.primary" }}
                              >
                                {form.campaignName || "Chương trình y tế"}
                              </Typography>

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                                sx={{ mb: 1.5, fontWeight: 500 }}
                              >
                                {mode === "admin"
                                  ? `Học sinh: ${form.studentName || "N/A"}`
                                  : `${form.studentName || "Học sinh"}`}
                              </Typography>

                              <Chip
                                icon={getStatusIcon(
                                  form.isApproved,
                                  form.updatedBy
                                )}
                                label={getStatusText(
                                  form.isApproved,
                                  form.updatedBy
                                )}
                                color={getStatusColor(
                                  form.isApproved,
                                  form.updatedBy
                                )}
                                size="small"
                                variant="filled"
                                sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                              />
                            </Box>

                            <Stack alignItems="center" spacing={1}>
                              {mode === "admin" && (
                                <Tooltip title="Xóa phiếu đồng ý">
                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(form.id);
                                    }}
                                    sx={{
                                      "&:hover": {
                                        bgcolor: "error.50",
                                        transform: "scale(1.1)",
                                      },
                                    }}
                                  >
                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                  </IconButton>
                                </Tooltip>
                              )}

                              {form.isApproved === undefined && (
                                <Badge
                                  color="warning"
                                  variant="dot"
                                  sx={{
                                    "& .MuiBadge-dot": {
                                      width: 12,
                                      height: 12,
                                      borderRadius: "50%",
                                    },
                                  }}
                                />
                              )}
                            </Stack>
                          </Stack>
                        </ListItemButton>
                        {index < filteredForms.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Right Panel - Details */}
          <Box sx={{ flex: 1 }}>
            {selectedForm ? (
              <ConsentFormTicket
                consentForm={selectedForm}
                mode={mode}
                onSubmit={handleSubmit}
              />
            ) : (
              <Paper
                elevation={4}
                sx={{
                  p: 6,
                  textAlign: "center",
                  borderRadius: 3,
                  height: { xs: "auto", lg: "calc(100vh - 400px)" },
                  minHeight: { xs: 400, lg: 600 },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.50",
                    mb: 3,
                    boxShadow: 3,
                  }}
                >
                  <Info sx={{ fontSize: 60, color: "primary.main" }} />
                </Avatar>

                <Typography
                  variant="h4"
                  fontWeight="700"
                  color="text.primary"
                  gutterBottom
                >
                  {consentForms.length === 0
                    ? "Không có phiếu đồng ý nào"
                    : "Chọn một phiếu đồng ý"}
                </Typography>

                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: 500, lineHeight: 1.6 }}
                >
                  {mode === "parent"
                    ? "Khi có phiếu đồng ý mới cho các con của bạn, thông tin chi tiết sẽ hiển thị tại đây để bạn có thể xem xét và xử lý."
                    : "Chọn một phiếu đồng ý từ danh sách bên trái để xem thông tin chi tiết và thực hiện các thao tác cần thiết."}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Fade>
    </Container>
  );
};

export default ConsentFormPage;

type StatusFilter = "all" | "approved" | "rejected" | "pending";
