import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { format } from "date-fns";
import { MedicationLog } from "../../models/types";

interface MedicationLogViewProps {
  logs: MedicationLog[];
}

const MedicationLogView: React.FC<MedicationLogViewProps> = ({ logs }) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ngày giờ</TableCell>
            <TableCell>Thuốc</TableCell>
            <TableCell>Liều lượng</TableCell>
            <TableCell>Người cho uống</TableCell>
            <TableCell>Tình trạng trước khi uống</TableCell>
            <TableCell>Tình trạng sau khi uống</TableCell>
            <TableCell>Ghi chú</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {format(new Date(log.administeredAt), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{log.medicationName}</TableCell>
              <TableCell>{log.dosage}</TableCell>
              <TableCell>{log.administeredBy}</TableCell>
              <TableCell>{log.studentConditionBefore || "-"}</TableCell>
              <TableCell>{log.studentConditionAfter || "-"}</TableCell>
              <TableCell>{log.notes || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MedicationLogView;
