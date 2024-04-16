const express = require('express');
const router = express.Router();
const db = require("../models/database");
const multer = require('../models/multerConfig');
const fs = require('fs');
const path = require('path');
router.use('/uploads', express.static('uploads'));
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

router.get('/list/:categoryId', async (req, res) => {
    const categoryId = req.params.categoryId; // Lấy categoryId từ URL
    try {
        const query = `
            SELECT SanPham.*, DanhMuc.id_danhmuc AS id_danhmuc, DanhMuc.ten_danhmuc AS ten_danhmuc
            FROM SanPham
            LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
            WHERE DanhMuc.id_danhmuc = ?
        `;
        const sanPhamList = await db.queryPromise(query, [categoryId]);
        res.status(200).json(sanPhamList);
    } catch (error) {
        console.error('Error fetching product list by category:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});


router.get('/listnew', async (req, res) => {
    try {
        const query = `
        SELECT 
            SanPham.*, 
            DanhMuc.id_danhmuc AS id_danhmuc, 
            DanhMuc.ten_danhmuc AS ten_danhmuc, 
            ChiTietSanPham.*, 
            MauSanPham.id_mau, 
            MauSanPham.ten_mau,
            MauSanPham.Ma_mau,
            MauSanPham.hinh_anh_1,
            MauSanPham.hinh_anh_2,
            MauSanPham.hinh_anh_3,
            MauSanPham.hinh_anh_4,
            MauSanPham.hinh_anh_5,
            MauSanPham.hinh_anh_6,
            SUM(QuanLyKho.so_luong) AS tong_so_luong,
            sanphamyeuthich.id,
            sanphamyeuthich.id_user
        FROM SanPham
        LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
        LEFT JOIN (
            SELECT *
            FROM ChiTietSanPham
            GROUP BY id_sanpham
            LIMIT 8
        ) AS ChiTietSanPham ON SanPham.id_sanpham = ChiTietSanPham.id_sanpham
        LEFT JOIN MauSanPham ON ChiTietSanPham.id_chitietsp = MauSanPham.id_chitietsp
        LEFT JOIN QuanLyKho ON ChiTietSanPham.id_chitietsp = QuanLyKho.id_chitietsp
        LEFT JOIN sanphamyeuthich ON SanPham.id_sanpham = sanphamyeuthich.id_sanpham
        GROUP BY SanPham.id_sanpham
        ORDER BY SanPham.time_add DESC
        `;
        const sanPhamList = await db.queryPromise(query);
        res.status(200).json(sanPhamList);
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});


router.get('/listall', async (req, res) => {
    try {
        const query = `
        SELECT 
            SanPham.*, 
            DanhMuc.id_danhmuc AS id_danhmuc, 
            DanhMuc.ten_danhmuc AS ten_danhmuc, 
            ChiTietSanPham.*, 
            MauSanPham.id_mau, 
            MauSanPham.ten_mau,
            MauSanPham.Ma_mau,
            MauSanPham.hinh_anh_1,
            MauSanPham.hinh_anh_2,
            MauSanPham.hinh_anh_3,
            MauSanPham.hinh_anh_4,
            MauSanPham.hinh_anh_5,
            MauSanPham.hinh_anh_6,
            SUM(QuanLyKho.so_luong) AS tong_so_luong,
            sanphamyeuthich.id,
            sanphamyeuthich.id_user
        FROM SanPham
        LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
        LEFT JOIN ChiTietSanPham ON SanPham.id_sanpham = ChiTietSanPham.id_sanpham
        LEFT JOIN MauSanPham ON ChiTietSanPham.id_chitietsp = MauSanPham.id_chitietsp
        LEFT JOIN QuanLyKho ON ChiTietSanPham.id_chitietsp = QuanLyKho.id_chitietsp
        LEFT JOIN sanphamyeuthich ON SanPham.id_sanpham = sanphamyeuthich.id_sanpham
        GROUP BY SanPham.id_sanpham
        ORDER BY SanPham.time_add DESC
        `;
        const sanPhamList = await db.queryPromise(query);
        res.status(200).json(sanPhamList);
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});

router.get('/:url_category', async (req, res) => {
    try {
        const url_category = req.params.url_category;
        
        // Truy vấn cơ sở dữ liệu để lấy id_danhmuc tương ứng với url_category
        const queryGetIdDanhMuc = `SELECT id_danhmuc FROM DanhMuc WHERE url_category = ?`;
        const result = await db.queryPromise(queryGetIdDanhMuc, [url_category]);

        let id_danhmuc = null;

        if (result.length === 0) {
            // Nếu không tìm thấy url_category trong cơ sở dữ liệu, trả về lỗi 404
            return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        } else {
            id_danhmuc = result[0].id_danhmuc;
        }

        // Sửa câu truy vấn SQL để lấy sản phẩm của id_danhmuc hoặc các danh mục con
        const query = `
        SELECT 
    SanPham.*, 
    DanhMuc.id_danhmuc AS id_danhmuc, 
    DanhMuc.ten_danhmuc AS ten_danhmuc, 
    ChiTietSanPham.*, 
    MauSanPham.id_mau, 
    MauSanPham.ten_mau,
    MauSanPham.Ma_mau,
    MauSanPham.hinh_anh_1,
    MauSanPham.hinh_anh_2,
    MauSanPham.hinh_anh_3,
    MauSanPham.hinh_anh_4,
    MauSanPham.hinh_anh_5,
    MauSanPham.hinh_anh_6,
    SUM(QuanLyKho.so_luong) AS tong_so_luong,
    sanphamyeuthich.id,
    sanphamyeuthich.id_user
FROM SanPham
LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
LEFT JOIN ChiTietSanPham ON SanPham.id_sanpham = ChiTietSanPham.id_sanpham
LEFT JOIN MauSanPham ON ChiTietSanPham.id_chitietsp = MauSanPham.id_chitietsp
LEFT JOIN QuanLyKho ON ChiTietSanPham.id_chitietsp = QuanLyKho.id_chitietsp
LEFT JOIN sanphamyeuthich ON SanPham.id_sanpham = sanphamyeuthich.id_sanpham
WHERE (DanhMuc.id_danhmuc = ? OR DanhMuc.id_danhmuc_cha = ?)
GROUP BY SanPham.id_sanpham
ORDER BY SanPham.time_add DESC

        `;
        
        const sanPhamList = await db.queryPromise(query, [id_danhmuc, id_danhmuc]);
        res.status(200).json(sanPhamList);
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý yêu cầu.' });
    }
});

router.get('/listfavorites/:id_user', async (req, res) => {
    const { id_user } = req.params;
    try {
        const query = `
        SELECT 
            SanPham.*, 
            DanhMuc.id_danhmuc AS id_danhmuc, 
            DanhMuc.ten_danhmuc AS ten_danhmuc, 
            ChiTietSanPham.*, 
            MauSanPham.id_mau, 
            MauSanPham.ten_mau,
            MauSanPham.Ma_mau,
            MauSanPham.hinh_anh_1,
            MauSanPham.hinh_anh_2,
            MauSanPham.hinh_anh_3,
            MauSanPham.hinh_anh_4,
            MauSanPham.hinh_anh_5,
            MauSanPham.hinh_anh_6,
            SUM(QuanLyKho.so_luong) AS tong_so_luong,
            sanphamyeuthich.id,
            sanphamyeuthich.id_user
        FROM SanPham
        LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
        LEFT JOIN ChiTietSanPham ON SanPham.id_sanpham = ChiTietSanPham.id_sanpham
        LEFT JOIN MauSanPham ON ChiTietSanPham.id_chitietsp = MauSanPham.id_chitietsp
        LEFT JOIN QuanLyKho ON ChiTietSanPham.id_chitietsp = QuanLyKho.id_chitietsp
        LEFT JOIN sanphamyeuthich ON SanPham.id_sanpham = sanphamyeuthich.id_sanpham
        WHERE sanphamyeuthich.id_user = ?
        GROUP BY SanPham.id_sanpham
        ORDER BY SanPham.time_add DESC
        `;
        const sanPhamFavorites = await db.queryPromise(query, [id_user]);
        res.status(200).json(sanPhamFavorites);
    } catch (error) {
        console.error('Error fetching favorite product list:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});




router.get('/colors/:id_sanpham', async (req, res) => {
    const { id_sanpham } = req.params;

    try {
        const query = `
            SELECT *
            FROM MauSanPham
            WHERE id_chitietsp IN (
                SELECT id_chitietsp
                FROM chitietsanpham
                WHERE id_sanpham = ?
            )
        `;
        const colors = await db.queryPromise(query, [id_sanpham]);
        res.status(200).json(colors);
    } catch (error) {
        console.error('Error fetching product colors:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});

router.get('/colors-ct/:url_product', async (req, res) => {
    const { url_product } = req.params;

    try {
        const query = `
            SELECT *
            FROM MauSanPham
            WHERE id_chitietsp IN (
                SELECT id_chitietsp
                FROM ChiTietSanPham
                WHERE id_sanpham IN (
                    SELECT id_sanpham
                    FROM SanPham
                    WHERE url_product = ?
                )
            )
        `;
        const colors = await db.queryPromise(query, [url_product]);
        res.status(200).json(colors);
    } catch (error) {
        console.error('Error fetching product colors:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});


router.get('/sizes/:id_chitietsp', async (req, res) => {
    const { id_chitietsp } = req.params;

    try {
        const query = `
            SELECT q.*, s.ten_size
            FROM quanlykho q
            INNER JOIN sizesanpham s ON q.id_size = s.id_size
            WHERE q.id_chitietsp = ?;
        `;
        const sizes = await db.queryPromise(query, [id_chitietsp]);
        res.status(200).json(sizes);
    } catch (error) {
        console.error('Error fetching product sizes:', error);
        res.status(500).json({ message: 'An error occurred while processing the request.' });
    }
});




router.post('/them', multer.none(), async (req, res) => {
    const { ten_sanpham, id_Danhmuc, chatlieu, mota, kieu_dang, url_product } = req.body; // Receive additional fields from request body
    try {
        // Thêm sản phẩm vào cơ sở dữ liệu với tên sản phẩm, id_Danhmuc, chatlieu, mota, kieu_dang, và url_product được cung cấp
        const result = await db.queryPromise('INSERT INTO sanpham (ten_sanpham, id_Danhmuc, chatlieu, mota, kieu_dang, url_product) VALUES (?, ?, ?, ?, ?, ?)', [ten_sanpham, id_Danhmuc, chatlieu, mota, kieu_dang, url_product]);
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
    const id_sanpham = req.params.id; // Receive product ID from request parameters
    const { ten_sanpham, id_Danhmuc, chatlieu, trang_thai, mota, kieu_dang, url_product } = req.body; // Receive product data from request body
    const time_update = new Date().toISOString(); // Get current time

    try {
        // Execute a query to update product information in the database
        await db.queryPromise('UPDATE sanpham SET ten_sanpham = ?, id_Danhmuc = ?, chatlieu = ?, trang_thai = ?, mota = ?, kieu_dang = ?, url_product = ?, time_update = ? WHERE id_sanpham = ?', 
        [ten_sanpham, id_Danhmuc, chatlieu, trang_thai, mota, kieu_dang, url_product, time_update, id_sanpham]);
        
        // Return success message
        res.status(200).json({ message: 'Sửa sản phẩm thành công' });
    } catch (error) {
        console.error('Lỗi khi sửa sản phẩm:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý yêu cầu.' });
    }
});

// Route to update the status of an article
router.put('/updatestatus/:id_sanpham', (req, res) => {
    const { id_sanpham } = req.params;
    const { trang_thai } = req.body;

    // Check if the status value is valid (1 or 2)
    if (trang_thai !== 1 && trang_thai !== 2) {
        return res.status(400).json({ "thông_báo": "Trạng thái không hợp lệ" });
    }

    // Update the status of the article in the database
    const query = `UPDATE sanpham SET trang_thai = ? WHERE id_sanpham = ?`;
    db.query(query, [trang_thai, id_sanpham], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật trạng thái của bài viết:", err);
            return res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi cập nhật trạng thái" });
        }
        console.log("Trạng thái của bài viết đã được cập nhật thành công");
        res.status(200).json({ "thông_báo": "Trạng thái của bài viết đã được cập nhật" });
    });
});


module.exports = router;