const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require("../models/database");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const PRIVATE_KEY = process.env.PRIVATE_KEY || fs.readFileSync('private-key.txt');
var nodemailer = require('nodemailer');


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

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Retrieve user information from the database based on the email
        const query = `SELECT * FROM nguoidung WHERE email = ?`;
        const results = await new Promise((resolve, reject) => {
            db.query(query, [email], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (results.length === 0) {
            // Email not found in the database
            return res.status(404).json({ "message": "Địa chỉ email không tồn tại" });
        }

        // Email found in the database
        const user = results[0];

        // Create JWT token
        const token = jwt.sign({ id_user: user.id_user }, 'your_secret_key', { expiresIn: '1h' });

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'quanghuyvoicontre@gmail.com',
                pass: 'jxur wbdr oboc dcrb'
            }
        });

        // Construct the link to reset password
        const resetLink = `http://localhost:3000/taomatkhaumoi/${user.id_user}?token=${token}`;

        const mailOptions = {
            from: 'SQBE <sqbe@gmail.com>',
            to: user.email,
            subject: 'Đặt lại mật khẩu',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <h2 style="color: #007bff;">Xin chào,</h2>
                    <p>Bạn nhận được email này vì bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
                    <p>Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:</p>
                    <p style="text-align: center; margin-top: 20px;">
                        <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px;">Đặt lại mật khẩu</a>
                    </p>
                    <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.</p>
                    <p>Trân trọng,</p>
                    <p><strong>Đội ngũ hỗ trợ của chúng tôi</strong></p>
                </div>
            `
        };
        
        

        await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully');
        return res.status(200).json({ "message": "Email sent successfully" });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
});


router.post('/reset-password/:id_user', async (req, res) => {
    const { id_user } = req.params;
    const { newPassword } = req.body;

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10); // Số lần băm là 10, có thể thay đổi tùy ý

        // Update user's password in the database
        const updateQuery = `UPDATE nguoidung SET matkhau = ? WHERE id_user = ?`;
        await new Promise((resolve, reject) => {
            db.query(updateQuery, [hashedPassword, id_user], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Create a new JWT token
        const newToken = jwt.sign({ id_user }, 'your_secret_key', { expiresIn: '1h' });

        // Password updated successfully, return the new token
        return res.status(200).json({ "message": "Password updated successfully", "token": newToken });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
});

router.post('/change-password/:id_user', async (req, res) => {
    const { id_user } = req.params; // Lấy id_user từ tham số
    const { oldPassword, newPassword, confirmNewPassword } = req.body; // Lấy dữ liệu từ body

    if (!id_user) {
        return res.status(400).json({ "message": "Missing user ID" });
    }

    if (!oldPassword) { // Kiểm tra nếu mật khẩu cũ bị trống
        return res.status(400).json({ "message": "Old password is required" });
    }

    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ "message": "New password and confirmation do not match" });
    }

    try {
        // Lấy mật khẩu hiện tại từ cơ sở dữ liệu
        const selectQuery = `SELECT matkhau FROM nguoidung WHERE id_user = ?`;
        const currentPasswordData = await new Promise((resolve, reject) => {
            db.query(selectQuery, [id_user], (err, results) => {
                if (err) {
                    reject(err);
                } else if (results.length === 0 || !results[0].matkhau) {
                    reject(new Error("User not found or password is empty"));
                } else {
                    resolve(results[0]);
                }
            });
        });

        const currentHashedPassword = currentPasswordData.matkhau;

        // So sánh mật khẩu cũ với mật khẩu hiện tại
        const match = await bcrypt.compare(oldPassword, currentHashedPassword);

        if (!match) {
            return res.status(400).json({ "message": "Old password is incorrect" });
        }

        // Băm mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu mới trong cơ sở dữ liệu
        const updateQuery = `UPDATE nguoidung SET matkhau = ? WHERE id_user = ?`;
        await new Promise((resolve, reject) => {
            db.query(updateQuery, [hashedNewPassword, id_user], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        return res.status(200).json({ "message": "Password changed successfully" });

    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ "message": "Internal server error" });
    }
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







// Route để cập nhật từng phần thông tin người dùng
router.patch('/update-user/:id_user', (req, res) => {
    const { id_user } = req.params; // Lấy id_user từ params
    const { ho_ten, diachi, tinh, huyen, xa, sdt } = req.body; // Các trường cần cập nhật

    if (!id_user) {
        res.status(400).json({ "thông_báo": "Thiếu ID người dùng" });
        return;
    }

    // Danh sách các trường cần cập nhật, chỉ thêm vào nếu có giá trị trong request body
    const updateFields = [];
    const updateValues = [];

    if (ho_ten !== undefined) {
        updateFields.push('ho_ten = ?');
        updateValues.push(ho_ten);
    }

    if (diachi !== undefined) {
        updateFields.push('diachi = ?');
        updateValues.push(diachi);
    }

    if (tinh !== undefined) {
        updateFields.push('tinh = ?');
        updateValues.push(tinh);
    }

    if (huyen !== undefined) {
        updateFields.push('huyen = ?');
        updateValues.push(huyen);
    }

    if (xa !== undefined) {
        updateFields.push('xa = ?');
        updateValues.push(xa);
    }

    if (sdt !== undefined) {
        updateFields.push('sdt = ?');
        updateValues.push(sdt);
    }

    // Nếu không có trường nào cần cập nhật, trả lại lỗi
    if (updateFields.length === 0) {
        res.status(400).json({ "thông_báo": "Không có trường nào để cập nhật" });
        return;
    }

    // Thêm id_user vào cuối mảng updateValues
    updateValues.push(id_user);

    const updateQuery = `
        UPDATE nguoidung
        SET ${updateFields.join(', ')}
        WHERE id_user = ?
    `;

    // Thực hiện câu truy vấn
    db.query(updateQuery, updateValues, (updateErr, updateResult) => {
        if (updateErr) {
            console.error("Lỗi khi cập nhật thông tin người dùng:", updateErr);
            res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi cập nhật thông tin người dùng" });
            return;
        }

        if (updateResult.affectedRows > 0) {
            res.status(200).json({ "thông_báo": "Cập nhật thông tin người dùng thành công" });
        } else {
            res.status(404).json({ "thông_báo": "Không tìm thấy người dùng với ID này" });
        }
    });
});


router.get('/user/:id_user', (req, res) => {
    const { id_user } = req.params; // Lấy id_user từ params

    if (!id_user) {
        res.status(400).json({ "thông_báo": "Thiếu ID người dùng" });
        return;
    }

    const selectQuery = `
        SELECT ho_ten, diachi, tinh, huyen, xa, sdt 
        FROM nguoidung 
        WHERE id_user = ?
    `;

    // Thực hiện truy vấn cơ sở dữ liệu
    db.query(selectQuery, [id_user], (selectErr, selectResult) => {
        if (selectErr) {
            console.error("Lỗi khi truy vấn thông tin người dùng:", selectErr);
            res.status(500).json({ "thông_báo": "Đã xảy ra lỗi khi truy vấn thông tin người dùng" });
            return;
        }

        if (selectResult.length > 0) {
            res.status(200).json(selectResult[0]); // Trả lại thông tin người dùng
        } else {
            res.status(404).json({ "thông_báo": "Không tìm thấy người dùng với ID này" });
        }
    });
});

router.post('/addfavorite/:id_sanpham/:id_user', async (req, res) => {
    try {
        const { id_sanpham, id_user } = req.params; // Lấy id_sanpham và id_user từ params

        // Kiểm tra xem id_sanpham và id_user có tồn tại không
        if (!id_sanpham || !id_user) {
            return res.status(400).json({ error: 'Vui lòng cung cấp id_sanpham và id_user' });
        }

        // Thêm sản phẩm yêu thích vào cơ sở dữ liệu
        await db.query('INSERT INTO sanphamyeuthich (id_sanpham, id_user) VALUES (?, ?)', [id_sanpham, id_user]);
        
        res.json({ message: 'Sản phẩm đã được thêm vào danh sách yêu thích' });
    } catch (error) {
        console.error('Error adding favorite product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/removefavorite/:id_sanpham/:id_user', async (req, res) => {
    try {
        const { id_sanpham, id_user } = req.params; // Lấy id_sanpham và id_user từ params

        // Kiểm tra xem id_sanpham và id_user có tồn tại không
        if (!id_sanpham || !id_user) {
            return res.status(400).json({ error: 'Vui lòng cung cấp id_sanpham và id_user' });
        }

        // Xóa sản phẩm yêu thích khỏi cơ sở dữ liệu
        await db.query('DELETE FROM sanphamyeuthich WHERE id_sanpham = ? AND id_user = ?', [id_sanpham, id_user]);

        res.json({ message: 'Sản phẩm đã được xóa khỏi danh sách yêu thích' });
    } catch (error) {
        console.error('Error removing favorite product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
