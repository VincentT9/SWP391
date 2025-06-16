import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import { format } from "date-fns";
import { MedicationDiaryEntry } from "../../models/types";

interface MedicationDiaryViewProps {
  diaries: MedicationDiaryEntry[];
}

const MedicationDiaryView: React.FC<MedicationDiaryViewProps> = ({
  diaries,
}) => {
  // Hàm chuyển đổi trạng thái số sang văn bản và màu sắc
  const getStatusDisplay = (status: number) => {
    switch (status) {
      case 0:
        return { label: "Đã uống thuốc", color: "success" as "success" };
      case 1:
        return { label: "Đã bỏ lỡ", color: "error" as "error" };
      case 2:
        return { label: "Đã hoãn", color: "warning" as "warning" };
      default:
        return { label: "Không xác định", color: "default" as "default" };
    }
  };

  // Format ngày giờ
  const formatDateTime = (dateTimeStr: string) => {
    try {
      return format(new Date(dateTimeStr), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return "Không xác định";
    }
  };

  return (
    <Box>
      {diaries.length === 0 ? (
        <Typography>Chưa có nhật ký uống thuốc nào.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Thời gian</TableCell>
                <TableCell>Học sinh</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell>Người thực hiện</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {diaries.map((diary) => {
                const statusInfo = getStatusDisplay(diary.status);
                return (
                  <TableRow key={diary.id}>
                    <TableCell>{formatDateTime(diary.createAt)}</TableCell>
                    <TableCell>{diary.studentName}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusInfo.label}
                        color={statusInfo.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {diary.description || "Không có ghi chú"}
                    </TableCell>
                    <TableCell>{diary.createdBy}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MedicationDiaryView;
