import React from "react";
import { Box, Typography, Paper, Divider, Chip, Avatar } from "@mui/material";
import { format } from "date-fns";
import { MedicationRequest } from "../../../models/types";

interface MedicationRequestDetailProps {
  request: any; // Sử dụng dữ liệu gốc từ API thay vì MedicationRequest
}

const MedicationRequestDetail: React.FC<MedicationRequestDetailProps> = ({
  request,
}) => {
  // Định dạng ngày
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "N/A";
    }
  };

  // Map status code to text and color
  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return { label: "Đã yêu cầu", color: "info" };
      case 1:
        return { label: "Đã nhận", color: "primary" };
      case 2:
        return { label: "Hoàn thành", color: "success" };
      case 3:
        return { label: "Đã hủy", color: "error" };
      default:
        return { label: "Đã yêu cầu", color: "info" };
    }
  };

  const statusInfo = getStatusInfo(request.status);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chi tiết thuốc đã gửi
      </Typography>

      {/* Thông tin học sinh */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Thông tin học sinh
        </Typography>
        <Typography variant="body1">
          {request.student?.fullName || "N/A"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Thông tin thuốc */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Thông tin thuốc
        </Typography>
        <Typography variant="body1" gutterBottom>
          Tên thuốc và thành phần:
        </Typography>
        <Typography variant="body2" sx={{ pl: 2, mb: 1 }}>
          {request.medicationName || "N/A"}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
            <Typography variant="body1">Số lần uống/ngày:</Typography>
            <Typography variant="body2" sx={{ pl: 2 }}>
              {request.dosage} lần/ngày
            </Typography>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
            <Typography variant="body1">Số ngày cần uống:</Typography>
            <Typography variant="body2" sx={{ pl: 2 }}>
              {request.numberOfDayToTake} ngày
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Thời gian */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Thời gian
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
            <Typography variant="body1">Ngày bắt đầu:</Typography>
            <Typography variant="body2" sx={{ pl: 2 }}>
              {formatDate(request.startDate)}
            </Typography>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
            <Typography variant="body1">Ngày kết thúc:</Typography>
            <Typography variant="body2" sx={{ pl: 2 }}>
              {request.endDate ? formatDate(request.endDate) : "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Hướng dẫn sử dụng */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Hướng dẫn sử dụng và ghi chú
        </Typography>
        <Typography variant="body2" sx={{ pl: 2 }}>
          {request.instructions || "Không có ghi chú"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Trạng thái */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Trạng thái
        </Typography>
        <Chip
          label={statusInfo.label}
          color={statusInfo.color as "info" | "primary" | "success" | "error"}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* PHẦN MỚI: Hình ảnh hóa đơn */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Hình ảnh hóa đơn thuốc
        </Typography>
        {request.imagesMedicalInvoice &&
        request.imagesMedicalInvoice.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {request.imagesMedicalInvoice.map(
              (imageUrl: string, index: number) => (
                <Box
                  key={index}
                  sx={{ border: "1px solid #eee", p: 1, borderRadius: 1 }}
                >
                  <img
                    src={imageUrl}
                    alt={`Hóa đơn thuốc ${index + 1}`}
                    style={{ maxWidth: "300px", maxHeight: "200px" }}
                  />
                </Box>
              )
            )}
          </Box>
        ) : (
          <Typography variant="body2">Không có hình ảnh hóa đơn</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* PHẦN MỚI: Thông tin y tá/nhân viên y tế */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Thông tin nhân viên y tế
        </Typography>
        {request.medicalStaff ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt={request.medicalStaff.fullName || "Y tá"}
              src={request.medicalStaff.image || ""}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1">
                {request.medicalStaff.fullName || "Chưa có thông tin"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {request.medicalStaff.email || "N/A"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điện thoại: {request.medicalStaff.phoneNumber || "N/A"}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2">Chưa có nhân viên y tế xử lý</Typography>
        )}
      </Box>
    </Box>
  );
};

export default MedicationRequestDetail;
