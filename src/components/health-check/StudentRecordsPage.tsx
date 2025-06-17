import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  MedicalServices as MedicalIcon,
  Medication as MedicationIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  Visibility as EyeIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

// Interface definitions (giữ nguyên)
interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  parentName: string;
  parentPhone: string;
  avatar?: string;
  bloodType: string;
  describe: string;
  emergencyContact: string;
}

interface HealthRecord {
  id: string;
  studentId: string;
  date: string;
  type: 'checkup' | 'treatment' | 'vaccination' | 'medication';
  title: string;
  description: string;
  height?: number;
  weight?: number;
  bloodPressure?: string;
  temperature?: number;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  nurseId: string;
  nurseName: string;
}

// Mock data (giữ nguyên)
const mockStudents: Student[] = [
  {
    id: '1',
    studentId: 'HS001',
    name: 'Nguyễn Văn An',
    class: '10A1',
    dateOfBirth: '2007-05-15',
    gender: 'Nam',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    parentName: 'Nguyễn Văn Bình',
    parentPhone: '0901234567',
    bloodType: 'O+',
    describe: 'Dị ứng với Cua, Dị ứng với cơm',
    emergencyContact: '0987654321',
  },
  {
    id: '2',
    studentId: 'HS002',
    name: 'Trần Thị Bình',
    class: '11B2',
    dateOfBirth: '2006-08-22',
    gender: 'Nữ',
    address: '456 Đường XYZ, Quận 3, TP.HCM',
    parentName: 'Trần Văn Cường',
    parentPhone: '0902345678',
    bloodType: 'A+',
    describe: 'none',
    emergencyContact: '0976543210',
  },
  {
    id: '3',
    studentId: 'HS003',
    name: 'Lê Minh Châu',
    class: '12C1',
    dateOfBirth: '2005-12-10',
    gender: 'Nam',
    address: '789 Đường DEF, Quận 5, TP.HCM',
    parentName: 'Lê Thị Dung',
    parentPhone: '0903456789',
    bloodType: 'B+',
    describe: 'none',
    emergencyContact: '0965432109',
  },
];

const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    studentId: 'HS001',
    date: '2024-05-20',
    type: 'checkup',
    title: 'Khám sức khỏe định kỳ',
    description: 'Khám sức khỏe đầu năm học',
    height: 165,
    weight: 55,
    bloodPressure: '120/80',
    temperature: 36.5,
    diagnosis: 'Sức khỏe tốt',
    treatment: 'Không cần điều trị',
    nurseId: '2',
    nurseName: 'Nguyễn Thị Y Tá',
  },
  {
    id: '2',
    studentId: 'HS001',
    date: '2024-05-15',
    type: 'treatment',
    title: 'Điều trị cảm cúm',
    description: 'Học sinh có triệu chứng sốt, ho',
    temperature: 38.2,
    diagnosis: 'Cảm cúm thông thường',
    treatment: 'Nghỉ ngơi, uống thuốc hạ sốt',
    medications: ['Paracetamol 500mg', 'Vitamin C'],
    nurseId: '2',
    nurseName: 'Nguyễn Thị Y Tá',
  },
  {
    id: '3',
    studentId: 'HS002',
    date: '2024-05-18',
    type: 'vaccination',
    title: 'Tiêm vắc xin HPV',
    description: 'Tiêm vắc xin phòng chống ung thư cổ tử cung',
    treatment: 'Tiêm thành công, theo dõi 30 phút',
    nurseId: '2',
    nurseName: 'Nguyễn Thị Y Tá',
  },
];

const StudentRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchStudentId, setSearchStudentId] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  // Check if user is nurse or admin
  if (!user?.isAuthenticated || (user.role !== 'MedicalStaff' && user.role !== 'Admin')) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Chỉ có y tá và quản trị viên mới có quyền truy cập chức năng này.
          </Alert>
        </Box>
      </Container>
    );
  }

  const handleSearch = () => {
    if (!searchStudentId.trim()) {
      setError('Vui lòng nhập mã số học sinh.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      const student = mockStudents.find(s => 
        s.studentId.toLowerCase() === searchStudentId.trim().toLowerCase()
      );
      
      if (student) {
        setSelectedStudent(student);
        const records = mockHealthRecords.filter(r => r.studentId === student.studentId);
        setHealthRecords(records);
        setError(null);
      } else {
        setSelectedStudent(null);
        setHealthRecords([]);
        setError('Không tìm thấy học sinh với mã số này.');
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleViewRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case 'checkup': return '#2196f3';
      case 'treatment': return '#f44336';
      case 'vaccination': return '#4caf50';
      case 'medication': return '#ff9800';
      default: return '#757575';
    }
  };

  const getRecordTypeLabel = (type: string) => {
    switch (type) {
      case 'checkup': return 'Khám sức khỏe';
      case 'treatment': return 'Điều trị';
      case 'vaccination': return 'Tiêm chủng';
      case 'medication': return 'Dùng thuốc';
      default: return 'Khác';
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#0066b3', mb: 1 }}>
            Tìm kiếm hồ sơ học sinh
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Nhập mã số học sinh để tìm kiếm và xem hồ sơ sức khỏe
          </Typography>
        </Box>

        {/* Search Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Mã số học sinh"
                placeholder="Nhập mã số học sinh (VD: HS001)"
                value={searchStudentId}
                onChange={(e) => setSearchStudentId(e.target.value)}
                onKeyPress={handleKeyPress}
                error={!!error}
                helperText={error}
                disabled={loading}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading || !searchStudentId.trim()}
                startIcon={<SearchIcon />}
                sx={{ 
                  bgcolor: '#0066b3', 
                  '&:hover': { bgcolor: '#004d85' }, 
                  minWidth: '120px',
                  height: '56px'
                }}
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Student Information - Using Flexbox instead of Grid */}
        {selectedStudent && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#0066b3' }}>
                Thông tin học sinh
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                gap: 3 
              }}>
                {/* Avatar Section */}
                <Box sx={{ 
                  textAlign: 'center', 
                  minWidth: { md: '200px' },
                  alignSelf: { md: 'flex-start' }
                }}>
                  <Avatar
                    sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#0066b3' }}
                    src={selectedStudent.avatar}
                  >
                    <PersonIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedStudent.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedStudent.studentId}
                  </Typography>
                </Box>
                
                {/* Info Section - Using CSS Grid */}
                <Box sx={{ 
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  gap: 2
                }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Lớp</Typography>
                    <Typography variant="body1">{selectedStudent.class}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Tuổi</Typography>
                    <Typography variant="body1">{calculateAge(selectedStudent.dateOfBirth)} tuổi</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Giới tính</Typography>
                    <Typography variant="body1">{selectedStudent.gender}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Nhóm máu</Typography>
                    <Typography variant="body1">{selectedStudent.bloodType}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                    <Typography variant="subtitle2" color="textSecondary">Địa chỉ</Typography>
                    <Typography variant="body1">{selectedStudent.address}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Phụ huynh</Typography>
                    <Typography variant="body1">{selectedStudent.parentName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Số điện thoại</Typography>
                    <Typography variant="body1">{selectedStudent.parentPhone}</Typography>
                  </Box>
                  <Box sx={{ gridColumn: { sm: '1 / -1' } }}>
                    <Typography variant="subtitle2" color="textSecondary">Mô tả</Typography>
                    <Typography variant="body1">{selectedStudent.describe}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Health Records */}
        {selectedStudent && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0066b3' }}>
                  Lịch sử khám chữa bệnh ({healthRecords.length} bản ghi)
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#45a049' } }}
                >
                  Thêm bản ghi mới
                </Button>
              </Box>

              {healthRecords.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <MedicalIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    Chưa có bản ghi sức khỏe nào
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nhấn "Thêm bản ghi mới" để tạo bản ghi đầu tiên
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell><strong>Ngày</strong></TableCell>
                        <TableCell><strong>Loại</strong></TableCell>
                        <TableCell><strong>Tiêu đề</strong></TableCell>
                        <TableCell><strong>Y tá</strong></TableCell>
                        <TableCell><strong>Thao tác</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {healthRecords.map((record) => (
                        <TableRow key={record.id} hover>
                          <TableCell>
                            {new Date(record.date).toLocaleDateString('vi-VN')}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={getRecordTypeLabel(record.type)}
                              size="small"
                              sx={{
                                bgcolor: getRecordTypeColor(record.type),
                                color: 'white',
                              }}
                            />
                          </TableCell>
                          <TableCell>{record.title}</TableCell>
                          <TableCell>{record.nurseName}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleViewRecord(record)}
                              sx={{ color: '#0066b3' }}
                              title="Xem chi tiết"
                            >
                              <EyeIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              sx={{ color: '#ff9800' }}
                              title="Chỉnh sửa"
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Record Detail Dialog - Using Flexbox instead of Grid */}
        <Dialog 
          open={openDialog} 
          onClose={handleCloseDialog} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: { minHeight: '400px' }
          }}
        >
          <DialogTitle>
            Chi tiết bản ghi sức khỏe
          </DialogTitle>
          <DialogContent>
            {selectedRecord && (
              <Box sx={{ pt: 2 }}>
                {/* Basic Info */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                  gap: 2, 
                  mb: 2 
                }}>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Ngày khám</Typography>
                    <Typography variant="body1">
                      {new Date(selectedRecord.date).toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="textSecondary">Loại</Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={getRecordTypeLabel(selectedRecord.type)}
                        size="small"
                        sx={{
                          bgcolor: getRecordTypeColor(selectedRecord.type),
                          color: 'white',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Tiêu đề</Typography>
                  <Typography variant="body1">{selectedRecord.title}</Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="textSecondary">Mô tả</Typography>
                  <Typography variant="body1">{selectedRecord.description}</Typography>
                </Box>
                
                {/* Health Metrics */}
                {(selectedRecord.height || selectedRecord.weight || selectedRecord.bloodPressure || selectedRecord.temperature) && (
                  <Box sx={{ mb: 2 }}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Chỉ số sức khỏe
                    </Typography>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, 
                      gap: 2 
                    }}>
                      {selectedRecord.height && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <HeightIcon sx={{ mr: 1, color: '#0066b3' }} />
                          <Box>
                            <Typography variant="caption" color="textSecondary">Chiều cao</Typography>
                            <Typography variant="body1">{selectedRecord.height} cm</Typography>
                          </Box>
                        </Box>
                      )}
                      {selectedRecord.weight && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <WeightIcon sx={{ mr: 1, color: '#0066b3' }} />
                          <Box>
                            <Typography variant="caption" color="textSecondary">Cân nặng</Typography>
                            <Typography variant="body1">{selectedRecord.weight} kg</Typography>
                          </Box>
                        </Box>
                      )}
                      {selectedRecord.bloodPressure && (
                        <Box>
                          <Typography variant="caption" color="textSecondary">Huyết áp</Typography>
                          <Typography variant="body1">{selectedRecord.bloodPressure} mmHg</Typography>
                        </Box>
                      )}
                      {selectedRecord.temperature && (
                        <Box>
                          <Typography variant="caption" color="textSecondary">Nhiệt độ</Typography>
                          <Typography variant="body1">{selectedRecord.temperature}°C</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {selectedRecord.diagnosis && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">Chẩn đoán</Typography>
                    <Typography variant="body1">{selectedRecord.diagnosis}</Typography>
                  </Box>
                )}

                {selectedRecord.treatment && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">Điều trị</Typography>
                    <Typography variant="body1">{selectedRecord.treatment}</Typography>
                  </Box>
                )}

                {selectedRecord.medications && selectedRecord.medications.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">Thuốc đã sử dụng</Typography>
                    <List dense>
                      {selectedRecord.medications.map((medication, index) => (
                        <ListItem key={index} sx={{ pl: 0 }}>
                          <ListItemIcon>
                            <MedicationIcon sx={{ color: '#ff9800' }} />
                          </ListItemIcon>
                          <ListItemText primary={medication} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="textSecondary">Y tá phụ trách</Typography>
                  <Typography variant="body1">{selectedRecord.nurseName}</Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Đóng</Button>
            <Button variant="contained" startIcon={<EditIcon />}>
              Chỉnh sửa
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default StudentRecordsPage;