import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  Paper,
  Button
} from '@mui/material';
import { mockHealthRecords, mockStudents } from '../../utils/mockData';

const HealthRecordsPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // Get the student and health record for the selected tab
  const student = mockStudents[selectedTab];
  const healthRecord = mockHealthRecords.find(record => record.studentId === student.id);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hồ sơ sức khỏe học sinh
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Xem và quản lý thông tin sức khỏe của học sinh
        </Typography>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {mockStudents.map((student) => (
            <Tab 
              key={student.id} 
              label={`${student.lastName} ${student.firstName} - Lớp ${student.class}`} 
            />
          ))}
        </Tabs>
      </Paper>

      {healthRecord && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ width: '100%' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin cơ bản
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flexBasis: { xs: '100%', md: '45%' } }}>
                    <Typography variant="body1">
                      <strong>Họ và tên:</strong> {student.lastName} {student.firstName}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Lớp:</strong> {student.class}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Ngày sinh:</strong> {student.dateOfBirth.toLocaleDateString('vi-VN')}
                    </Typography>
                  </Box>
                  <Box sx={{ flexBasis: { xs: '100%', md: '45%' } }}>
                    <Typography variant="body1">
                      <strong>Chiều cao:</strong> {healthRecord.height} cm
                    </Typography>
                    <Typography variant="body1">
                      <strong>Cân nặng:</strong> {healthRecord.weight} kg
                    </Typography>
                    <Typography variant="body1">
                      <strong>Nhóm máu:</strong> {healthRecord.bloodType || 'Chưa có thông tin'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dị ứng
                </Typography>
                {healthRecord.allergies.length > 0 ? (
                  healthRecord.allergies.map((allergy) => (
                    <Box key={allergy.id} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="primary">
                        {allergy.name} - Mức độ: {allergy.severity === 'mild' ? 'Nhẹ' : 
                          allergy.severity === 'moderate' ? 'Trung bình' : 'Nặng'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Triệu chứng:</strong> {allergy.symptoms}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Điều trị:</strong> {allergy.treatment}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">Không có dị ứng nào được ghi nhận</Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Bệnh mãn tính
                </Typography>
                {healthRecord.chronicConditions.length > 0 ? (
                  healthRecord.chronicConditions.map((condition) => (
                    <Box key={condition.id} sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" color="primary">
                        {condition.name}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Ngày chẩn đoán:</strong> {condition.diagnosisDate.toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Ghi chú:</strong> {condition.notes}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1">Không có bệnh mãn tính nào được ghi nhận</Typography>
                )}
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary">
              Cập nhật hồ sơ
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default HealthRecordsPage; 