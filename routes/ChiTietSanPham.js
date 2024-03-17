
const express = require('express');
const router = express.Router();
const db = require("../models/database");
const multer = require('../models/multerConfig');
const fs = require('fs');
const path = require('path');

// Cấu hình để phục vụ tệp tĩnh từ thư mục 'uploads'
router.use('/uploads', express.static('uploads'));


router.get('/list/:id_sanpham', (req, res) => {
    const productId = req.params.id_sanpham;
  
    // SQL query to retrieve product details along with product name, sorted by id_mau
    const sql = `
        SELECT 
            chitietsanpham.*, 
            MauSanPham.ten_mau, 
            MauSanPham.ma_mau, 
            MauSanPham.id_mau,
            MauSanPham.hinh_anh_1,
            MauSanPham.hinh_anh_2,
            MauSanPham.hinh_anh_3,
            MauSanPham.hinh_anh_4,
            MauSanPham.hinh_anh_5,
            MauSanPham.hinh_anh_6,
            sanpham.ten_sanpham 
        FROM 
            chitietsanpham 
        LEFT JOIN 
            MauSanPham ON chitietsanpham.id_chitietsp = MauSanPham.id_chitietsp
        LEFT JOIN 
            sanpham ON chitietsanpham.id_sanpham = sanpham.id_sanpham
        WHERE 
            chitietsanpham.id_sanpham = ${productId}
        ORDER BY
            MauSanPham.id_mau`; // Sắp xếp kết quả theo id_mau
  
    // Execute the SQL query
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn chi tiết sản phẩm." });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm với ID đã cung cấp." });
        }
  
        // Return all product details along with the product name
        res.status(200).json({ success: true, productDetails: result });
    });
});



  
  

router.post('/add', (req, res) => {
    const { id_sanpham, gia, gia_khuyenmai, ten_mau, ma_mau } = req.body; // Lấy dữ liệu từ body request
  
    // Tạo câu lệnh SQL để thêm chi tiết sản phẩm vào cơ sở dữ liệu
    const sql = `
        INSERT INTO ChiTietSanPham (id_sanpham, gia, gia_khuyenmai) 
        VALUES (?, ?, ?);
    `;
    const values = [id_sanpham, gia, gia_khuyenmai]; // Giá trị truyền vào câu lệnh SQL

    // Thực thi câu lệnh SQL
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thêm chi tiết sản phẩm." });
        }
        
        const id_chitietsp = result.insertId; // Lấy id của chi tiết sản phẩm vừa được thêm vào

        // Tiếp tục thêm dữ liệu vào bảng MauSanPham
        const mauSql = `
            INSERT INTO MauSanPham (ten_mau, ma_mau, id_chitietsp) 
            VALUES (?, ?, ?);
        `;
        const mauValues = [ten_mau, ma_mau, id_chitietsp]; // Giá trị truyền vào câu lệnh SQL

        // Thực thi câu lệnh SQL thêm màu sản phẩm
        db.query(mauSql, mauValues, (err, mauResult) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thêm màu sản phẩm." });
            }

            // Trả về thông báo thành công nếu không có lỗi
            res.status(200).json({ success: true, message: "Sản phẩm và màu sản phẩm đã được thêm mới thành công." });
        });
    });
});


router.put('/edit/:id_chitietsp', (req, res) => {
    const { id_chitietsp } = req.params; // Lấy id của chi tiết sản phẩm cần sửa
    const { gia, gia_khuyenmai, ten_mau, ma_mau } = req.body; // Lấy dữ liệu mới từ body request

    // Tạo câu lệnh SQL để sửa chi tiết sản phẩm trong cơ sở dữ liệu
    const sql = `UPDATE chitietsanpham 
                 LEFT JOIN MauSanPham ON chitietsanpham.id_chitietsp = MauSanPham.id_chitietsp
                 SET chitietsanpham.gia = ?, chitietsanpham.gia_khuyenmai = ?, MauSanPham.ten_mau = ?, MauSanPham.ma_mau = ?
                 WHERE chitietsanpham.id_chitietsp = ?`;
    const values = [gia, gia_khuyenmai, ten_mau, ma_mau, id_chitietsp]; // Giá trị truyền vào câu lệnh SQL

    // Thực thi câu lệnh SQL
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi sửa chi tiết sản phẩm." });
        }

        // Kiểm tra xem có bản ghi nào được sửa không
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chi tiết sản phẩm cần sửa." });
        }

        // Trả về thông báo thành công nếu không có lỗi
        res.status(200).json({ success: true, message: "Chi tiết sản phẩm đã được sửa thành công." });
    });
});

router.delete('/delete/:id_chitietsp', (req, res) => {
    const { id_chitietsp } = req.params; // Lấy id của chi tiết sản phẩm cần xóa

    // Tạo câu lệnh SQL để lấy đường dẫn các tệp hình ảnh liên quan
    const sqlSelectImages = `SELECT hinh_anh_1, hinh_anh_2, hinh_anh_3, hinh_anh_4, hinh_anh_5, hinh_anh_6 FROM MauSanPham WHERE id_chitietsp = ?`;

    db.query(sqlSelectImages, [id_chitietsp], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn cơ sở dữ liệu." });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy chi tiết sản phẩm cần xóa." });
        }

        // Lấy đường dẫn các tệp hình ảnh
        const imagePaths = Object.values(results[0]);

        // Xóa các tệp hình ảnh từ hệ thống tệp
        imagePaths.forEach(imagePath => {
            if (imagePath) {
                fs.unlink(imagePath, err => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });

        // Tiến hành xóa chi tiết sản phẩm từ cơ sở dữ liệu
        const sqlDelete = `DELETE FROM chitietsanpham WHERE id_chitietsp = ?`;
        db.query(sqlDelete, [id_chitietsp], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi xóa chi tiết sản phẩm." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Không tìm thấy chi tiết sản phẩm cần xóa." });
            }

            // Trả về thông báo thành công nếu không có lỗi
            res.status(200).json({ success: true, message: "Chi tiết sản phẩm đã được xóa thành công." });
        });
    });
});



router.get('/listonect/:id_chitietsp', (req, res) => {
    const chitietId = req.params.id_chitietsp;

    // Tạo câu lệnh SQL để lấy thông tin màu sản phẩm từ bảng mausanpham dựa trên id_chitietsp
    const sql = `
        SELECT * 
        FROM MauSanPham
        WHERE id_chitietsp = ${chitietId}`;

    // Thực thi câu lệnh SQL
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn thông tin màu sản phẩm." });
        }

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thông tin màu sản phẩm với ID đã cung cấp." });
        }

        // Trả về thông tin màu sản phẩm dựa trên id_chitietsp
        res.status(200).json({ success: true, mausanpham: result });
    });
});


router.put('/updateimage/:id_mau', multer.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
    { name: 'image5', maxCount: 1 },
    { name: 'image6', maxCount: 1 }
]), (req, res) => {
    const mauId = req.params.id_mau;
    const images = req.files;

    // Kiểm tra xem có hình ảnh nào được tải lên không
    if (!images || Object.keys(images).length === 0) {
        return res.status(400).json({ success: false, message: "Vui lòng tải lên ít nhất một hình ảnh." });
    }

    // Xóa hình ảnh cũ và thêm hình ảnh mới
    const updatePromises = [];
    for (let i = 1; i <= 6; i++) {
        if (images[`image${i}`]) {
            const imagePath = images[`image${i}`][0].path;
            const sqlUpdate = `
                UPDATE MauSanPham
                SET hinh_anh_${i} = ?
                WHERE id_mau = ?`;

            // Xóa hình ảnh cũ trước khi thêm hình ảnh mới
            const sqlDelete = `
                SELECT hinh_anh_${i} AS oldImagePath
                FROM MauSanPham
                WHERE id_mau = ?`;

            updatePromises.push(new Promise((resolve, reject) => {
                db.query(sqlDelete, [mauId], (err, results) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (results.length > 0 && results[0].oldImagePath) {
                            const oldImagePath = results[0].oldImagePath;
                            // Xóa hình ảnh cũ từ thư mục lưu trữ
                            fs.unlink(oldImagePath, err => {
                                if (err) {
                                    reject(err);
                                } else {
                                    // Thêm hình ảnh mới
                                    db.query(sqlUpdate, [imagePath, mauId], (err, result) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(result);
                                        }
                                    });
                                }
                            });
                        } else {
                            // Thêm hình ảnh mới nếu không có hình ảnh cũ
                            db.query(sqlUpdate, [imagePath, mauId], (err, result) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        }
                    }
                });
            }));
        }
    }

    // Thực hiện cập nhật đồng thời cho tất cả các hình ảnh được cung cấp
    Promise.all(updatePromises)
        .then(results => {
            res.status(200).json({ success: true, message: "Hình ảnh đã được cập nhật thành công." });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi cập nhật hình ảnh." });
        });
});




router.put('/removeimage/:id_mau/:imageNumber', (req, res) => {
    const mauId = req.params.id_mau;
    const imageNumber = req.params.imageNumber;

    // Xử lý và gỡ bỏ hình ảnh cụ thể từ cơ sở dữ liệu
    const sqlSelect = `
        SELECT hinh_anh_${imageNumber} AS imagePath
        FROM MauSanPham
        WHERE id_mau = ?`;

    db.query(sqlSelect, [mauId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi gỡ bỏ hình ảnh." });
        } else {
            if (results.length > 0 && results[0].imagePath) {
                const imagePath = results[0].imagePath;

                // Xóa hình ảnh từ thư mục lưu trữ
                fs.unlink(imagePath, err => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi gỡ bỏ hình ảnh." });
                    } else {
                        // Xóa hình ảnh từ cơ sở dữ liệu sau khi xóa thành công từ thư mục lưu trữ
                        const sqlUpdate = `
                            UPDATE MauSanPham
                            SET hinh_anh_${imageNumber} = NULL
                            WHERE id_mau = ?`;

                        db.query(sqlUpdate, [mauId], (err, result) => {
                            if (err) {
                                console.error(err);
                                res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi gỡ bỏ hình ảnh." });
                            } else {
                                res.status(200).json({ success: true, message: "Hình ảnh đã được gỡ bỏ thành công." });
                            }
                        });
                    }
                });
            } else {
                res.status(404).json({ success: false, message: "Không tìm thấy hình ảnh để gỡ bỏ." });
            }
        }
    });
});






module.exports = router;
