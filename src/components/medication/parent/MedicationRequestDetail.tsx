import React from "react";
import { Box, Typography, Paper, Divider, Chip, Avatar } from "@mui/material";
import { format } from "date-fns";

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

      {/* Thông tin học sinh - Cập nhật để sử dụng các trường trực tiếp từ API */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Thông tin học sinh
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Box sx={{ display: "flex", mb: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", minWidth: 120 }}
            >
              Mã học sinh:
            </Typography>
            <Typography variant="body1">
              {request.studentCode || "N/A"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: "medium", minWidth: 120 }}
            >
              Tên học sinh:
            </Typography>
            <Typography variant="body1">
              {request.studentName || "N/A"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Thông tin thuốc */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Thông tin thuốc
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              Tên thuốc và thành phần:
            </Typography>
            <Typography variant="body1" sx={{ pl: 1 }}>
              {request.medicationName || "N/A"}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                Số lần uống/ngày:
              </Typography>
              <Typography variant="body1" sx={{ pl: 1 }}>
                {request.dosage} lần/ngày
              </Typography>
            </Box>
            <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                Số ngày cần uống:
              </Typography>
              <Typography variant="body1" sx={{ pl: 1 }}>
                {request.numberOfDayToTake} ngày
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Thời gian */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Thời gian
        </Typography>
        <Box sx={{ pl: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              Ngày bắt đầu:
            </Typography>
            <Typography variant="body1" sx={{ pl: 1 }}>
              {formatDate(request.startDate)}
            </Typography>
          </Box>
          <Box sx={{ flex: "1 1 45%", minWidth: "200px" }}>
            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
              Ngày kết thúc:
            </Typography>
            <Typography variant="body1" sx={{ pl: 1 }}>
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
        <Typography variant="body1" sx={{ pl: 2 }}>
          {request.instructions || "Không có ghi chú"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Trạng thái */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Trạng thái
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Chip
            label={statusInfo.label}
            color={statusInfo.color as "info" | "primary" | "success" | "error"}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Hình ảnh hóa đơn */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Hình ảnh hóa đơn thuốc
        </Typography>
        {request.imagesMedicalInvoice &&
        request.imagesMedicalInvoice.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pl: 2 }}>
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
          <Typography variant="body1" sx={{ pl: 2 }}>
            Không có hình ảnh hóa đơn
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Y tá phụ trách */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Y tá phụ trách
        </Typography>
        <Box sx={{ pl: 2 }}>
          <Typography variant="body1">
            {request.medicalStaffName || "Chưa có y tá phụ trách"}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Nhật ký uống thuốc */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Nhật ký uống thuốc
        </Typography>

        {request.medicalDiaries && request.medicalDiaries.length > 0 ? (
          <Box sx={{ pl: 2 }}>
            {request.medicalDiaries.map((diary: any) => (
              <Box
                key={diary.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid #eee",
                  borderRadius: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Thời gian:
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(diary.createAt)}{" "}
                    {format(new Date(diary.createAt), "HH:mm")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Trạng thái:
                  </Typography>
                  <Chip
                    size="small"
                    label={diary.status === 0 ? "Đã bỏ lỡ" : "Đã uống thuốc"}
                    color={diary.status === 0 ? "error" : "success"}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                    Người thực hiện:
                  </Typography>
                  <Typography variant="body2">{diary.createdBy}</Typography>
                </Box>

                {diary.description && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                      Ghi chú:
                    </Typography>
                    <Typography variant="body2" sx={{ pl: 1 }}>
                      {diary.description}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body1" sx={{ pl: 2 }}>
            Chưa có nhật ký uống thuốc nào.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default MedicationRequestDetail;
