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
    const checkExistingProductSQL = `select * 
    from quanlykho 
    where id_chitietsp = ? and id_mau = ? and id_size = ?
    `;
    db.query(checkExistingProductSQL, [id_chitietsp, id_mau, id_size], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi kiểm tra sản phẩm trong kho." });
        }

        if (results.length > 0) {
            // Nếu sản phẩm đã tồn tại trong kho, cập nhật số lượng
            const updateQuantitySQL = `update quanlykho 
            set so_luong = so_luong + ? 
            where id_chitietsp = ? and id_mau = ? and id_size = ?
            `;
            db.query(updateQuantitySQL, [so_luong, id_chitietsp, id_mau, id_size], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi cập nhật số lượng trong kho." });
                }
                res.status(200).json({ success: true, message: "Đã cập nhật số lượng trong kho thành công." });
            });
        } else {
            // Nếu sản phẩm chưa tồn tại trong kho, thêm mới
            const insertNewProductSQL = `insert into quanlykho (id_chitietsp, id_mau, id_size, so_luong) 
            values (?, ?, ?, ?)
            `;
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
    select q.id_kho, q.id_mau, q.id_size, q.so_luong, s.ten_size, m.ten_mau
    from quanlykho as q
    inner join sizesanpham as s on q.id_size = s.id_size
    inner join mausanpham as m on q.id_mau = m.id_mau
    where q.id_chitietsp = ?
    order by q.id_size
    `;

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
    select 
    q.id_chitietsp,
    sum(q.so_luong) as total_quantity,
    s.ten_sanpham,
    m.ten_mau
from 
    quanlykho q
join 
    chitietsanpham c on q.id_chitietsp = c.id_chitietsp
join 
    sanpham s on c.id_sanpham = s.id_sanpham
join 
    mausanpham m on q.id_mau = m.id_mau
where 
    c.id_sanpham = ?
group by 
    q.id_chitietsp
`;

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
