const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require("../models/database");

const router = express.Router();
const dbFilePath = path.join(__dirname, '..', 'models', 'db.json');
const nodemailer = require('nodemailer');
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

    // Truy vấn dữ liệu đơn hàng dựa trên id_user và sắp xếp theo thời gian tạo mới nhất
    const sql = `SELECT * FROM donhang WHERE id_user = ? ORDER BY ngay_dat DESC`;
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
    // cùng với bảng sizesanpham để lấy ten_size (nếu có)
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


const sendConfirmationEmail = async (email, orderId) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'quanghuyvoicontre@gmail.com',
                pass: 'jxur wbdr oboc dcrb'
            }
        });

        // Truy vấn cơ sở dữ liệu để lấy chi tiết đơn hàng từ bảng donhangchitiet
        const getOrderDetailsQuery = `SELECT * FROM donhangchitiet WHERE id_donhang = ?`;
        db.query(getOrderDetailsQuery, [orderId], async function (err, orderDetails) {
            if (err) {
                console.error('Error retrieving order details:', err);
                return;
            }

            let productListHTML = ''; // Chuỗi HTML để hiển thị thông tin về sản phẩm trong đơn hàng

            // Lặp qua từng sản phẩm trong đơn hàng và thêm thông tin vào chuỗi HTML
            for (let i = 0; i < orderDetails.length; i++) {
                const product = orderDetails[i];
                productListHTML += `
                    <p>Sản phẩm ${i + 1}:</p>
                    <p>Tên sản phẩm: ${product.ten_sanpham}</p>
                    <p>Số lượng: ${product.so_luong}</p>
                    <p>Giá: ${product.gia_ban}</p>
                    <hr>
                `;
            }

            const mailOptions = {
                from: 'SQBE <sqbe@gmail.com>',
                to: email,
                subject: 'Đơn hàng đã được xác nhận',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                        <h2 style="color: #007bff;">Xin chào,</h2>
                        <p>Đơn hàng số PM${orderId} của bạn đã được xác nhận và đang được xử lý. Vui lòng chờ đợi để nhận được sản phẩm.</p>
                        <h3>Thông tin đơn hàng:</h3>
                        ${productListHTML}
                        <p>Xin cảm ơn bạn đã mua hàng của chúng tôi!</p>
                        <p>Trân trọng,</p>
                        <p><strong>Đội ngũ hỗ trợ của chúng tôi</strong></p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);

            console.log('Confirmation email sent successfully');
        });
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};


// Router cập nhật tình trạng đơn hàng
router.put('/update-tinh-trang/:id_donhang', (req, res) => {
    const id_donhang = req.params.id_donhang;
    const newTinhTrang = req.body.tinh_trang; // Trạng thái mới được gửi từ client

    // Tạo câu lệnh SQL để cập nhật trạng thái cho bảng donhang
    const sql = `
        UPDATE donhang
        SET 
            tinh_trang = ?
        WHERE 
            id_donhang = ?`;

    // Thực hiện truy vấn cập nhật
    db.query(sql, [newTinhTrang, id_donhang], function (err, result) {
        if (err) {
            res.status(500).json({ "message": "Lỗi khi cập nhật trạng thái đơn hàng", "error": err });
        } else {
            // Kiểm tra xem có bao nhiêu dòng đã được cập nhật
            if (result.affectedRows > 0) {
                if (newTinhTrang === 2) {
                    // Lấy thông tin đơn hàng từ cơ sở dữ liệu
                    const getOrderInfoQuery = `SELECT * FROM donhang WHERE id_donhang = ?`;
                    db.query(getOrderInfoQuery, [id_donhang], function (err, orderResult) {
                        if (err) {
                            console.error('Error retrieving order information:', err);
                            return res.status(500).json({ "message": "Lỗi khi lấy thông tin đơn hàng" });
                        }

                        if (orderResult.length === 0) {
                            return res.status(404).json({ "message": "Không tìm thấy đơn hàng" });
                        }

                        // Lấy địa chỉ email của người dùng từ đơn hàng
                        const userEmail = orderResult[0].email;

                        // Gửi email thông báo cho người dùng khi đơn hàng được xác nhận
                        sendConfirmationEmail(userEmail, id_donhang);

                        return res.status(200).json({ "message": "Đã cập nhật trạng thái đơn hàng thành công" });
                    });
                } else {
                    return res.status(200).json({ "message": "Đã cập nhật trạng thái đơn hàng thành công" });
                }
            } else {
                res.status(404).json({ "message": "Không tìm thấy đơn hàng" });
            }
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

router.get('/', (req, res) => {
    // Truy vấn dữ liệu từ bảng "donhang", sắp xếp theo thời gian tạo đơn hàng giảm dần
    const sql = `SELECT * FROM donhang ORDER BY ngay_dat DESC`;
    db.query(sql, function (err, result) {
        if (err) {
            res.status(500).json({"message": "Lỗi khi truy vấn thông tin đơn hàng", "error": err});
        } else {
            if (result.length === 0) {
                res.status(404).json({"message": "Không có đơn hàng nào"});
            } else {
                res.status(200).json(result);
            }
        }
    });
});



module.exports = router;
