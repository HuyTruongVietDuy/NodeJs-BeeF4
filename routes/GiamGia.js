let express = require("express");
let router = express.Router();
let $ = require("jquery");
const request = require("request");
const moment = require("moment");
const db = require("../models/database");

// Route để lấy danh sách tất cả các sản phẩm
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM giamgia';

  // Trước khi trả kết quả, cập nhật trạng thái của sản phẩm
  updateProductStatus();

  db.query(sql, (err, results) => {
      if (err) {
          console.error('Error retrieving products: ' + err.message);
          return res.status(500).send('Internal Server Error');
      }
      res.json(results);
  });
});

  function updateProductStatus() {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const sql = `UPDATE giamgia SET tinh_trang = 2 WHERE ngay_ket_thuc < '${currentTime}' AND tinh_trang <> 2`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error updating product status: ' + err.message);
        }
    });
}
  
  // Router để thêm mã giảm giá mới
// Router để thêm mã giảm giá mới
router.post('/add-voucher', (req, res) => {
    // Lấy thông tin về mã giảm giá từ request body
    let { ma_giamgia, phan_tram, ngay_bat_dau, ngay_ket_thuc } = req.body;

    // Kiểm tra và gán giá trị mặc định cho các trường null
    ma_giamgia = ma_giamgia || ''; // Gán giá trị mặc định là chuỗi rỗng
    phan_tram = phan_tram || 0; // Gán giá trị mặc định là 0
    ngay_bat_dau = ngay_bat_dau || new Date(); // Gán giá trị mặc định là ngày hiện tại
    ngay_ket_thuc = ngay_ket_thuc || null; // Gán giá trị mặc định là null

    // Truy vấn để thêm mã giảm giá vào cơ sở dữ liệu
    const sql = `INSERT INTO giamgia (ma_giamgia, phan_tram, ngay_bat_dau, ngay_ket_thuc) 
                 VALUES (?, ?, ?, ?)`;

    db.query(sql, [ma_giamgia, phan_tram, ngay_bat_dau, ngay_ket_thuc], (err, result) => {
        if (err) {
            console.error('Error adding voucher: ' + err.message);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        // Trả về thông báo thành công và ID của mã giảm giá mới
        res.status(201).json({ message: "Mã giảm giá đã được thêm thành công", id: result.insertId });
    });
});

  

module.exports = router;
