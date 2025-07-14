import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import { format, isBefore, parseISO } from "date-fns";
import HistoryIcon from "@mui/icons-material/History";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { MedicationRequest } from "../../../models/types";
import axiosInstance from "../../../utils/axiosConfig";

// Interface for diary entries updated to match API response format
interface MedicationDiaryEntry {
  id: string;
  medicationRequestId?: string;
  studentName: string;
  status: number;
  description: string;
  createAt: string;
  createdBy: string;
}

interface NurseMedicationListProps {
  requests: MedicationRequest[];
  onReceiveMedication: (requestId: string) => void;
  isLoading: boolean;
  nurseId: string;
}

const NurseMedicationList: React.FC<NurseMedicationListProps> = ({
  requests,
  onReceiveMedication,
  isLoading,
  nurseId,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<MedicationRequest | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<MedicationDiaryEntry[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loadingDiary, setLoadingDiary] = useState(false);
  const [openRows, setOpenRows] = useState<{[key: string]: boolean}>({});
  
  // Filter requests that are assigned to this nurse with status "received"
  const medicatedStudents = requests.filter(
    (req) => req.receivedBy === nurseId && req.status === "received"
  );

  // Group medications by student
  const groupedByStudent = medicatedStudents.reduce((acc, request) => {
    const studentId = request.studentId;
    if (!acc[studentId]) {
      acc[studentId] = {
        studentId: studentId,
        studentName: request.studentName,
        medications: []
      };
    }
    acc[studentId].medications.push(request);
    return acc;
  }, {} as { [key: string]: { studentId: string, studentName: string, medications: MedicationRequest[] } });

  const handleToggleRow = (studentId: string) => {
    setOpenRows((prev) => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const getMedicationStatus = (request: MedicationRequest) => {
    const today = new Date();
    const endDate = new Date(request.endDate);
    
    if (isBefore(endDate, today)) {
      return "expired";
    } else {
      return "in-progress";
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Chip label="Trong quá trình" color="info" size="small" />;
      case "expired":
        return <Chip label="Hết hạn" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Hàm định dạng ngày an toàn
  const formatDate = (dateString: string, formatStr: string = "dd/MM/yyyy HH:mm") => {
    try {
      // Đảm bảo dateString là chuỗi hợp lệ
      if (!dateString) return "N/A";
      
      // Chuyển đổi từ ISO string sang Date object
      const date = parseISO(dateString);
      return format(date, formatStr);
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "N/A";
    }
  };

  // Xem nhật ký thuốc cụ thể
  const handleDiaryClick = async (request: MedicationRequest) => {
    setSelectedRequest(request);
    setSelectedStudent(null);
    setLoadingDiary(true);
    setConfirmDialogOpen(true);

    try {
      const student = await axiosInstance.get(`/api/Student/get-student-by-student-code/${request.studentId}`);
      // Fetch diary entries for this medication request
      const response = await axiosInstance.get(`/api/MedicaDiary/student/${student.data.id}`);
      setDiaryEntries(response.data);
    } catch (error) {
      console.error("Error fetching medication diary:", error);
      setDiaryEntries([]);
    } finally {
      setLoadingDiary(false);
    }
  };
  
  // Xem nhật ký của học sinh
  const handleStudentDiaryClick = async (studentId: string, studentName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn việc mở rộng/thu gọn dòng
    
    setSelectedStudent({id: studentId, name: studentName});
    setSelectedRequest(null);
    setLoadingDiary(true);
    setConfirmDialogOpen(true);

    try {
      const student = await axiosInstance.get(`/api/Student/get-student-by-student-code/${studentId}`);
      // Fetch all diary entries for this student
      const response = await axiosInstance.get(`/api/MedicaDiary/student/${student.data.id}`);
      setDiaryEntries(response.data);
    } catch (error) {
      console.error("Error fetching student diary:", error);
      setDiaryEntries([]);
    } finally {
      setLoadingDiary(false);
    }
  };

  const handleCloseDialog = () => {
    setConfirmDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Danh sách học sinh đã nhận thuốc
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : Object.keys(groupedByStudent).length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Không có học sinh nào đang trong quá trình dùng thuốc.
        </Typography>
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="50px" />
                <TableCell>Tên học sinh</TableCell>
                <TableCell>Số loại thuốc</TableCell>
                <TableCell align="center" width="80px">Nhật ký</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(groupedByStudent).map((studentGroup) => (
                <React.Fragment key={studentGroup.studentId}>
                  <TableRow 
                    sx={{ 
                      '& > *': { borderBottom: 'unset' },
                      bgcolor: (theme) => theme.palette.action.hover,
                      cursor: 'pointer'
                    }}
                    onClick={() => handleToggleRow(studentGroup.studentId)}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                      >
                        {openRows[studentGroup.studentId] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell><strong>{studentGroup.studentName}</strong></TableCell>
                    <TableCell>{studentGroup.medications.length} loại thuốc</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xem nhật ký học sinh">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => handleStudentDiaryClick(studentGroup.studentId, studentGroup.studentName, e)}
                        >
                          <HistoryIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={openRows[studentGroup.studentId]} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="subtitle2" gutterBottom component="div" sx={{ fontWeight: 'bold', mt: 2 }}>
                            Danh sách thuốc
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Tên thuốc</TableCell>
                                <TableCell>Liều lượng</TableCell>
                                <TableCell>Hướng dẫn</TableCell>
                                <TableCell align="center">Ngày bắt đầu</TableCell>
                                <TableCell align="center">Ngày kết thúc</TableCell>
                                <TableCell align="center">Trạng thái</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {studentGroup.medications.map((medication) => {
                                const medicationStatus = getMedicationStatus(medication);
                                return (
                                  <TableRow key={medication.id}>
                                    <TableCell>{medication.medicationName}</TableCell>
                                    <TableCell>{medication.dosage}</TableCell>
                                    <TableCell>{medication.instructions}</TableCell>
                                    <TableCell align="center">
                                      {format(new Date(medication.startDate), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell align="center">
                                      {format(new Date(medication.endDate), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell align="center">
                                      {getStatusChip(medicationStatus)}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={confirmDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedStudent ? `Nhật ký sử dụng thuốc - ${selectedStudent.name}` : 'Nhật ký sử dụng thuốc'}
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedRequest.medicationName} - {selectedRequest.studentName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedRequest.dosage} | {selectedRequest.instructions}
              </Typography>
              
              <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1">
                  <strong>Thời gian:</strong> {format(new Date(selectedRequest.startDate), "dd/MM/yyyy")} -  {format(new Date(selectedRequest.endDate), "dd/MM/yyyy")}
                </Typography>
                {getStatusChip(getMedicationStatus(selectedRequest))}
              </Box>
            </>
          )}
          
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Lịch sử dùng thuốc
          </Typography>

          {loadingDiary ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress size={24} />
            </Box>
          ) : diaryEntries.length === 0 ? (
            <Typography variant="body1" color="textSecondary">
              Chưa có nhật ký sử dụng thuốc nào.
            </Typography>
          ) : (
            <List>
              {diaryEntries.map((entry) => (
                <React.Fragment key={entry.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{formatDate(entry.createAt, "dd/MM/yyyy HH:mm")}</span>
                          <span>Y tá: {entry.createdBy}</span>
                        </Box>
                      }
                      secondary={
                        entry.description && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            Ghi chú: {entry.description}
                          </Typography>
                        )
                      }
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default NurseMedicationList;
