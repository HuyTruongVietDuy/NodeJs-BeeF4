const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require("../models/database");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PRIVATE_KEY = process.env.PRIVATE_KEY || fs.readFileSync('private-key.txt');


router.post('/login', (req, res) => {
    const { ten_dangnhap, matkhau } = req.body;
    console.log('Received login information:', ten_dangnhap, matkhau);

    // Lấy thời gian đăng nhập hiện tại
    const currentLoginTime = new Date();

    // Retrieve user information from the database based on the username
    const query = `SELECT * FROM nguoidung WHERE ten_dangnhap = ?`;
    db.query(query, [ten_dangnhap], (err, results) => {
        if (err) {
            console.error("Error querying database:", err);
            res.status(500).json({ "message": "Internal server error" });
            return;
        }

        if (results.length === 0) {
            // User not found in the database
            res.status(401).json({ "message": "Tài khoản không tồn tại" });
            return;
        }

        const user = results[0];

        // Compare the provided password with the hashed password stored in the database
        bcrypt.compare(matkhau, user.matkhau, (bcryptErr, bcryptResult) => {
            if (bcryptErr) {
                console.error("Error comparing passwords:", bcryptErr);
                res.status(500).json({ "message": "Internal server error" });
                return;
            }

            if (!bcryptResult) {
                // Passwords do not match
                res.status(401).json({ "message": "Mật khẩu không đúng" });
                return;
            }

            // Passwords match, generate JWT token
            const userInfo = { ...user }; // Spread operator to get all user data
            delete userInfo.matkhau; // Remove password from user data

            // Cập nhật thời gian đăng nhập hiện tại vào cơ sở dữ liệu
            const updateQuery = `UPDATE nguoidung SET login_in = ? WHERE id_user = ?`;
            db.query(updateQuery, [currentLoginTime, userInfo.id_user], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error("Error updating last login time:", updateErr);
                    res.status(500).json({ "message": "Internal server error" });
                    return;
                }
            });

            const jwtBearerToken = jwt.sign(
                { sub: userInfo.id_user, role: userInfo.role },
                PRIVATE_KEY,
                { algorithm: 'RS256', expiresIn: 120 }
            );

            res.status(200).json({ token: jwtBearerToken, expiresIn: 120, userInfo: userInfo });
        });
    });
});



// Route để đăng ký người dùng
router.post('/dangky', (req, res) => {
    const { ho_ten, ten_dangnhap, email, sdt, diachi, tinh, huyen, xa, matkhau, gioi_tinh } = req.body;
    console.log("Request Body:", req.body);
    
    // Hash the password
    bcrypt.hash(matkhau, saltRounds, (err, hash) => {
        if (err) {
            console.error("Lỗi khi mã hóa mật khẩu:", err);
            res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi đăng ký người dùng" });
            return;
        }
        
        // Thêm thông tin người dùng vào cơ sở dữ liệu
        const insertQuery = `INSERT INTO nguoidung (ho_ten, ten_dangnhap, email, sdt, diachi, tinh, huyen, xa, matkhau, gioi_tinh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        // Specify null for fields that can be null
        const insertValues = [ho_ten, ten_dangnhap, email, sdt, diachi, tinh, huyen, xa, hash, gioi_tinh];
        
        db.query(insertQuery, insertValues, (insertErr, insertResult) => {
            if (insertErr) {
                console.error("Lỗi khi thêm người dùng:", insertErr);
                res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi đăng ký người dùng" });
            } else {
                console.log("Đã đăng ký người dùng thành công");
                res.status(200).json({ "thông_báo": "Đã đăng ký người dùng thành công" });
            }
        });
    });
});

// Route để lấy hết dữ liệu từ bảng người dùng
router.get('/listtaikhoan', (req, res) => {
    // Truy vấn để lấy hết dữ liệu từ bảng người dùng
    const query = `SELECT * FROM nguoidung`;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Lỗi khi truy vấn dữ liệu từ bảng người dùng:", err);
            res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi lấy dữ liệu người dùng" });
        } else {
            console.log("Dữ liệu người dùng đã được truy vấn thành công");
            res.status(200).json(results);
        }
    });
});

module.exports = router;
