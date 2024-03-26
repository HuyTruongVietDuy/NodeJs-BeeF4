const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require("../models/database");

const router = express.Router();
const dbFilePath = path.join(__dirname, '..', 'models', 'db.json');

// Định nghĩa router để hiển thị dữ liệu từ db.json
router.get('/data', (req, res) => {
    try {
        // Đọc dữ liệu từ tệp db.json
        const rawData = fs.readFileSync(dbFilePath);
        const data = JSON.parse(rawData);

        // Gửi dữ liệu như một phản hồi JSON
        res.json(data);
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error reading data from file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.post('/luudonhang', (req, res) => {
    let data = req.body;
    let sql = `INSERT INTO donhang SET ?`;
    db.query(sql, data, function (err, data) {
        if(err) res.json({"id_donhang":-1,"thông báo":"lỗi không lưu được đơn hàng", err})
        else{
            id_donhang = data.insertId
            res.json({"id_donhang": id_donhang,"thông báo":"đã lưu đơn hàng"});
        }
    });
});

router.post('/luuchitietdonhang', (req, res) => {
    let data = req.body; // Dữ liệu chi tiết đơn hàng từ request body
    let sql = `INSERT INTO donhangchitiet SET ?`; // Câu lệnh SQL để chèn dữ liệu vào bảng chi tiết đơn hàng
    db.query(sql, data, function (err, result) {
        if(err) {
            res.status(500).json({"message": "Lỗi không lưu được chi tiết đơn hàng", "error": err});
        } else {
            res.status(200).json({"message": "Đã lưu chi tiết đơn hàng vào cơ sở dữ liệu", "result": result});
        }
    });
});



router.get('/listdh/:id_user', (req, res) => {
    const id_user = req.params.id_user;

    // Truy vấn dữ liệu đơn hàng dựa trên id_user
    const sql = `SELECT * FROM donhang WHERE id_user = ?`;
    db.query(sql, id_user, function (err, result) {
        if (err) {
            res.status(500).json({"message": "Lỗi khi truy vấn dữ liệu đơn hàng", "error": err});
        } else {
            res.status(200).json(result);
        }
    });
});

router.get('/listchitietdonhang/:id_donhang', (req, res) => {
    const id_donhang = req.params.id_donhang;

    // Truy vấn dữ liệu chi tiết đơn hàng dựa trên id_donhang, kết hợp với bảng mausanpham để lấy ten_mau và hinh_anh_1,
    // cùng với bảng sizesanpham để lấy ten_size
    const sql = `
        SELECT 
            dhct.*, 
            ms.ten_mau,
            ms.hinh_anh_1,
            ss.ten_size
        FROM 
            donhangchitiet dhct
        LEFT JOIN 
            mausanpham ms ON dhct.id_chitietsp = ms.id_chitietsp
        LEFT JOIN
            sizesanpham ss ON dhct.id_size = ss.id_size
        WHERE 
            dhct.id_donhang = ?`;
    db.query(sql, id_donhang, function (err, result) {
        if (err) {
            res.status(500).json({"message": "Lỗi khi truy vấn dữ liệu chi tiết đơn hàng", "error": err});
        } else {
            res.status(200).json(result);
        }
    });
});



router.get('/:id_donhang', (req, res) => {
    const id_donhang = req.params.id_donhang;

    // Truy vấn dữ liệu đơn hàng dựa trên id_donhang
    const sql = `SELECT * FROM donhang WHERE id_donhang = ?`;
    db.query(sql, id_donhang, function (err, result) {
        if (err) {
            res.status(500).json({"message": "Lỗi khi truy vấn thông tin đơn hàng", "error": err});
        } else {
            if (result.length === 0) {
                res.status(404).json({"message": "Không tìm thấy đơn hàng"});
            } else {
                res.status(200).json(result[0]);
            }
        }
    });
});

module.exports = router;
