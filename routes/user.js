const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = process.env.PRIVATE_KEY || fs.readFileSync('private-key.txt');

// Danh sách tài khoản và mật khẩu
const accounts = [
    { taikhoan: 'user1', matkhau: 'password1', role: 'user' },
    { taikhoan: 'admin', matkhau: 'adminpassword', role: 'admin' }
];

router.post('/login', (req, res) => {
    const un = req.body.un;
    const pw = req.body.pw;
    console.log('Nhận thông tin đăng nhập:', un, pw);

    // Kiểm tra tài khoản và mật khẩu trong danh sách tài khoản
    const user = accounts.find(account => account.taikhoan === un && account.matkhau === pw);

    if (user) {
        const userId = un; // Chúng ta có thể sử dụng tên tài khoản làm userId
        const userInfo = { id: userId, taikhoan: un, role: user.role };

        // Tạo mã JWT
        const jwtBearerToken = jwt.sign(
            { sub: userId, role: user.role },
            PRIVATE_KEY,
            { algorithm: 'RS256', expiresIn: 120 }
        );

        res.status(200).json({ token: jwtBearerToken, expiresIn: 120, userInfo: userInfo });
    } else {
        // Thông báo đăng nhập thất bại nếu tài khoản không khớp
        res.status(401).json({ "thông_báo": "Tài khoản hoặc mật khẩu không đúng" });
    }
});

module.exports = router;
