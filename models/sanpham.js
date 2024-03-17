const express = require('express');
const router = express.Router();
const db = require("./database");
const multer = require('./multerConfig');
const fs = require('fs');
const path = require('path');

// Route to get the list of products with their corresponding category information
router.get('/list', async (req, res) => {
    try {
        const query = `
            SELECT SanPham.*, DanhMuc.id_danhmuc AS id_danhmuc, DanhMuc.ten_danhmuc AS ten_danhmuc
            FROM SanPham
            LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
        `;
        const sanPhamList = await db.queryPromise(query);
        res.status(200).json(sanPhamList);
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});

  
router.post('/them', multer.none(), async (req, res) => {
    const { ten_sanpham, id_Danhmuc, chatlieu } = req.body; // Receive chatlieu from request body
    try {
        // Thêm sản phẩm vào cơ sở dữ liệu với tên sản phẩm, id_Danhmuc, và chatlieu được cung cấp
        const result = await db.queryPromise('INSERT INTO sanpham (ten_sanpham, id_Danhmuc, chatlieu) VALUES (?, ?, ?)', [ten_sanpham, id_Danhmuc, chatlieu]);
        // Trả về thông báo thành công và thông tin sản phẩm mới được thêm vào
        res.status(201).json({ message: 'Thêm sản phẩm thành công', id_sanpham: result.insertId, ten_sanpham });
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý yêu cầu.' });
    }
});


router.delete('/xoa/:id', async (req, res) => {
    const id_sanpham = req.params.id; // Get product ID from request parameters
    try {
        // Xóa sản phẩm khỏi cơ sở dữ liệu với id_sanpham được cung cấp
        await db.queryPromise('DELETE FROM sanpham WHERE id_sanpham = ?', [id_sanpham]);
        res.status(200).json({ message: 'Xóa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý yêu cầu.' });
    }
});

router.put('/sua/:id', multer.none(), async (req, res) => {
    const id_sanpham = req.params.id; // Nhận ID sản phẩm từ tham số của yêu cầu
    const { ten_sanpham, id_Danhmuc, chatlieu, trang_thai } = req.body; // Nhận dữ liệu sản phẩm cần sửa từ phần thân của yêu cầu
    const time_update = new Date().toISOString(); // Lấy thời gian hiện tại

    try {
        // Thực hiện truy vấn để cập nhật thông tin sản phẩm trong cơ sở dữ liệu
        await db.queryPromise('UPDATE sanpham SET ten_sanpham = ?, id_Danhmuc = ?, chatlieu = ?, trang_thai = ?, time_update = ? WHERE id_sanpham = ?', [ten_sanpham, id_Danhmuc, chatlieu, trang_thai, time_update, id_sanpham]);
        // Trả về thông báo thành công
        res.status(200).json({ message: 'Sửa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý yêu cầu.' });
    }
});

module.exports = router;
