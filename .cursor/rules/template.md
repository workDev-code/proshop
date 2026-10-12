Template backend feature:
Hiểu yêu cầu

Feature gì?
Endpoint nào?
Ai được dùng? (public / auth / admin)
Thiết kế flow

Route nào xử lý?
Controller cần làm gì?
Cần model / DB query nào?
Cần middleware nào?
Viết code theo layer

route chỉ định path và middleware
controller chỉ xử lý logic
model định nghĩa dữ liệu
middleware tách riêng auth/error
Validate + bảo mật

input có đúng format không?
password, email, token đã kiểm tra chưa?
ai có quyền truy cập?
Test

unit test cho validation
integration test cho flow
chạy local trước khi PR
Review

code có rõ ràng không?
có chồng chéo logic không?
có case lỗi chưa xử lý không? đây là teamplate thì với dự án hiện tại mình có thể define feature mới như nào 