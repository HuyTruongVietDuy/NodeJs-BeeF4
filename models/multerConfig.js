// multerConfig.js
const multer = require('multer');
const path = require('path');

// Thiết lập storage engine cho Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Thư mục lưu trữ hình ảnh
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));  
  },
});

// Khởi tạo Multer middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn kích thước file (đơn vị byte)
  fileFilter: function (req, file, cb) {
    // Kiểm tra định dạng file (ví dụ chỉ chấp nhận file ảnh)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  },
});

module.exports = upload;
