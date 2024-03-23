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


module.exports = router;
