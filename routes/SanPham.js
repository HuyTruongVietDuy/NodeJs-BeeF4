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
        select sanpham.*, danhmuc.id_danhmuc as id_danhmuc, danhmuc.ten_danhmuc as ten_danhmuc
        from sanpham
        left join danhmuc on sanpham.id_danhmuc = danhmuc.id_danhmuc
        
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
        select sanpham.*, danhmuc.id_danhmuc as id_danhmuc, danhmuc.ten_danhmuc as ten_danhmuc
        from sanpham
        left join danhmuc on sanpham.id_danhmuc = danhmuc.id_danhmuc
        where danhmuc.id_danhmuc = ?
        
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
        select 
        sanpham.*, 
        danhmuc.id_danhmuc as id_danhmuc, 
        danhmuc.ten_danhmuc as ten_danhmuc, 
        chitietsanpham.*, 
        mausanpham.id_mau, 
        mausanpham.ten_mau,
        mausanpham.ma_mau,
        mausanpham.hinh_anh_1,
        mausanpham.hinh_anh_2,
        mausanpham.hinh_anh_3,
        mausanpham.hinh_anh_4,
        mausanpham.hinh_anh_5,
        mausanpham.hinh_anh_6,
        sum(quanlykho.so_luong) as tong_so_luong,
        sanphamyeuthich.id,
        sanphamyeuthich.id_user
    from sanpham
    left join danhmuc on sanpham.id_danhmuc = danhmuc.id_danhmuc
    left join chitietsanpham on sanpham.id_sanpham = chitietsanpham.id_sanpham
    left join mausanpham on chitietsanpham.id_chitietsp = mausanpham.id_chitietsp
    left join quanlykho on chitietsanpham.id_chitietsp = quanlykho.id_chitietsp
    left join sanphamyeuthich on sanpham.id_sanpham = sanphamyeuthich.id_sanpham
    group by sanpham.id_sanpham
    order by sanpham.time_add desc
    limit 8
    
    
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
        select 
    sanpham.*, 
    danhmuc.id_danhmuc as id_danhmuc, 
    danhmuc.ten_danhmuc as ten_danhmuc, 
    chitietsanpham.*, 
    mausanpham.id_mau, 
    mausanpham.ten_mau,
    mausanpham.ma_mau,
    mausanpham.hinh_anh_1,
    mausanpham.hinh_anh_2,
    mausanpham.hinh_anh_3,
    mausanpham.hinh_anh_4,
    mausanpham.hinh_anh_5,
    mausanpham.hinh_anh_6,
    sum(quanlykho.so_luong) as tong_so_luong,
    sanphamyeuthich.id,
    sanphamyeuthich.id_user
from sanpham
left join danhmuc on sanpham.id_danhmuc = danhmuc.id_danhmuc
left join chitietsanpham on sanpham.id_sanpham = chitietsanpham.id_sanpham
left join mausanpham on chitietsanpham.id_chitietsp = mausanpham.id_chitietsp
left join quanlykho on chitietsanpham.id_chitietsp = quanlykho.id_chitietsp
left join sanphamyeuthich on sanpham.id_sanpham = sanphamyeuthich.id_sanpham
group by sanpham.id_sanpham
order by sanpham.time_add desc

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
        const queryGetIdDanhMuc = `SELECT id_danhmuc FROM danhmuc WHERE url_category = ?`;
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
        select 
        sanpham.*, 
        danhmuc.id_danhmuc as id_danhmuc, 
        danhmuc.ten_danhmuc as ten_danhmuc, 
        chitietsanpham.*, 
        mausanpham.id_mau, 
        mausanpham.ten_mau,
        mausanpham.ma_mau,
        mausanpham.hinh_anh_1,
        mausanpham.hinh_anh_2,
        mausanpham.hinh_anh_3,
        mausanpham.hinh_anh_4,
        mausanpham.hinh_anh_5,
        mausanpham.hinh_anh_6,
        sum(quanlykho.so_luong) as tong_so_luong,
        sanphamyeuthich.id,
        sanphamyeuthich.id_user
    from sanpham
    left join danhmuc on sanpham.id_danhmuc = danhmuc.id_danhmuc
    left join chitietsanpham on sanpham.id_sanpham = chitietsanpham.id_sanpham
    left join mausanpham on chitietsanpham.id_chitietsp = mausanpham.id_chitietsp
    left join quanlykho on chitietsanpham.id_chitietsp = quanlykho.id_chitietsp
    left join sanphamyeuthich on sanpham.id_sanpham = sanphamyeuthich.id_sanpham
    where (danhmuc.id_danhmuc = ? or danhmuc.id_danhmuc_cha = ?)
    group by sanpham.id_sanpham
    order by sanpham.time_add desc
    

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
        select 
        sanpham.*, 
        danhmuc.id_danhmuc as id_danhmuc, 
        danhmuc.ten_danhmuc as ten_danhmuc, 
        chitietsanpham.*, 
        mausanpham.id_mau, 
        mausanpham.ten_mau,
        mausanpham.ma_mau,
        mausanpham.hinh_anh_1,
        mausanpham.hinh_anh_2,
        mausanpham.hinh_anh_3,
        mausanpham.hinh_anh_4,
        mausanpham.hinh_anh_5,
        mausanpham.hinh_anh_6,
        sum(quanlykho.so_luong) as tong_so_luong,
        sanphamyeuthich.id,
        sanphamyeuthich.id_user
    from sanpham
    left join danhmuc on sanpham.id_danhmuc = danhmuc.id_danhmuc
    left join chitietsanpham on sanpham.id_sanpham = chitietsanpham.id_sanpham
    left join mausanpham on chitietsanpham.id_chitietsp = mausanpham.id_chitietsp
    left join quanlykho on chitietsanpham.id_chitietsp = quanlykho.id_chitietsp
    left join sanphamyeuthich on sanpham.id_sanpham = sanphamyeuthich.id_sanpham
    where sanphamyeuthich.id_user = ?
    group by sanpham.id_sanpham
    order by sanpham.time_add desc
    
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
        select *
        from mausanpham
        where id_chitietsp in (
            select id_chitietsp
            from chitietsanpham
            where id_sanpham = ?
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
        select *
        from mausanpham
        where id_chitietsp in (
            select id_chitietsp
            from chitietsanpham
            where id_sanpham in (
                select id_sanpham
                from sanpham
                where url_product = ?
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
        select q.*, s.ten_size
        from quanlykho q
        inner join sizesanpham s on q.id_size = s.id_size
        where q.id_chitietsp = ?
        
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
        const result = await db.queryPromise(`insert into sanpham (ten_sanpham, id_danhmuc, chatlieu, mota, kieu_dang, url_product) 
        values (?, ?, ?, ?, ?, ?)
        `, [ten_sanpham, id_Danhmuc, chatlieu, mota, kieu_dang, url_product]);
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
        await db.queryPromise(`update sanpham 
        set ten_sanpham = ?, id_danhmuc = ?, chatlieu = ?, trang_thai = ?, mota = ?, kieu_dang = ?, url_product = ?, time_update = ? 
        where id_sanpham = ?
        `, 
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