const express = require('express');
const router = express.Router();
const db = require("../models/database");

router.get('/total', async (req, res) => {
    try {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM donhang WHERE tinh_trang = 3) AS totalDonHangThanhCong,
                (SELECT COUNT(*) FROM donhang WHERE tinh_trang = 4) AS totalDonHangChuaThanhCong,
                (SELECT SUM(total) FROM donhang WHERE tinh_trang = 3) AS totalDonHang,
                (SELECT COUNT(*) FROM donhang WHERE tinh_trang IN (1, 2)) AS totalDonHangChoXuLy,
                COUNT(*) AS totalSanPham,
                (SELECT COUNT(*) FROM danhmuc WHERE id_danhmuc_cha IS NOT NULL) AS totalDanhMuc,
                (SELECT COUNT(*) FROM nguoidung) AS totalNguoiDung,
                (SELECT COUNT(*) FROM quanlykho WHERE so_luong < 10) AS lowStockProducts,
                (SELECT COUNT(*) FROM donhang) AS CountTongDonHang,
                (SELECT SUM(so_luong) FROM quanlykho) AS totalSoLuong,
                (SELECT COUNT(*) FROM nguoidung WHERE role = 1) AS totalKhachHang,
                (SELECT COUNT(*) FROM nguoidung WHERE role = 2) AS totalNhanVien,
                (SELECT COUNT(*) FROM nguoidung WHERE role = 3) AS totalAdmin
            FROM sanpham
        `;
        db.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching total:', error);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                return res.json(results[0]);
            }
        });
    } catch (error) {
        console.error('Error fetching total:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/thongketheo-sanpham', async (req, res) => {
    try {
        const query = `
        SELECT 
            s.id_sanpham,
            s.ten_sanpham,
            COALESCE(SUM(
                CASE 
                    WHEN dh.tinh_trang = 3 
                    THEN d.gia_ban * d.so_luong 
                    ELSE 0 
                END
            ), 0) AS doanh_thu,
            COALESCE(
                (SELECT SUM(qk.so_luong)
                 FROM QuanLyKho qk
                 JOIN ChiTietSanPham ct ON qk.id_chitietsp = ct.id_chitietsp
                 WHERE ct.id_sanpham = s.id_sanpham)
            ) AS tong_so_luong
        FROM 
            SanPham s
        LEFT JOIN 
            ChiTietSanPham c ON s.id_sanpham = c.id_sanpham
        LEFT JOIN 
            DonHangChiTiet d ON c.id_chitietsp = d.id_chitietsp
        LEFT JOIN 
            DonHang dh ON d.id_donhang = dh.id_donhang
        GROUP BY 
            s.id_sanpham,
            s.ten_sanpham
        ORDER BY 
            s.id_sanpham;
        `;

        db.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(results); // Trả về toàn bộ mảng sản phẩm
            }
        });
    } catch (error) {
        console.error('Error in /thongketheo-sanpham route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get low stock products and their colors
router.get('/low-stock-products', async (req, res) => {
    try {
        const query = `
            SELECT
                sp.ten_sanpham AS product_name,
                ms.ten_mau AS color_name,
                ssp.ten_size AS ten_size, 
                qlk.so_luong AS stock_quantity,
                sp.url_product AS product_image
            FROM
                QuanLyKho qlk
                JOIN ChiTietSanPham ctsp ON qlk.id_chitietsp = ctsp.id_chitietsp
                JOIN SanPham sp ON ctsp.id_sanpham = sp.id_sanpham
                JOIN MauSanPham ms ON qlk.id_mau = ms.id_mau
                JOIN SizeSanPham ssp ON qlk.id_size = ssp.id_size
            WHERE
                qlk.so_luong <= 10
            ORDER BY
                qlk.so_luong ASC;
        `;

        db.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching low-stock products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(results);
            }
        });
    } catch (error) {
        console.error('Error fetching low-stock products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Định nghĩa endpoint để lấy danh sách các danh mục cùng với tổng số sản phẩm trong mỗi danh mục
router.get('/getdanhmucandsum', (req, res) => {
    // Truy vấn SQL để lấy danh sách danh mục có id_danhmuc_cha là NULL cùng với tổng số sản phẩm
    const selectSumSql = `
        SELECT 
            d.id_danhmuc, 
            d.ten_danhmuc, 
            COUNT(s.id_sanpham) AS total_products
        FROM 
            danhmuc AS d
        LEFT JOIN 
            SanPham AS s 
        ON 
            d.id_danhmuc = s.id_DanhMuc
        WHERE 
            d.id_danhmuc_cha IS NOT  NULL
        GROUP BY 
            d.id_danhmuc, 
            d.ten_danhmuc
    `;

    // Thực hiện truy vấn SQL
    db.query(selectSumSql, (err, results) => {
        if (err) {
            // Nếu có lỗi xảy ra, trả về mã lỗi 500
            return res.status(500).json({ "thong bao": "Lỗi khi truy vấn danh sách danh mục cùng với tổng số sản phẩm", err });
        }

        // Trả về danh sách danh mục cùng với tổng số sản phẩm trong mỗi danh mục
        res.status(200).json(results);
    });
});




// Định nghĩa endpoint để lấy danh sách tất cả người dùng cùng với thời gian đăng nhập mới nhất
router.get('/getusers', (req, res) => {
    // Truy vấn SQL để lấy danh sách người dùng cùng với thời gian đăng nhập mới nhất
    const query = `
        SELECT 
            *,  -- Chọn tất cả các trường
            MAX(login_in) AS last_login  -- Lấy thời gian đăng nhập mới nhất
        FROM 
            nguoidung
        GROUP BY 
            id_user  -- Nhóm theo ID người dùng để đảm bảo mỗi người dùng chỉ xuất hiện một lần
        ORDER BY 
            last_login DESC  -- Sắp xếp theo thời gian đăng nhập mới nhất
    `;

    // Thực hiện truy vấn SQL
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching user list with last login:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Trả về danh sách người dùng cùng với thời gian đăng nhập mới nhất
        return res.status(200).json(results);
    });
});

router.get('/getusers-role', (req, res) => {
    // Truy vấn SQL để lấy danh sách người dùng với vai trò 2 và 3, sắp xếp vai trò 3 trước
    const query = `
        SELECT 
            *  -- Chọn tất cả các trường
        FROM 
            nguoidung
        WHERE 
            role IN (2, 3)  -- Chỉ chọn vai trò 2 và 3
        ORDER BY 
            role DESC  -- Sắp xếp sao cho vai trò 3 xuất hiện trước
    `;

    // Thực hiện truy vấn SQL
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching user list by role:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Trả về danh sách người dùng theo vai trò 2 và 3
        return res.status(200).json(results);
    });
});

// Route để lấy đơn hàng mới nhất từ bảng donhang với trạng thái là 1
router.get('/don-hang-moi-nhat', async (req, res) => {
    try {
        const query = `
            SELECT * FROM donhang WHERE tinh_trang = 1 ORDER BY id_donhang DESC LIMIT 8;
        `;
        db.query(query, (error, results) => {
            if (error) {
                console.error('Lỗi khi lấy đơn hàng mới nhất:', error);
                res.status(500).json({ error: 'Lỗi máy chủ' });
            } else {
                // Trả về dữ liệu của đơn hàng mới nhất với trạng thái là 1
                res.json(results[0]);
            }
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi lấy đơn hàng mới nhất:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});





router.get('/thong-ke-theo-thang', async (req, res) => {
    try {
        // Xác định thời điểm bắt đầu và kết thúc của tháng hiện tại
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        // Tính toán ngày đầu tiên của tháng hiện tại
        const currentMonthStart = new Date(currentYear, currentMonth, 1);

        // Tính toán ngày cuối cùng của tháng hiện tại
        const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);
        const currentMonthEnd = new Date(nextMonthStart - 1);

        // Định dạng thời gian cho SQL (YYYY-MM-DD)
        const formattedCurrentMonthStart = currentMonthStart.toISOString().split('T')[0];
        const formattedCurrentMonthEnd = currentMonthEnd.toISOString().split('T')[0];

        // Lấy dữ liệu thống kê cho mỗi ngày trong tháng
        const statistics = [];
        for (let i = 1; i <= currentMonthEnd.getDate(); i++) {
            const startDate = new Date(currentYear, currentMonth, i);
            const endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 1); // Ngày kế tiếp
            const formattedStartDate = startDate.toISOString().split('T')[0];
            const formattedEndDate = endDate.toISOString().split('T')[0];

            // Thực hiện truy vấn SQL để lấy tổng số đơn hàng cho mỗi ngày trong tháng
            const query = `
                SELECT 
                    SUM(total) AS totalDonHang
                FROM donhang
                WHERE tinh_trang = 3 AND ngay_dat >= ? AND ngay_dat < ?;
            `;
            db.query(query, [formattedStartDate, formattedEndDate], (error, result) => {
                if (error) {
                    console.error('Lỗi khi lấy thống kê theo tháng:', error);
                    res.status(500).json({ error: 'Lỗi máy chủ' });
                    return; // Thoát khỏi hàm callback nếu có lỗi
                }
                // Thêm kết quả vào mảng thống kê
                statistics.push({ ngay: formattedStartDate, tongDonHang: result[0].totalDonHang });
                // Trả về dữ liệu nếu đã lặp qua tất cả các ngày trong tháng
                if (statistics.length === currentMonthEnd.getDate()) {
                    res.json(statistics);
                }
            });
        }
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi lấy thống kê theo tháng:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});

router.get('/thong-ke-doanh-thu', async (req, res) => {
    try {
        // Lấy thông tin ngày bắt đầu và ngày kết thúc từ query params
        const { start_date, end_date } = req.query;

        // Kiểm tra xem có dữ liệu ngày bắt đầu và ngày kết thúc không
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Thiếu thông tin ngày bắt đầu hoặc ngày kết thúc.' });
        }

        // Chuyển đổi ngày bắt đầu và ngày kết thúc thành đối tượng Date
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Thiết lập ngày kết thúc là ngày cuối cùng của tháng
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); // Đặt ngày cuối cùng của tháng trước đó

        // Thực hiện truy vấn SQL để lấy danh sách các đơn hàng và tính tổng doanh thu từ ngày bắt đầu đến ngày kết thúc
        const query = `
            SELECT 
                id_donhang, total, ngay_dat
            FROM donhang
            WHERE tinh_trang = 3 AND ngay_dat >= ? AND ngay_dat <= ?;
        `;
        db.query(query, [startDate, endDate], (error, results) => {
            if (error) {
                console.error('Lỗi khi thống kê doanh thu:', error);
                return res.status(500).json({ error: 'Lỗi máy chủ' });
            }
            // Tính tổng doanh thu
            let totalRevenue = 0;
            if (results.length > 0) {
                totalRevenue = results.reduce((acc, curr) => acc + curr.total, 0);
            }
            // Trả về thông tin chi tiết của các đơn hàng và tổng doanh thu
            res.json({ start_date, end_date, totalRevenue, orders: results });
        });
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Lỗi khi thống kê doanh thu:', error);
        res.status(500).json({ error: 'Lỗi máy chủ' });
    }
});




module.exports = router;
