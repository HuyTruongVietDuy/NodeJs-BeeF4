const express = require('express');
const router = express.Router();
const db = require("../models/database");

// Route to get warehouse inventory
router.get('/listsize', (req, res) => {
    // Tạo câu lệnh SQL để lấy toàn bộ kho hàng từ cơ sở dữ liệu
    const sql = `SELECT * FROM sizesanpham`;

    // Thực thi câu lệnh SQL
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn kho hàng." });
        }

        // Kiểm tra và xử lý dữ liệu trước khi trả về
        const warehouseInventory = Array.isArray(result) ? result : [result];

        // Trả về toàn bộ kho hàng
        res.status(200).json({ success: true, warehouseInventory });
    });
});


 // Route to add or update quantity in warehouse inventory for a specific product detail
router.post('/add-quantity/:id_chitietsp', (req, res) => {
    const { id_mau, id_size, so_luong } = req.body;
    const { id_chitietsp } = req.params; // Lấy id_chitietsp từ URL

    // Kiểm tra xem các trường cần thiết đã được cung cấp chưa
    if (!id_mau || !id_size || !so_luong) {
        return res.status(400).json({ success: false, message: "Vui lòng cung cấp đầy đủ thông tin." });
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong kho chưa
    const checkExistingProductSQL = `SELECT * FROM QuanLyKho WHERE id_chitietsp = ? AND id_mau = ? AND id_size = ?`;
    db.query(checkExistingProductSQL, [id_chitietsp, id_mau, id_size], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi kiểm tra sản phẩm trong kho." });
        }

        if (results.length > 0) {
            // Nếu sản phẩm đã tồn tại trong kho, cập nhật số lượng
            const updateQuantitySQL = `UPDATE QuanLyKho SET so_luong = so_luong + ? WHERE id_chitietsp = ? AND id_mau = ? AND id_size = ?`;
            db.query(updateQuantitySQL, [so_luong, id_chitietsp, id_mau, id_size], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi cập nhật số lượng trong kho." });
                }
                res.status(200).json({ success: true, message: "Đã cập nhật số lượng trong kho thành công." });
            });
        } else {
            // Nếu sản phẩm chưa tồn tại trong kho, thêm mới
            const insertNewProductSQL = `INSERT INTO QuanLyKho (id_chitietsp, id_mau, id_size, so_luong) VALUES (?, ?, ?, ?)`;
            db.query(insertNewProductSQL, [id_chitietsp, id_mau, id_size, so_luong], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi thêm số lượng vào kho." });
                }
                res.status(200).json({ success: true, message: "Đã thêm số lượng vào kho thành công." });
            });
        }
    });
});


router.get('/quanlykho/:id_chitietsp', (req, res) => {
    const { id_chitietsp } = req.params;

    // Tạo câu lệnh SQL để lấy thông tin quản lý kho, kích thước sản phẩm và màu sản phẩm dựa trên id_chitietsp, sắp xếp theo id_size
    const sql = `
        SELECT Q.id_kho, Q.id_mau, Q.id_size, Q.so_luong, S.ten_size, M.ten_mau
        FROM QuanLyKho AS Q
        INNER JOIN SizeSanPham AS S ON Q.id_size = S.id_size
        INNER JOIN MauSanPham AS M ON Q.id_mau = M.id_mau
        WHERE Q.id_chitietsp = ?
        ORDER BY Q.id_size`;

    // Thực thi câu lệnh SQL
    db.query(sql, [id_chitietsp], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn thông tin quản lý kho, kích thước sản phẩm và màu sản phẩm." });
        }

        // Kiểm tra và xử lý dữ liệu trước khi trả về
        const warehouseInventory = Array.isArray(result) ? result : [result];

        // Trả về thông tin quản lý kho, kích thước sản phẩm và màu sản phẩm dựa trên id_chitietsp, đã sắp xếp theo id_size
        res.status(200).json({ success: true, warehouseInventory });
    });
});

router.delete('/quanlykho/:id_kho', async (req, res) => {
    const { id_kho } = req.params;

    try {
        // Perform the deletion in the database
        const deleteQuery = `DELETE FROM quanlykho WHERE id_kho = ?`;
        await new Promise((resolve, reject) => {
            db.query(deleteQuery, [id_kho], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // If deletion is successful, return success message
        return res.status(200).json({ "message": "Deleted record based on id_kho successfully" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
});


router.get('/totalquanlity/:id_sanpham', (req, res) => {
    const { id_sanpham } = req.params;

    // SQL query to retrieve total quantity by id_chitietsp, including ten_sanpham and ten_mau
    const sql = `
        SELECT 
            Q.id_chitietsp,
            SUM(Q.so_luong) AS total_quantity,
            S.ten_sanpham,
            M.ten_mau
        FROM 
            QuanLyKho Q
        JOIN 
            ChiTietSanPham C ON Q.id_chitietsp = C.id_chitietsp
        JOIN 
            SanPham S ON C.id_sanpham = S.id_sanpham
        JOIN 
            MauSanPham M ON Q.id_mau = M.id_mau
        WHERE 
            C.id_sanpham = ?
        GROUP BY 
            Q.id_chitietsp`;

    // Execute the SQL query
    db.query(sql, [id_sanpham], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi truy vấn tổng số lượng từ QuanLyKho." });
        }

        // Calculate the total quantity for all id_chitietsp
        const totalQuantityAll = results.reduce((total, item) => total + item.total_quantity, 0);

        // Return the total quantity for each id_chitietsp and the total quantity for all id_chitietsp
        res.status(200).json({ success: true, quantities: results, totalQuantityAll });
    });
});





    


module.exports = router;
