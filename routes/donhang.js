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
    db.query(sql, data, function (err, result) {
        if (err) {
            res.json({"id_donhang": -1, "thông báo": "lỗi không lưu được đơn hàng", "error": err});
        } else {
            const id_donhang = result.insertId;
            res.json({"id_donhang": id_donhang, "thông báo": "đã lưu đơn hàng"});
            // Kiểm tra xem có cột id_giamgia trong dữ liệu đầu vào không
            if ('id_giamgia' in data && data.id_giamgia !== null) {
                // Nếu có, tiến hành cập nhật trạng thái của mã giảm giá trong bảng giamgia
                const sqlUpdate = `UPDATE giamgia SET tinh_trang = 2, trang_thai = 2 WHERE id_giamgia = ?`;
                db.query(sqlUpdate, [data.id_giamgia], function (errUpdate, resultUpdate) {
                    if (errUpdate) {
                        console.error("Lỗi khi cập nhật trạng thái mã giảm giá:", errUpdate);
                        // Xử lý lỗi nếu cần
                    } else {
                        console.log("Đã cập nhật trạng thái mã giảm giá thành công");
                        // Xử lý khi cập nhật thành công (nếu cần)
                    }
                });
            }
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

router.put('/update-tinh-trang/:id_donhang', (req, res) => {
    const id_donhang = req.params.id_donhang;
    const newTinhTrang = req.body.tinh_trang;

    const updateOrderQuery = `
        UPDATE donhang
        SET 
            tinh_trang = ?
        WHERE 
            id_donhang = ?`;

    db.query(updateOrderQuery, [newTinhTrang, id_donhang], (err, result) => {
        if (err) {
            return res.status(500).json({ "message": "Lỗi khi cập nhật trạng thái đơn hàng", "error": err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ "message": "Không tìm thấy đơn hàng" });
        }

        if (newTinhTrang === 2) {
            const getOrderDetailsQuery = `
                SELECT 
                    id_chitietsp, 
                    id_size, 
                    so_luong 
                FROM 
                    DonHangChiTiet 
                WHERE 
                    id_donhang = ?`;

            db.query(getOrderDetailsQuery, [id_donhang], (err, orderDetails) => {
                if (err) {
                    console.error('Error retrieving order details:', err);
                    return res.status(500).json({ "message": "Lỗi khi lấy chi tiết đơn hàng" });
                }

                const checkWarehousePromises = orderDetails.map((item) => {
                    const checkWarehouseQuery = `
                        SELECT 
                            so_luong 
                        FROM 
                            QuanLyKho 
                        WHERE 
                            id_chitietsp = ? 
                            AND id_size = ?`;

                    return new Promise((resolve, reject) => {
                        db.query(checkWarehouseQuery, [item.id_chitietsp, item.id_size], (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                const warehouseStock = result[0].so_luong;
                                if (warehouseStock < item.so_luong) {
                                    reject(`Không đủ hàng trong kho cho sản phẩm ${item.id_chitietsp} và size ${item.id_size}`);
                                } else {
                                    resolve();
                                }
                            }
                        });
                    });
                });

                Promise.all(checkWarehousePromises)
                    .then(() => {
                        const getOrderInfoQuery = `
                            SELECT email 
                            FROM donhang 
                            WHERE id_donhang = ?`;

                        db.query(getOrderInfoQuery, [id_donhang], (err, orderResult) => {
                            if (err) {
                                return res.status(500).json({ "message": "Lỗi khi lấy thông tin đơn hàng", "error": err });
                            }

                            if (orderResult.length === 0) {
                                return res.status(404).json({ "message": "Không tìm thấy đơn hàng" });


                            }

                            const userEmail = orderResult[0].email;
                            sendConfirmationEmail(userEmail, id_donhang);

                            return res.status(200).json({ "message": "Đã cập nhật trạng thái đơn hàng và gửi email thông báo" });
                        });
                    })
                    .catch((err) => {
                        console.error('Lỗi kiểm tra kho:', err);
                        return res.status(500).json({ "message": "Không đủ hàng trong kho", "error": err });
                    });
            });
        } else if (newTinhTrang === 3) {
            // Xử lý cập nhật kho khi đơn hàng hoàn thành
            const getOrderDetailsQuery = `
                SELECT 
                    id_chitietsp, 
                    id_size, 
                    so_luong 
                FROM 
                    DonHangChiTiet 
                WHERE 
                    id_donhang = ?`;

            db.query(getOrderDetailsQuery, [id_donhang], (err, orderDetails) => {
                if (err) {
                    console.error('Lỗi lấy chi tiết đơn hàng:', err);
                    return res.status(500).json({ "message": "Lỗi khi lấy chi tiết đơn hàng" });
                }

                const updateWarehousePromises = orderDetails.map((item) => {
                    const updateWarehouseQuery = `
                        UPDATE 
                            QuanLyKho
                        SET 
                            so_luong = so_luong - ? 
                        WHERE 
                            id_chitietsp = ? 
                            AND id_size = ?`;

                    return db.query(updateWarehouseQuery, [item.so_luong, item.id_chitietsp, item.id_size]);
                });

                Promise.all(updateWarehousePromises)
                    .then(() => {
                        return res.status(200).json({ "message": "Đã cập nhật trạng thái đơn hàng và kho thành công" });
                    })
                    .catch((err) => {
                        console.error('Lỗi cập nhật kho:', err);
                        return res.status(500).json({ "message": "Lỗi khi cập nhật kho", "error": err });
                    });
            });
        } else {
            return res.status(200).json({ "message": "Đã cập nhật trạng thái đơn hàng thành công" });
        }
    });
});


router.get('/:id_donhang', (req, res) => {
    const id_donhang = req.params.id_donhang;

    // Truy vấn dữ liệu đơn hàng dựa trên id_donhang, kết hợp với bảng giamgia để lấy phan_tram
    const sql = `
        SELECT 
            donhang.*, 
            giamgia.phan_tram ,
            giamgia.ma_giamgia 
        FROM 
            donhang 
        LEFT JOIN 
            giamgia ON donhang.id_giamgia = giamgia.id_giamgia
        WHERE 
            donhang.id_donhang = ?`;

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


router.put('/update-address/:id_donhang', (req, res) => {
    const id_donhang = req.params.id_donhang;
    const { diachi, tinh, huyen, xa, sdt } = req.body; // Include sdt in the request body

    // Update the address for the order with the specified id_donhang
    const sql = `
        UPDATE donhang
        SET diachi = ?, tinh = ?, huyen = ?, xa = ?, sdt = ?
        WHERE id_donhang = ?`;
    db.query(sql, [diachi, tinh, huyen, xa, sdt, id_donhang], function (err, result) {
        if (err) {
            res.status(500).json({"message": "Lỗi khi cập nhật địa chỉ cho đơn hàng", "error": err});
        } else {
            if (result.affectedRows > 0) {
                res.status(200).json({"message": "Đã cập nhật địa chỉ thành công"});
            } else {
                res.status(404).json({"message": "Không tìm thấy đơn hàng"});
            }
        }
    });
});


module.exports = router;
