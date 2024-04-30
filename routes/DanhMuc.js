// routes/loaisanpham.js
const express = require('express');

const router = express.Router();
const db = require("../models/database");
const multer = require('../models/multerConfig');
const fs = require('fs');
const path = require('path');

// Cấu hình để phục vụ tệp tĩnh từ thư mục 'uploads'
router.use('/uploads', express.static('uploads'));

router.get('/list', (req, res) => {
    // Tạo câu lệnh SQL để lấy danh sách danh mục từ cơ sở dữ liệu
    const sql = `select id_danhmuc, ten_danhmuc, id_danhmuc_cha, hinhanh, trang_thai, url_category, time_add, time_update 
    from danhmuc 
    order by time_add desc; -- sắp xếp theo thời gian thêm mới nhất
    `;

    // Thực thi câu lệnh SQL
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn danh sách danh mục." });
        }
        
        // Trả về danh sách danh mục
        res.status(200).json({ success: true, danhMucList: result });
    });
});

router.get('/:url_Category', (req, res) => {
    // Trích xuất url_Category từ tham số URL
    const { url_Category } = req.params;

    // Tạo câu lệnh SQL để lấy danh sách danh mục từ cơ sở dữ liệu dựa trên url_Category
    const sql = `select id_danhmuc, ten_danhmuc, id_danhmuc_cha, hinhanh, trang_thai, url_category, time_add, time_update 
    from danhmuc as dm1
    where dm1.id_danhmuc_cha is not null 
    and exists (
        select 1 
        from danhmuc as dm2 
        where dm2.id_danhmuc_cha = dm1.id_danhmuc_cha 
        and dm2.id_danhmuc <> dm1.id_danhmuc
    );
    
    `;

    // Thực thi câu lệnh SQL với url_Category nhận được từ URL params
    db.query(sql, [url_Category], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn danh sách danh mục." });
        }
        
        // Trả về danh sách danh mục
        res.status(200).json({ success: true, danhMucList: result });
    });
});

// Sử dụng middleware upload.single() để xử lý tệp hình ảnh gửi lên
router.post('/them', multer.single('hinhanh'), (req, res) => {
    // Lấy thông tin từ request
    const { ten_danhmuc, id_danhmuc_cha, url_category } = req.body;
    const hinhanh = req.file ? req.file.filename : null;

    // Kiểm tra các trường bắt buộc
    if (!ten_danhmuc) {
        return res.status(400).json({ success: false, message: "Tên danh mục là bắt buộc." });
    }

    // Kiểm tra xem danh mục đã tồn tại chưa
    const checkExistQuery = `select * 
    from danhmuc 
    where ten_danhmuc = ?
    `;
    db.query(checkExistQuery, [ten_danhmuc], (checkErr, checkResult) => {
        if (checkErr) {
            console.error(checkErr);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi kiểm tra danh mục." });
        }

        if (checkResult.length > 0) {
            return res.status(400).json({ success: false, message: "Danh mục đã tồn tại." });
        }

        let sql;
        let values;
        if (id_danhmuc_cha) {
            sql = `insert into danhmuc (ten_danhmuc, id_danhmuc_cha, hinhanh, url_category) 
            values (?, ?, ?, ?)
            `;
            values = [ten_danhmuc, id_danhmuc_cha, hinhanh, url_category];
        } else {
            sql = `insert into danhmuc (ten_danhmuc, hinhanh, url_category) 
            values (?, ?, ?)
            `;
            values = [ten_danhmuc, hinhanh, url_category];
        }

        // Thực thi câu lệnh SQL để thêm mới danh mục
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thêm danh mục." });
            }
            // Trả về thông báo thành công
            res.status(200).json({ success: true, message: "Đã thêm danh mục thành công." });
        });
    });
});


// Xóa danh mục và hình ảnh của danh mục đó
router.delete('/xoa/:id', (req, res) => {
    const idDanhMuc = req.params.id;

    // Tạo câu lệnh SQL để lấy thông tin của danh mục cần xóa
    const sqlSelect = `select * 
    from danhmuc 
    where id_danhmuc = ?
    `;

    // Thực thi câu lệnh SQL để lấy thông tin của danh mục cần xóa
    db.query(sqlSelect, idDanhMuc, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn thông tin danh mục." });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy danh mục cần xóa." });
        }

        const hinhAnh = result[0].hinhanh;

        // Tạo câu lệnh SQL để xóa danh mục
        const sqlDelete = `delete from danhmuc 
        where id_danhmuc = ?
        `;

        // Thực thi câu lệnh SQL để xóa danh mục
        db.query(sqlDelete, idDanhMuc, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa danh mục." });
            }

            // Nếu có hình ảnh của danh mục, xóa hình ảnh đó
            if (hinhAnh) {
                const duongDanHinhAnh = path.join(__dirname, '../uploads', hinhAnh);
                fs.unlink(duongDanHinhAnh, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa hình ảnh của danh mục." });
                    }
                    res.status(200).json({ success: true, message: "Đã xóa danh mục và hình ảnh của danh mục thành công." });
                });
            } else {
                res.status(200).json({ success: true, message: "Đã xóa danh mục thành công." });
            }
        });
    });
});


router.get('/get/:id', (req, res) => {
    const categoryId = req.params.id;
    const selectOneSql = `select * 
    from danhmuc 
    where id_danhmuc = ?
    `;
    db.query(selectOneSql, [categoryId], (selectOneErr, result) => {
      if (selectOneErr) {
        return res.status(500).json({ "thong bao": "Lỗi truy vấn chi tiết danh mục", selectOneErr });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ "thong bao": "Không tìm thấy danh mục" });
      }
  
      res.status(200).json(result[0]);
    });
  });


  router.put('/sua/:id', multer.single('hinhanh'), (req, res) => {
    const categoryId = req.params.id;
    const { ten_danhmuc, id_danhmuc_cha, trang_thai, url_category } = req.body;
    const hinhanh = req.file ? req.file.filename : null;
    const timeUpdate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Lấy thời gian hiện tại

    // Kiểm tra các trường bắt buộc
    if (!ten_danhmuc || !trang_thai || !url_category) {
        return res.status(400).json({ success: false, message: "Tên danh mục, trạng thái và URL category là bắt buộc." });
    }

    // Tạo câu lệnh SQL để lấy thông tin của danh mục trước khi cập nhật
    const selectSql = `select hinhanh 
    from danhmuc 
    where id_danhmuc = ?
    `;
    db.query(selectSql, [categoryId], (selectErr, selectResult) => {
        if (selectErr) {
            console.error(selectErr);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu." });
        }

        let oldImage = null;
        if (selectResult.length > 0) {
            oldImage = selectResult[0].hinhanh;
        }

        // Tạo câu lệnh SQL để cập nhật thông tin của danh mục
        let sql;
        let values;
        if (hinhanh) {
            // Nếu người dùng cung cấp hình ảnh mới
            if (id_danhmuc_cha) {
                sql = `update danhmuc 
                set ten_danhmuc = ?, id_danhmuc_cha = ?, hinhanh = ?, trang_thai = ?, url_category = ?, time_update = now() 
                where id_danhmuc = ?
                `;
                values = [ten_danhmuc, id_danhmuc_cha, hinhanh, trang_thai, url_category, categoryId];
            } else {
                sql = `update danhmuc 
                set ten_danhmuc = ?, hinhanh = ?, trang_thai = ?, url_category = ?, time_update = now() 
                where id_danhmuc = ?
                `;
                values = [ten_danhmuc, hinhanh, trang_thai, url_category, categoryId];
            }
        } else {
            // Nếu người dùng không cung cấp hình ảnh mới
            if (id_danhmuc_cha) {
                sql = `update danhmuc 
                set ten_danhmuc = ?, id_danhmuc_cha = ?, trang_thai = ?, url_category = ?, time_update = now() 
                where id_danhmuc = ?
                `;
                values = [ten_danhmuc, id_danhmuc_cha, trang_thai, url_category, categoryId];
            } else {
                sql = `update danhmuc 
                set ten_danhmuc = ?, trang_thai = ?, url_category = ?, time_update = now() 
                where id_danhmuc = ?
                `;
                values = [ten_danhmuc, trang_thai, url_category, categoryId];
            }
        }

        // Thực thi câu lệnh SQL để cập nhật thông tin của danh mục
        db.query(sql, values, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi cập nhật danh mục." });
            }

            // Xóa hình ảnh cũ nếu có và đã cung cấp hình ảnh mới
            if (oldImage && hinhanh) {
                const oldImagePath = path.join(__dirname, '../uploads', oldImage);
                fs.unlink(oldImagePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(unlinkErr);
                    }
                    console.log(`Đã xóa hình ảnh cũ: ${oldImagePath}`);
                });
            }

            res.status(200).json({ success: true, message: "Đã cập nhật danh mục thành công." });
        });
    });
});



router.put('/updatestatus/:id_danhmuc', (req, res) => {
    const { id_danhmuc } = req.params;
    const { trang_thai } = req.body;

    // Check if the status value is valid (1 or 2)
    if (trang_thai !== 1 && trang_thai !== 2) {
        return res.status(400).json({ "thông_báo": "Trạng thái không hợp lệ" });
    }

    // Update the status of the article in the database
    const query = `UPDATE danhmuc SET trang_thai = ? WHERE id_danhmuc = ?`;
    db.query(query, [trang_thai, id_danhmuc], (err, result) => {
        if (err) {
            console.error("Lỗi khi cập nhật trạng thái của bài viết:", err);
            return res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi cập nhật trạng thái" });
        }
        console.log("Trạng thái của bài viết đã được cập nhật thành công");
        res.status(200).json({ "thông_báo": "Trạng thái của bài viết đã được cập nhật" });
    });
});
  
module.exports = router;
