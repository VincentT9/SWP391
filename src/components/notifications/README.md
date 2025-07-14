# Hệ thống Thông báo

## Tổng quan
Trang thông báo đã được cập nhật với đầy đủ chức năng quản lý thông báo theo phân quyền, sử dụng API schema đơn giản với 3 trường: title, content, type.

## Phân quyền

### Admin
- **Quyền đầy đủ**: Tạo, chỉnh sửa, xóa và xem tất cả thông báo
- Có nút floating action button (+) để tạo thông báo mới
- Có menu context với các tùy chọn: Đánh dấu đã đọc/chưa đọc, Chỉnh sửa, Xóa

### Parent (Phụ huynh)
- **Chỉ xem**: Có thể xem tất cả thông báo
- Có thể đánh dấu đã đọc/chưa đọc cho thông báo
- Không có quyền tạo, chỉnh sửa, xóa thông báo

### MedicalStaff (Y tá/Nhân viên y tế)
- **Chỉ xem**: Có thể xem tất cả thông báo  
- Có thể đánh dấu đã đọc/chưa đọc cho thông báo
- Không có quyền tạo, chỉnh sửa, xóa thông báo

## Tính năng

### 1. Hiển thị thông báo
- **Tabs phân loại**: 
  - Tất cả
  - Chưa đọc  
  - Quan trọng (medical, warning types)
- **Thông tin chi tiết**: Tiêu đề, nội dung, loại thông báo, thời gian
- **Tag hiển thị**: Chỉ hiển thị tag loại thông báo (type) với màu sắc phân biệt
- **Trạng thái**: Hiển thị thông báo đã đọc/chưa đọc
- **Refresh**: Nút làm mới để tải lại thông báo

### 2. Quản lý thông báo (chỉ Admin)
- **Tạo thông báo mới**: Dialog với 3 trường theo API schema
- **Chỉnh sửa**: Cập nhật thông tin thông báo
- **Xóa**: Xóa thông báo khỏi hệ thống

### 3. Form tạo/chỉnh sửa thông báo
- **Tiêu đề**: Tên thông báo (required)
- **Nội dung**: Mô tả chi tiết (required)
- **Loại thông báo**: Text field tự do (ví dụ: info, warning, success, medical, event)

## API Endpoints

### GET `/api/Notification/get-all-notifications`
Lấy tất cả thông báo

### GET `/api/Notification/get-notification-by-id/{notificationId}`
Lấy thông báo theo ID

### POST `/api/Notification/create-notification`
Tạo thông báo mới (chỉ Admin)
```json
{
  "title": "string",
  "content": "string", 
  "type": "string"
}
```

### PUT `/api/Notification/update-notification/{notificationId}`
Cập nhật thông báo (chỉ Admin)
```json
{
  "title": "string",
  "content": "string",
  "type": "string"
}
```

### DELETE `/api/Notification/delete-notification/{notificationId}`
Xóa thông báo (chỉ Admin)

## Cấu trúc dữ liệu

### API Request/Response
```typescript
interface NotificationAPI {
  title: string;
  content: string;
  type: string;
}
```

### Frontend Interface
```typescript
interface Notification {
  id: string;
  title: string;
  message: string; // Mapped from content
  type: string;
  isRead: boolean;
  timestamp: Date;
  priority: 'medium'; // Default value
  relatedUserId?: string;
  createdBy?: string;
  targetRole?: string;
}
```

## Sử dụng

1. **Đăng nhập** với tài khoản có quyền phù hợp
2. **Truy cập** trang thông báo từ menu
3. **Xem thông báo** theo các tab phân loại
4. **Admin**: Sử dụng nút (+) để tạo thông báo mới với 3 trường: title, content, type
5. **Tất cả**: Sử dụng menu context (3 chấm) để thao tác với thông báo

## Lưu ý
- Form đã được đơn giản hóa chỉ còn 3 trường theo API schema: title, content, type
- Loại thông báo (type) là text field tự do, có thể nhập: info, warning, success, medical, event, v.v.
- **Tag hiển thị**: Chỉ hiển thị tag type với màu sắc tương ứng (không hiển thị priority/targetRole)
- **Tab Quan trọng**: Lọc theo loại medical và warning
- Border màu của notification items dựa theo type thay vì priority
- Chỉ có Admin mới có quyền quản lý (tạo/sửa/xóa) thông báo
- Parent và MedicalStaff chỉ có quyền xem và đánh dấu đã đọc
- Hệ thống sử dụng authentication token từ localStorage
- Có xử lý lỗi và thông báo thành công cho các thao tác
