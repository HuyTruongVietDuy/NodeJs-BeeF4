const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require("../models/database");
const multer = require('../models/multerConfig');

router.use('/uploads', express.static('uploads'));
// Route để lấy hết dữ liệu từ bảng người dùng
router.get('/listbaiviet', (req, res) => {
    // Truy vấn để lấy hết dữ liệu từ bảng người dùng
    const query = `SELECT * FROM baiviet`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Lỗi khi truy vấn dữ liệu từ bảng bài viết:", err);
            res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi lấy dữ liệu bài viết" });
        } else {
            console.log("Dữ liệu bài viết đã được truy vấn thành công");
            res.status(200).json(results);
        }
    });
});


router.post('/addbaiviet', multer.single('hinhanh'), (req, res) => {
    const { tieude, textare, url_baiviet } = req.body;
    const hinhanh = req.file ? req.file.filename : null; // Lấy tên file hình ảnh sau khi upload

    // Kiểm tra xem các trường thông tin có được cung cấp không
    if (!tieude || !textare || !url_baiviet) {
        return res.status(400).json({ "thông_báo": "Vui lòng cung cấp đầy đủ thông tin cho bài viết mới" });
    }

    // Truy vấn để thêm bài viết mới vào cơ sở dữ liệu
    const query = `INSERT INTO baiviet (tieude, hinhanh, textare, url_baiviet) VALUES (?, ?, ?, ?)`;
    db.query(query, [tieude, hinhanh, textare, url_baiviet], (err, result) => {
        if (err) {
            console.error("Lỗi khi thêm bài viết mới vào cơ sở dữ liệu:", err);
            return res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi thêm bài viết mới" });
        }
        console.log("Bài viết mới đã được thêm vào cơ sở dữ liệu thành công");
        res.status(201).json({ "thông_báo": "Bài viết mới đã được thêm vào cơ sở dữ liệu" });
    });
});



router.put('/editbaiviet/:id_baiviet', multer.single('hinhanh'), (req, res) => {
    const { tieude, textare, url_baiviet } = req.body; 
    let hinhanh = null; // Khởi tạo giá trị mặc định của hình ảnh là null
    if (req.file) {
        hinhanh = req.file.filename; // Lấy tên file hình ảnh sau khi upload nếu tồn tại
    }
    const id_baiviet = req.params.id_baiviet;

    if (!tieude || !textare) {
        return res.status(400).json({ "thông_báo": "Vui lòng cung cấp đầy đủ thông tin cho việc sửa bài viết" });
    }

    // Xóa hình ảnh cũ nếu có
    if (hinhanh) {
        // Lấy thông tin về bài viết cũ
        db.query(`SELECT hinhanh FROM baiviet WHERE id_baiviet = ?`, [id_baiviet], (err, result) => {
            if (err) {
                console.error("Lỗi khi truy vấn cơ sở dữ liệu:", err);
                return res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi cập nhật bài viết" });
            }
            const oldImage = result[0].hinhanh;
            if (oldImage) {
                // Xóa hình ảnh cũ
                fs.unlink(path.join(__dirname, '../uploads/', oldImage), (err) => {
                    if (err) {
                        console.error("Lỗi khi xóa hình ảnh cũ:", err);
                    }
                });
            }
        });
    }

    // Truy vấn để cập nhật bài viết trong cơ sở dữ liệu
    let query;
    let params;
    if (hinhanh) {
        query = `UPDATE baiviet SET tieude = ?, hinhanh = ?, textare = ?, url_baiviet = ?, time_update = NOW() WHERE id_baiviet = ?`;
        params = [tieude, hinhanh, textare, url_baiviet, id_baiviet];
    } else {
        query = `UPDATE baiviet SET tieude = ?, textare = ?, url_baiviet = ?, time_update = NOW() WHERE id_baiviet = ?`;
        params = [tieude, textare, url_baiviet, id_baiviet];
    }

    db.query(query, params, (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật bài viết trong cơ sở dữ liệu:", err);
            return res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi cập nhật bài viết" });
        }
        console.log("Bài viết đã được cập nhật thành công");
        res.status(200).json({ "thông_báo": "Bài viết đã được cập nhật" });
    });
});



// Route để lấy thông tin của một bài viết dựa trên id_baiviet
router.get('/:id_baiviet', (req, res) => {
    const id_baiviet = req.params.id_baiviet;

    // Truy vấn để lấy thông tin của bài viết từ cơ sở dữ liệu dựa trên id_baiviet
    const query = `SELECT * FROM baiviet WHERE id_baiviet = ?`;
    db.query(query, [id_baiviet], (err, result) => {
        if (err) {
            console.error("Lỗi khi lấy thông tin của bài viết từ cơ sở dữ liệu:", err);
            return res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi lấy thông tin của bài viết" });
        }

        if (result.length === 0) {
            return res.status(404).json({ "thông_báo": "Không tìm thấy bài viết" });
        }

        const baiviet = result[0];
        res.status(200).json(baiviet);
    });
});

// Route để lấy thông tin của một bài viết dựa trên url_baiviet
router.get('/url/:url_baiviet', (req, res) => {
    const url_baiviet = req.params.url_baiviet;
  
    // Truy vấn để lấy thông tin của bài viết từ cơ sở dữ liệu dựa trên url_baiviet
    const query = `SELECT * FROM baiviet WHERE url_baiviet = ?`;
    db.query(query, [url_baiviet], (err, result) => {
        if (err) {
            console.error("Lỗi khi lấy thông tin của bài viết từ cơ sở dữ liệu:", err);
            return res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi lấy thông tin của bài viết" });
        }

        if (result.length === 0) {
            return res.status(404).json({ "thông_báo": "Không tìm thấy bài viết" });
        }

        const baiviet = result[0];
        res.status(200).json(baiviet);
    });
});

router.delete('/delete/:id_baiviet', (req, res) => {
    const id_baiviet = req.params.id_baiviet;

    // Query to fetch the filename of the image associated with the article
    const getImageQuery = `SELECT hinhanh FROM baiviet WHERE id_baiviet = ?`;
    db.query(getImageQuery, [id_baiviet], (getImageErr, getImageResult) => {
        if (getImageErr) {
            console.error("Error fetching image filename:", getImageErr);
            return res.status(500).json({ "thông_báo": "An error occurred while fetching image filename" });
        }

        // If there's an image associated with the article, delete it
        const oldImage = getImageResult[0].hinhanh;
        if (oldImage) {
            fs.unlink(path.join(__dirname, `../uploads/${oldImage}`), (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting image file:", unlinkErr);
                }
            });
        }

        // Query to delete the article from the database based on id_baiviet
        const deleteArticleQuery = `DELETE FROM baiviet WHERE id_baiviet = ?`;
        db.query(deleteArticleQuery, [id_baiviet], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error("Error deleting article from the database:", deleteErr);
                return res.status(500).json({ "thông_báo": "An error occurred while deleting the article" });
            }

            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ "thông_báo": "Article not found" });
            }

            res.status(200).json({ "thông_báo": "Article has been deleted successfully" });
        });
    });
});


// Route to update the status of an article
router.put('/updatestatus/:id_baiviet', (req, res) => {
    const { id_baiviet } = req.params;
    const { trang_thai } = req.body;

    // Check if the status value is valid (1 or 2)
    if (trang_thai !== 1 && trang_thai !== 2) {
        return res.status(400).json({ "thông_báo": "Trạng thái không hợp lệ" });
    }

    // Update the status of the article in the database
    const query = `UPDATE baiviet SET trang_thai = ? WHERE id_baiviet = ?`;
    db.query(query, [trang_thai, id_baiviet], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật trạng thái của bài viết:", err);
            return res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi cập nhật trạng thái" });
        }
        console.log("Trạng thái của bài viết đã được cập nhật thành công");
        res.status(200).json({ "thông_báo": "Trạng thái của bài viết đã được cập nhật" });
    });
});

module.exports = router;
