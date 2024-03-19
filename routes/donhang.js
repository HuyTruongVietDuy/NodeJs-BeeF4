const express = require('express');
const fs = require('fs');
const path = require('path');

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

module.exports = router;
