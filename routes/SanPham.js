const express = require('express');
const router = express.Router();
const db = require("../models/database");
const multer = require('../models/multerConfig');
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
            SUM(QuanLyKho.so_luong) AS tong_so_luong
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
            SUM(QuanLyKho.so_luong) AS tong_so_luong
        FROM SanPham
        LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
        LEFT JOIN ChiTietSanPham ON SanPham.id_sanpham = ChiTietSanPham.id_sanpham
        LEFT JOIN MauSanPham ON ChiTietSanPham.id_chitietsp = MauSanPham.id_chitietsp
        LEFT JOIN QuanLyKho ON ChiTietSanPham.id_chitietsp = QuanLyKho.id_chitietsp
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

router.get('/listdanhmucha/:url_category', async (req, res) => {
    try {
        const url_category = req.params.url_category;
        
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
                SUM(QuanLyKho.so_luong) AS tong_so_luong
            FROM SanPham
            LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
            LEFT JOIN ChiTietSanPham ON SanPham.id_sanpham = ChiTietSanPham.id_sanpham
            LEFT JOIN MauSanPham ON ChiTietSanPham.id_chitietsp = MauSanPham.id_chitietsp
            LEFT JOIN QuanLyKho ON ChiTietSanPham.id_chitietsp = QuanLyKho.id_chitietsp
            WHERE DanhMuc.id_danhmuc_cha = (SELECT id_danhmuc FROM DanhMuc WHERE url_category = ?)
            GROUP BY SanPham.id_sanpham
            ORDER BY SanPham.time_add DESC
        `;
        
        const sanPhamList = await db.queryPromise(query, [url_category]);
        res.status(200).json(sanPhamList);
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý yêu cầu.' });
    }
});

router.get('/listdanhmuccon/:url_category_con', async (req, res) => {
    try {
        const url_category = req.params.url_category_con;

        const query = `
            SELECT 
                id_danhmuc
            FROM DanhMuc
            WHERE url_category = ?
        `;

        const danhMuc = await db.queryPromise(query, [url_category]);

        if (danhMuc.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục.' });
        }

        const id_danhmuc = danhMuc[0].id_danhmuc;

        const productQuery = `
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
                SUM(QuanLyKho.so_luong) AS tong_so_luong
            FROM SanPham
            LEFT JOIN DanhMuc ON SanPham.id_danhmuc = DanhMuc.id_danhmuc
            LEFT JOIN ChiTietSanPham ON SanPham.id_sanpham = ChiTietSanPham.id_sanpham
            LEFT JOIN MauSanPham ON ChiTietSanPham.id_chitietsp = MauSanPham.id_chitietsp
            LEFT JOIN QuanLyKho ON ChiTietSanPham.id_chitietsp = QuanLyKho.id_chitietsp
            WHERE SanPham.id_danhmuc = ?
            GROUP BY SanPham.id_sanpham
            ORDER BY SanPham.time_add DESC
        `;

        const sanPhamList = await db.queryPromise(productQuery, [id_danhmuc]);
        res.status(200).json(sanPhamList);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.status(500).json({ message: 'Đã xảy ra lỗi khi xử lý yêu cầu.' });
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
                FROM ChiTietSanPham
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
router.get('/sizes/:id_chitietsp', async (req, res) => {
    const { id_chitietsp } = req.params;

    try {
        const query = `
            SELECT QLK.*, SS.ten_size
            FROM quanlykho AS QLK
            INNER JOIN SizeSanPham AS SS ON QLK.id_size = SS.id_size
            WHERE QLK.id_chitietsp = ?
        `;
        const sizes = await db.queryPromise(query, [id_chitietsp]);
        res.status(200).json(sizes);
    } catch (error) {
        console.error('Error fetching product sizes:', error);
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