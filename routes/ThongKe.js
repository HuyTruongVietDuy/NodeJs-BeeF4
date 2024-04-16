const express = require('express');
const router = express.Router();
const db = require("../models/database");

router.get('/total', async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT SUM(total) FROM donhang WHERE tinh_trang = 3) AS totalDonHang,
                COUNT(*) AS totalSanPham,
                (SELECT COUNT(*) FROM danhmuc WHERE id_danhmuc_cha IS NOT NULL) AS totalDanhMuc,
                (SELECT COUNT(*) FROM nguoidung) AS totalNguoiDung,
                (SELECT COUNT(*) FROM quanlykho WHERE so_luong < 10) AS lowStockProducts
            FROM sanpham
        `;
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching total:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Trả về tổng của cả đơn hàng, số sản phẩm, số danh mục, số người dùng và số sản phẩm có số lượng dưới 10
                res.json(results[0]);
            }
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error fetching total:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
