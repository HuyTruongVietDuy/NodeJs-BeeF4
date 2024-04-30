-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th4 30, 2024 lúc 03:08 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `beef4vn`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `baiviet`
--

CREATE TABLE `baiviet` (
  `id_baiviet` int(11) NOT NULL,
  `tieude` varchar(255) NOT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `textare` text DEFAULT NULL,
  `url_baiviet` varchar(255) DEFAULT NULL,
  `trang_thai` tinyint(4) DEFAULT 1 COMMENT '1. Ẩn. 2. Hiện',
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `baiviet`
--

INSERT INTO `baiviet` (`id_baiviet`, `tieude`, `hinhanh`, `textare`, `url_baiviet`, `trang_thai`, `time_add`, `time_update`) VALUES
(1, ' 10 Xu Hướng Thời Trang Nổi Bật Cho Mùa Xuân Hè 2024', 'hinhanh-1713192366668.jpg', '<p><em>Mùa xuân hè năm nay chứng kiến sự trở lại của những xu hướng thú vị và độc đáo trong thế giới thời trang. Từ những gam màu tươi sáng đến kiểu dáng mới lạ, hãy cùng khám phá 10 xu hướng thời trang hot nhất cho mùa này.</em></p><p><br></p><p><img src=\"https://mcdn.coolmate.me/image/December2022/xu-huong-thoi-trang-xuan-he-2023-805_866.jpg\"></p><p>Mùa xuân hè năm nay đem lại cho chúng ta không chỉ là những cơn gió mát dịu và ánh nắng ấm áp, mà còn là những xu hướng thời trang mới lạ và hấp dẫn. Từ áo sơ mi phong cách safari đến váy dài xếp ly, danh sách những xu hướng thời trang hot nhất cho mùa này đang khiến giới mộ điệu trên khắp thế giới sục sôi.</p><p>Trong số những xu hướng nổi bật, chúng ta không thể không nhắc đến sự trở lại của các gam màu pastel, từ hồng nhạt, xanh dương nhẹ nhàng đến màu cam và hồng đất ấm áp. Điểm nhấn của mùa này cũng là sự xuất hiện của các họa tiết hoa văn, hoạt hình, và caro, tạo điểm nhấn độc đáo cho trang phục.</p><p>Bên cạnh đó, chất liệu như linen, cotton và silk vẫn tiếp tục là lựa chọn phổ biến, mang lại cảm giác thoải mái và nhẹ nhàng trong mỗi bước di chuyển. Xu hướng tái chế và thân thiện với môi trường cũng đang được ưa chuộng, với việc sử dụng vải tái chế và các thiết kế độc đáo từ vật liệu tái chế.</p>', ' 10-xu-huong-trang-noi-bat-cho-mua-xuan-he-2024', 2, '2024-04-15 12:50:28', '2024-04-15 14:46:06'),
(2, ' Bí Quyết Mix Đồ Phong Cách Cho Ngày Hè Năng Động', 'hinhanh-1713186115733.jpg', '<p>Mùa hè là thời điểm lý tưởng để thể hiện phong cách cá nhân của bạn thông qua cách mix đồ sành điệu và độc đáo. Với ánh nắng sáng chói và không khí năng động, bạn có thể thử nghiệm các trang phục từ crop top và quần short đến váy maxi và sandal gladiator.</p><p><br></p><p>Một trong những bí quyết quan trọng khi mix đồ cho mùa hè là chọn lựa chất liệu thoáng mát và dễ chịu như cotton, linen, hoặc chiffon. Đồng thời, hãy tạo điểm nhấn cho bộ trang phục của bạn bằng các phụ kiện như nơ, kính râm, và túi xách phong cách.</p><p><br></p><p><img src=\"https://www.elleman.vn/wp-content/uploads/2022/07/07/215678/Xuan-He-2023_elleman-2022.jpg\"></p><p><br></p><p>Đừng quên rằng phong cách là về cách bạn tự tin và thoải mái khi mặc trang phục của mình. Hãy thử nghiệm và khám phá để tìm ra phong cách riêng của bạn trong mỗi ngày hè năng động.</p>', ' bi-quyen-phoi-do-phong-cach-cho-ngay-he-nang-dong', 2, '2024-04-15 12:57:33', '2024-04-15 13:01:55'),
(3, 'Tổng Quan Về Xu Hướng Thời Trang Bền Vững và Cách Áp Dụng', 'hinhanh-1713186221103.jpg', '<p>Xu hướng thời trang bền vững đang dần trở thành một trong những yếu tố quan trọng không chỉ trong ngành công nghiệp thời trang mà còn trong cộng đồng tiêu dùng. Với tác động tiêu cực của ngành công nghiệp thời trang đối với môi trường và xã hội, việc chuyển đổi sang thời trang bền vững là điều không thể trì hoãn.</p><p><br></p><p><img src=\"https://www.modalia.es/wp-content/uploads/2016/10/9.jpg\"></p><p><br></p><p>Xu hướng thời trang bền vững đang dần trở thành một trong những yếu tố quan trọng không chỉ trong ngành công nghiệp thời trang mà còn trong cộng đồng tiêu dùng. Với tác động tiêu cực của ngành công nghiệp thời trang đối với môi trường và xã hội, việc chuyển đổi sang thời trang bền vững là điều không thể trì hoãn.</p><p><br></p><p>Đồng thời, người tiêu dùng cũng cần nhận thức về quyền lợi của mình và đòi hỏi sự minh bạch</p>', 'tong-quan-ve-Xu-huong-thoi-trang-ben-vung-va-cach-ap-dung', 2, '2024-04-15 13:03:41', '2024-04-15 14:48:52'),
(4, ' Cẩm Nang Chọn Lựa Trang Phục Phù Hợp Cho Văn Phòng', 'hinhanh-1713192868069.jpg', '<p>		Trang phục văn phòng đòi hỏi sự chuyên nghiệp và lịch lãm, nhưng vẫn phải phản ánh phong cách cá nhân của bạn. Mỗi ngày, bạn phải đối mặt với câu hỏi \"mặc gì hôm nay?\" và việc chọn lựa trang phục phù hợp có thể là một thách thức.</p><p><br></p><p>	Một trong những gợi ý cho việc mix đồ cho văn phòng là chọn lựa các item cơ bản như áo sơ mi trắng, quần âu đen, hoặc váy công sở xanh navy. Kết hợp với các phụ kiện như đồng hồ, giày cao gót, và túi xách đơn giản nhưng sang trọng để tạo điểm nhấn.</p><p><br></p><p>              <img src=\"http://designscene.net/wp-content/uploads/2012/02/Pull-Bear-SS12-05.jpg\"></p><p><br></p><p>			Đồng thời, hãy cân nhắc về việc chọn lựa chất liệu thoải mái và dễ chịu để bạn có thể thoải mái di chuyển trong suốt cả ngày làm việc. Hãy tự tin và phản ánh phong cách của bạn thông qua trang phục văn phòng của mình.</p>', 'cam-nang-chon-lua-trang-phuc-phu-hop-cho-van-phong', 2, '2024-04-15 14:54:28', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietsanpham`
--

CREATE TABLE `chitietsanpham` (
  `id_chitietsp` int(11) NOT NULL,
  `gia` int(11) NOT NULL,
  `gia_khuyenmai` int(11) DEFAULT NULL,
  `luot_xem` int(11) DEFAULT 0,
  `id_sanpham` int(11) DEFAULT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietsanpham`
--

INSERT INTO `chitietsanpham` (`id_chitietsp`, `gia`, `gia_khuyenmai`, `luot_xem`, `id_sanpham`, `time_add`, `time_update`) VALUES
(1, 450000, 0, 7, 1, '2024-04-15 09:56:18', NULL),
(2, 400000, 0, 8, 2, '2024-04-15 10:09:29', NULL),
(3, 460000, 400000, 8, 3, '2024-04-15 10:12:03', NULL),
(4, 560000, 0, 27, 4, '2024-04-15 10:18:33', NULL),
(5, 600000, 0, 61, 5, '2024-04-15 10:21:05', NULL),
(6, 600000, 550000, 59, 5, '2024-04-15 10:22:08', NULL),
(7, 400000, 0, 116, 6, '2024-04-15 10:25:56', NULL),
(8, 400000, 0, 116, 6, '2024-04-15 10:27:56', NULL),
(9, 460000, 0, 4, 7, '2024-04-26 14:23:05', NULL),
(10, 560000, 0, 16, 9, '2024-04-26 15:51:25', NULL),
(11, 150000, 0, 91, 10, '2024-04-26 15:59:22', NULL),
(12, 150000, 0, 91, 10, '2024-04-26 15:59:40', NULL),
(13, 150000, 0, 91, 10, '2024-04-26 15:59:52', NULL),
(14, 300000, 0, 36, 11, '2024-04-26 17:27:37', NULL),
(15, 300000, 0, 36, 11, '2024-04-26 17:28:21', NULL),
(16, 450000, 0, 0, 12, '2024-04-30 11:34:47', NULL),
(17, 300000, 0, 0, 13, '2024-04-30 11:40:21', NULL),
(18, 300000, 0, 0, 13, '2024-04-30 11:41:08', NULL),
(19, 399000, 0, 3, 14, '2024-04-30 11:48:44', NULL),
(20, 399000, 0, 3, 14, '2024-04-30 11:48:53', NULL),
(21, 420000, 380000, 0, 15, '2024-04-30 11:53:32', NULL),
(22, 1399000, 0, 0, 16, '2024-04-30 12:00:20', NULL),
(23, 310000, 0, 0, 17, '2024-04-30 12:05:52', NULL),
(24, 400000, 0, 0, 18, '2024-04-30 12:10:04', NULL),
(25, 200000, 0, 1, 19, '2024-04-30 12:14:48', NULL),
(26, 180000, 0, 0, 21, '2024-04-30 12:18:10', NULL),
(27, 490000, 4500000, 1, 22, '2024-04-30 12:22:40', NULL),
(28, 430000, 0, 0, 25, '2024-04-30 12:25:52', NULL),
(29, 200000, 0, 2, 26, '2024-04-30 12:31:06', NULL),
(30, 200000, 0, 2, 26, '2024-04-30 12:31:08', NULL),
(31, 200000, 0, 2, 26, '2024-04-30 12:31:11', NULL),
(32, 200000, 0, 2, 26, '2024-04-30 12:31:13', NULL),
(33, 650000, 0, 1, 27, '2024-04-30 12:38:14', NULL),
(34, 900000, 700000, 0, 28, '2024-04-30 12:41:22', NULL),
(35, 600000, 0, 0, 29, '2024-04-30 12:45:34', NULL),
(36, 899000, 799000, 3, 30, '2024-04-30 12:48:26', NULL),
(37, 899000, 799000, 3, 30, '2024-04-30 12:49:49', NULL),
(38, 500000, 0, 0, 31, '2024-04-30 13:00:14', NULL),
(39, 400000, 0, 0, 32, '2024-04-30 13:04:00', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhmuc`
--

CREATE TABLE `danhmuc` (
  `id_DanhMuc` int(11) NOT NULL,
  `ten_danhmuc` varchar(255) NOT NULL,
  `id_danhmuc_cha` int(11) DEFAULT NULL,
  `hinhanh` varchar(255) DEFAULT NULL,
  `url_category` varchar(255) DEFAULT NULL,
  `trang_thai` tinyint(4) DEFAULT 1 COMMENT '1. Ẩn. 2. hiện',
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NULL DEFAULT NULL
) ;

--
-- Đang đổ dữ liệu cho bảng `danhmuc`
--

INSERT INTO `danhmuc` (`id_DanhMuc`, `ten_danhmuc`, `id_danhmuc_cha`, `hinhanh`, `url_category`, `trang_thai`, `time_add`, `time_update`) VALUES
(1, 'Áo', NULL, NULL, 'danh-muc-ao', 2, '2024-04-15 09:11:14', '2024-04-15 09:25:22'),
(2, 'Áo thun', 1, 'hinhanh-1713172987566.webp', 'Ao-Thun', 2, '2024-04-15 09:23:07', NULL),
(3, 'Áo Polo', 1, 'hinhanh-1713173180979.webp', 'Ao-Polo', 2, '2024-04-15 09:26:20', NULL),
(4, 'Áo sơ mi', 1, 'hinhanh-1713173281666.webp', 'ao-so-mi', 2, '2024-04-15 09:28:01', NULL),
(5, 'Áo ba lỗ', 1, 'hinhanh-1713173386196.jpg', 'ao-ba-lo', 2, '2024-04-15 09:29:46', NULL),
(6, 'Quần', NULL, NULL, 'Bottoms', 2, '2024-04-15 09:30:33', NULL),
(7, 'Quần jeans', 6, 'hinhanh-1713173581165.webp', 'quan-jeans', 2, '2024-04-15 09:33:01', NULL),
(8, 'Quần Tây', 6, 'hinhanh-1713173634548.webp', 'quan-tay', 2, '2024-04-15 09:33:54', NULL),
(9, 'Quần đùi', 6, 'hinhanh-1713173930573.jpg', 'quan-dui', 2, '2024-04-15 09:38:50', NULL),
(10, 'Áo khoác', NULL, NULL, 'Outerwear', 2, '2024-04-15 09:41:27', NULL),
(11, 'Hoddie', 10, 'hinhanh-1713174151941.webp', 'hoodie-over-size', 2, '2024-04-15 09:42:31', NULL),
(12, 'Quần nỉ', 6, 'hinhanh-1713176657854.webp', 'quan-ni', 2, '2024-04-15 10:24:17', NULL),
(13, 'Jacket', 10, 'hinhanh-1714476821004.webp', 'Jacket', 2, '2024-04-30 11:33:41', NULL),
(14, 'Phụ kiện', NULL, NULL, 'items', 2, '2024-04-30 11:43:04', NULL),
(15, 'Túi xách', 14, 'hinhanh-1714477454203.png', 'tui-xách', 2, '2024-04-30 11:44:14', NULL),
(16, 'Nón', 14, 'hinhanh-1714479175384.jpg', 'non', 2, '2024-04-30 12:12:55', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donhang`
--

CREATE TABLE `donhang` (
  `id_donhang` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `hoten` varchar(255) NOT NULL,
  `sdt` varchar(20) NOT NULL,
  `diachi` varchar(255) NOT NULL,
  `tinh` varchar(255) DEFAULT NULL,
  `huyen` varchar(255) DEFAULT NULL,
  `xa` varchar(255) DEFAULT NULL,
  `Ghi_chu` varchar(255) DEFAULT NULL,
  `tinh_trang` tinyint(4) DEFAULT 1 COMMENT '1. Chờ xét duyệt, 2. Đã được xử lý, 3. Hoàn thành',
  `stt_pay` tinyint(4) DEFAULT 1 COMMENT '1. Chưa thanh toán, 2. Đã chuyển khoản',
  `ngay_dat` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_thanh_toan` date DEFAULT NULL,
  `total` int(11) DEFAULT NULL,
  `time_update` timestamp NULL DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_giamgia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `donhang`
--

INSERT INTO `donhang` (`id_donhang`, `email`, `hoten`, `sdt`, `diachi`, `tinh`, `huyen`, `xa`, `Ghi_chu`, `tinh_trang`, `stt_pay`, `ngay_dat`, `ngay_thanh_toan`, `total`, `time_update`, `id_user`, `id_giamgia`) VALUES
(1, 'quanghuyvoicontre@gmail.com', 'Trương Quang Huy', '0337667418', 'dsadas', 'Bà Rịa - Vũng Tàu', 'Châu Đức', 'Nghĩa Thành', '', 3, 1, '2024-04-16 09:57:13', NULL, 400000, NULL, 1, NULL),
(2, 'quanghuyvoicontre@gmail.com', 'Trương Quang Huy', 'dsa', 'dáđasadasdas', 'Bà Rịa - Vũng Tàu', 'Bà Rịa', 'Long Hương', '', 4, 1, '2024-04-16 10:24:11', NULL, 400000, NULL, 1, NULL),
(3, 'quanghuyvoicontre@gmail.com', 'Trương Quang Huy', '01686266202', 'ádsaddsadas', 'Đồng Nai', 'Cẩm Mỹ', 'Xuân Tây', '', 3, 1, '2024-04-26 11:29:34', NULL, 400000, NULL, 1, NULL),
(4, 'quanghuygta5vn@gmail.com', 'Truong Phuc', '0337667418', 'ap 1 to 1', 'Đồng Nai', 'Cẩm Mỹ', 'Xuân Tây', '', 3, 1, '2024-04-23 09:06:26', NULL, 4000000, NULL, 2, NULL),
(5, 'quanghuygta5vn@gmail.com', 'Truong Phuc', '01686266205', 'nhà đất anh nghĩa 137', 'Thành phố hồ chí minh', 'hốc môn', 'thới tam thôn 16', 'giao lẹ cho em', 3, 2, '2024-04-30 09:28:05', '2024-04-30', 560000, NULL, 2, NULL),
(6, 'quanghuygta5vn@gmail.com', 'Truong Phuc', '01686266205', 'nhà đất anh nghĩa 137', 'Thành phố hồ chí minh', 'hốc môn', 'thới tam thôn 16', '', 4, 1, '2024-04-30 09:30:14', NULL, 3360000, NULL, 2, NULL),
(7, 'huyvoicontre12@gmail.com', 'Trịnh Trần Phương Tuấn', '03699266205', '125c a1', 'Cà Mau', 'Đầm Dơi', 'Tân Tiến', '', 1, 1, '2024-04-30 09:48:09', NULL, 400000, NULL, 3, NULL),
(8, 'quanghuyvoicontre@gmail.com', 'Trương Quang Huy', '31232132132dá', 'dádsa', 'dsadas', 'dsa', 'dá2', '', 1, 1, '2024-04-30 11:10:02', NULL, 1200000, NULL, 1, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donhangchitiet`
--

CREATE TABLE `donhangchitiet` (
  `id_donhangchitiet` int(11) NOT NULL,
  `id_donhang` int(11) DEFAULT NULL,
  `ten_sanpham` varchar(255) DEFAULT NULL,
  `id_chitietsp` int(11) DEFAULT NULL,
  `id_size` int(11) DEFAULT NULL,
  `so_luong` int(11) NOT NULL DEFAULT 0,
  `gia_ban` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `donhangchitiet`
--

INSERT INTO `donhangchitiet` (`id_donhangchitiet`, `id_donhang`, `ten_sanpham`, `id_chitietsp`, `id_size`, `so_luong`, `gia_ban`) VALUES
(1, 1, 'SMART BAGGY TROUSERS', 7, 6, 1, 400000),
(2, 2, 'SMART BAGGY TROUSERS', 7, 6, 1, 400000),
(3, 3, 'SHORT SLEEVE STWD T-SHIRT', 2, 2, 1, 400000),
(4, 4, 'SMART BAGGY TROUSERS', 7, 6, 5, 2000000),
(5, 4, 'SHORT SLEEVE STWD T-SHIRT', 2, 2, 5, 2000000),
(6, 5, 'RIPSTOP CARGO BERMUDA SHORTS', 10, 8, 1, 560000),
(7, 6, 'RIPSTOP CARGO BERMUDA SHORTS', 10, 8, 6, 3360000),
(8, 7, 'SMART BAGGY TROUSERS', 7, 6, 1, 400000),
(9, 8, 'SMART BAGGY TROUSERS', 7, 6, 2, 800000),
(10, 8, 'SMART BAGGY TROUSERS', 8, 6, 1, 400000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giamgia`
--

CREATE TABLE `giamgia` (
  `id_giamgia` int(11) NOT NULL,
  `ma_giamgia` varchar(20) NOT NULL,
  `phan_tram` int(11) NOT NULL,
  `ngay_bat_dau` date NOT NULL,
  `ngay_ket_thuc` date NOT NULL,
  `ghi_chu` text DEFAULT NULL,
  `so_luong` int(11) DEFAULT 1,
  `trang_thai` tinyint(4) DEFAULT 1 COMMENT '1. Chưa sử dụng, 2. Đã sử dụng',
  `tinh_trang` tinyint(4) DEFAULT 1 COMMENT '1. Hoạt động, 2. Không hoạt động',
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `giamgia`
--

INSERT INTO `giamgia` (`id_giamgia`, `ma_giamgia`, `phan_tram`, `ngay_bat_dau`, `ngay_ket_thuc`, `ghi_chu`, `so_luong`, `trang_thai`, `tinh_trang`, `time_add`, `time_update`) VALUES
(1, 'voucher29', 20, '2024-04-15', '2024-04-18', NULL, 1, 1, 2, '2024-04-15 13:30:29', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `mausanpham`
--

CREATE TABLE `mausanpham` (
  `id_mau` int(11) NOT NULL,
  `ten_mau` varchar(50) NOT NULL,
  `Ma_mau` varchar(20) DEFAULT NULL,
  `hinh_anh_1` varchar(255) DEFAULT NULL,
  `hinh_anh_2` varchar(255) DEFAULT NULL,
  `hinh_anh_3` varchar(255) DEFAULT NULL,
  `hinh_anh_4` varchar(255) DEFAULT NULL,
  `hinh_anh_5` varchar(255) DEFAULT NULL,
  `hinh_anh_6` varchar(255) DEFAULT NULL,
  `id_chitietsp` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `mausanpham`
--

INSERT INTO `mausanpham` (`id_mau`, `ten_mau`, `Ma_mau`, `hinh_anh_1`, `hinh_anh_2`, `hinh_anh_3`, `hinh_anh_4`, `hinh_anh_5`, `hinh_anh_6`, `id_chitietsp`) VALUES
(1, 'Trắng', 'white', 'uploads\\image1-1713174992962.jpg', 'uploads\\image2-1713174996724.jpg', 'uploads\\image3-1713175000818.jpg', 'uploads\\image4-1713175010727.jpg', 'uploads\\image5-1713175014714.jpg', 'uploads\\image6-1713175018026.jpg', 1),
(2, 'aquamarine', 'aquamarine', 'uploads\\image1-1713175784565.jpg', 'uploads\\image2-1713175794300.jpg', 'uploads\\image3-1713175799513.jpg', 'uploads\\image4-1713175803701.jpg', 'uploads\\image5-1713175806972.jpg', 'uploads\\image6-1713175810088.jpg', 2),
(3, 'aqua', 'aqua', 'uploads\\image1-1713175931603.jpg', 'uploads\\image2-1713175935089.jpg', 'uploads\\image3-1713175938423.jpg', 'uploads\\image4-1713175941689.jpg', 'uploads\\image5-1713175944970.jpg', 'uploads\\image6-1713175948429.jpg', 3),
(4, 'đen', 'black', 'uploads\\image1-1713176326849.jpg', 'uploads\\image2-1713176329955.jpg', 'uploads\\image3-1713176333228.jpg', 'uploads\\image4-1713176337183.jpg', 'uploads\\image5-1713176340791.jpg', 'uploads\\image6-1713176344051.jpg', 4),
(5, 'đen', 'black', 'uploads\\image1-1713176488422.jpg', 'uploads\\image2-1713176484638.jpg', 'uploads\\image3-1713176492198.jpg', 'uploads\\image4-1713176499889.jpg', 'uploads\\image5-1713176504181.jpg', 'uploads\\image6-1713176507597.jpg', 5),
(6, 'xanh', 'blue', 'uploads\\image1-1713176534187.jpg', 'uploads\\image2-1713176537943.jpg', 'uploads\\image3-1713176541759.jpg', 'uploads\\image4-1713176545265.jpg', 'uploads\\image5-1713176549866.jpg', 'uploads\\image6-1713176553196.jpg', 6),
(7, 'đen', 'black', 'uploads\\image1-1713176773855.jpg', 'uploads\\image2-1713176797055.jpg', 'uploads\\image3-1713176800841.jpg', 'uploads\\image4-1713176804162.jpg', 'uploads\\image5-1713176808070.jpg', 'uploads\\image6-1713176812125.jpg', 7),
(8, 'xám', 'grey', 'uploads\\image1-1713176881881.jpg', 'uploads\\image2-1713176885955.jpg', 'uploads\\image3-1713176890613.jpg', 'uploads\\image4-1713176893671.jpg', 'uploads\\image5-1713176896712.jpg', 'uploads\\image6-1713176900066.jpg', 8),
(9, 'Cam đất', '#fe9000', 'uploads\\image1-1714141398294.jpg', 'uploads\\image2-1714141401786.jpg', 'uploads\\image3-1714141405330.jpg', 'uploads\\image4-1714141409215.jpg', 'uploads\\image5-1714141412860.jpg', 'uploads\\image6-1714141416919.jpg', 9),
(10, 'Cam đất', '#fe9000', 'uploads\\image1-1714152704191.jpg', 'uploads\\image2-1714152707667.jpg', 'uploads\\image3-1714152710924.jpg', 'uploads\\image4-1714152714580.jpg', 'uploads\\image5-1714152717940.jpg', 'uploads\\image6-1714152722186.jpg', 10),
(11, 'đen', 'black', 'uploads\\image1-1714147385534.jpg', 'uploads\\image2-1714147389384.jpg', 'uploads\\image3-1714147393780.jpg', 'uploads\\image4-1714147399602.jpg', 'uploads\\image5-1714147403356.jpg', 'uploads\\image6-1714147407712.jpg', 11),
(12, 'xám', 'grey', 'uploads\\image1-1714147547598.jpg', 'uploads\\image2-1714147551617.jpg', 'uploads\\image3-1714147556127.jpg', 'uploads\\image4-1714147559665.jpg', 'uploads\\image5-1714147566381.jpg', 'uploads\\image6-1714147570720.jpg', 12),
(13, 'trắng', 'white', 'uploads\\image1-1714147672171.jpg', 'uploads\\image2-1714147675960.jpg', 'uploads\\image3-1714147681328.jpg', 'uploads\\image4-1714147767163.jpg', 'uploads\\image5-1714147804467.jpg', 'uploads\\image6-1714147808512.jpg', 13),
(14, 'Đen', 'black', 'uploads\\image1-1714152467928.jpg', 'uploads\\image2-1714152471865.jpg', 'uploads\\image3-1714152475746.jpg', 'uploads\\image4-1714152479600.jpg', 'uploads\\image5-1714152483210.jpg', 'uploads\\image6-1714152488041.jpg', 14),
(15, 'trắng', 'white', 'uploads\\image1-1714152508782.jpg', 'uploads\\image2-1714152512421.jpg', 'uploads\\image3-1714152515799.jpg', 'uploads\\image4-1714152519819.jpg', 'uploads\\image5-1714152523619.jpg', 'uploads\\image6-1714152527074.jpg', 15),
(16, 'Đen', 'black', 'uploads\\image1-1714476908907.jpg', 'uploads\\image2-1714476912509.jpg', 'uploads\\image3-1714476916317.jpg', 'uploads\\image4-1714476920292.jpg', 'uploads\\image5-1714476924695.jpg', 'uploads\\image6-1714476928661.jpg', 16),
(17, 'Xanh', 'Blue', 'uploads\\image1-1714477234562.jpg', 'uploads\\image2-1714477238157.jpg', 'uploads\\image3-1714477242128.jpg', 'uploads\\image4-1714477245630.jpg', 'uploads\\image5-1714477249497.jpg', 'uploads\\image6-1714477253412.jpg', 17),
(18, 'trắng', 'white', 'uploads\\image1-1714477275582.jpg', 'uploads\\image2-1714477278680.jpg', 'uploads\\image3-1714477282313.jpg', 'uploads\\image4-1714477285678.jpg', 'uploads\\image5-1714477289808.jpg', 'uploads\\image6-1714477293501.jpg', 18),
(19, 'đen', '', 'uploads\\image1-1714477767673.jpg', 'uploads\\image2-1714477771104.jpg', 'uploads\\image3-1714477774763.jpg', 'uploads\\image4-1714477778175.jpg', NULL, 'uploads\\image6-1714477782275.jpg', 19),
(20, 'trắng', '', 'uploads\\image1-1714477820342.jpg', 'uploads\\image2-1714477823394.jpg', 'uploads\\image3-1714477830661.jpg', 'uploads\\image4-1714477833944.jpg', NULL, 'uploads\\image6-1714477837338.jpg', 20),
(21, 'đen', 'black', 'uploads\\image1-1714478021834.jpg', 'uploads\\image2-1714478024613.jpg', 'uploads\\image3-1714478027349.jpg', 'uploads\\image4-1714478030136.jpg', NULL, 'uploads\\image6-1714478033393.jpg', 21),
(22, 'Xanh', 'Green', 'uploads\\image1-1714478439207.jpg', 'uploads\\image2-1714478442147.jpg', 'uploads\\image3-1714478444953.jpg', 'uploads\\image4-1714478448277.jpg', 'uploads\\image5-1714478451664.jpg', 'uploads\\image6-1714478454715.jpg', 22),
(23, 'Neon blue', '', 'uploads\\image1-1714478765902.jpg', 'uploads\\image2-1714478768654.jpg', 'uploads\\image3-1714478771487.jpg', 'uploads\\image4-1714478774586.jpg', 'uploads\\image5-1714478777395.jpg', 'uploads\\image6-1714478780440.jpg', 23),
(24, 'xám', 'grey', 'uploads\\image1-1714479013928.jpg', 'uploads\\image2-1714479017220.jpg', 'uploads\\image3-1714479020652.jpg', 'uploads\\image4-1714479023743.jpg', 'uploads\\image5-1714479026875.jpg', 'uploads\\image6-1714479031159.jpg', 24),
(25, 'nâu', 'brown', 'uploads\\image1-1714479296683.jpg', 'uploads\\image2-1714479299509.jpg', 'uploads\\image3-1714479302850.jpg', NULL, NULL, 'uploads\\image6-1714479306219.jpg', 25),
(26, 'xám', 'grey', 'uploads\\image1-1714479497077.jpg', 'uploads\\image2-1714479499871.jpg', 'uploads\\image3-1714479502512.jpg', 'uploads\\image4-1714479505395.jpg', NULL, 'uploads\\image6-1714479508388.jpg', 26),
(27, 'xanh navy', '', 'uploads\\image1-1714479774822.jpg', 'uploads\\image2-1714479777344.jpg', 'uploads\\image3-1714479779911.jpg', 'uploads\\image4-1714479782834.jpg', 'uploads\\image5-1714479786530.jpg', 'uploads\\image6-1714479789895.jpg', 27),
(28, 'trắng', '', 'uploads\\image1-1714479958492.jpg', 'uploads\\image2-1714479961367.jpg', 'uploads\\image3-1714479964312.jpg', 'uploads\\image4-1714479967475.jpg', 'uploads\\image5-1714479971077.jpg', 'uploads\\image6-1714479974225.jpg', 28),
(29, 'đen', 'black', 'uploads\\image1-1714480301796.jpg', 'uploads\\image2-1714480306731.jpg', 'uploads\\image3-1714480311447.jpg', 'uploads\\image4-1714480316739.jpg', 'uploads\\image5-1714480322044.jpg', 'uploads\\image6-1714480326819.jpg', 29),
(30, 'xám', 'grey', 'uploads\\image1-1714480379325.jpg', 'uploads\\image2-1714480383074.jpg', 'uploads\\image3-1714480387807.jpg', 'uploads\\image4-1714480393267.jpg', 'uploads\\image5-1714480404311.jpg', 'uploads\\image6-1714480417361.jpg', 30),
(31, 'đỏ', 'red', 'uploads\\image1-1714480439949.jpg', 'uploads\\image2-1714480443520.jpg', 'uploads\\image3-1714480448974.jpg', 'uploads\\image4-1714480455066.jpg', 'uploads\\image5-1714480459513.jpg', 'uploads\\image6-1714480464779.jpg', 31),
(32, 'trắng', '', 'uploads\\image1-1714480488499.jpg', 'uploads\\image2-1714480492071.jpg', 'uploads\\image3-1714480498021.jpg', 'uploads\\image4-1714480504371.jpg', 'uploads\\image5-1714480510918.jpg', 'uploads\\image6-1714480516128.jpg', 32),
(33, 'trắng', '', 'uploads\\image1-1714480708849.jpg', 'uploads\\image2-1714480712003.jpg', 'uploads\\image3-1714480716214.jpg', 'uploads\\image4-1714480720355.jpg', 'uploads\\image5-1714480724262.jpg', 'uploads\\image6-1714480729005.jpg', 33),
(34, 'black', '', 'uploads\\image1-1714480932312.jpg', 'uploads\\image2-1714480935515.jpg', 'uploads\\image3-1714480938364.jpg', 'uploads\\image4-1714480941297.jpg', 'uploads\\image5-1714480944562.jpg', 'uploads\\image6-1714480948398.jpg', 34),
(35, 'xám', 'grey', 'uploads\\image1-1714481157223.jpg', 'uploads\\image2-1714481160119.jpg', 'uploads\\image3-1714481162911.jpg', 'uploads\\image4-1714481166042.jpg', 'uploads\\image5-1714481168906.jpg', 'uploads\\image6-1714481172094.jpg', 35),
(36, 'đen', 'black', 'uploads\\image1-1714481317472.jpg', 'uploads\\image2-1714481320115.jpg', 'uploads\\image3-1714481322969.jpg', 'uploads\\image4-1714481326310.jpg', 'uploads\\image5-1714481329488.jpg', 'uploads\\image6-1714481332402.jpg', 36),
(37, 'cam', 'orange', 'uploads\\image1-1714481396887.jpg', 'uploads\\image2-1714481400632.jpg', 'uploads\\image3-1714481405500.jpg', 'uploads\\image4-1714481409489.jpg', 'uploads\\image5-1714481413148.jpg', 'uploads\\image6-1714481417137.jpg', 37),
(38, 'xám', 'grey', 'uploads\\image1-1714482055685.jpg', 'uploads\\image2-1714482059229.jpg', 'uploads\\image3-1714482062805.jpg', 'uploads\\image4-1714482067701.jpg', 'uploads\\image5-1714482071958.jpg', 'uploads\\image6-1714482075417.jpg', 38),
(39, 'xám', 'grey', 'uploads\\image1-1714482271686.jpg', 'uploads\\image2-1714482274193.jpg', 'uploads\\image3-1714482276897.jpg', 'uploads\\image4-1714482280260.jpg', 'uploads\\image5-1714482283614.jpg', 'uploads\\image6-1714482287137.jpg', 39);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

CREATE TABLE `nguoidung` (
  `id_user` int(11) NOT NULL,
  `ho_ten` varchar(255) NOT NULL,
  `ten_dangnhap` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sdt` varchar(20) DEFAULT NULL,
  `diachi` varchar(255) DEFAULT NULL,
  `tinh` varchar(255) DEFAULT NULL,
  `huyen` varchar(255) DEFAULT NULL,
  `xa` varchar(255) DEFAULT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 1 COMMENT 'Vai trò của người dùng: 1 - Khách hàng, 2 - Nhân viên, 3 - Admin',
  `matkhau` varchar(255) NOT NULL,
  `gioi_tinh` enum('Nam','Nữ','Khác') NOT NULL,
  `login_in` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Thời điểm đăng nhập',
  `login_out` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời điểm đăng xuất',
  `time_add` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Thời điểm thêm vào'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`id_user`, `ho_ten`, `ten_dangnhap`, `email`, `sdt`, `diachi`, `tinh`, `huyen`, `xa`, `role`, `matkhau`, `gioi_tinh`, `login_in`, `login_out`, `time_add`) VALUES
(1, 'Trương Quang Huy', 'admin', 'quanghuyvoicontre@gmail.com', '31232132132dá', 'dádsa', 'dsadas', 'dsa', 'dá2', 3, '$2b$10$plqwAngjwblT1WcaPQ2ei.JuyoaswJOSHNkt4weLmYLBHmyA.LuHu', 'Nam', '2024-04-30 11:02:12', '2024-04-16 08:52:32', '2024-04-16 08:52:32'),
(2, 'Truong Phuc', 'phucem1234', 'quanghuygta5vn@gmail.com', '01686266205', 'nhà đất anh nghĩa 137', 'Thành phố hồ chí minh', 'hốc môn', 'thới tam thôn 16', 1, '$2b$10$3z9/4B7w5VRK0YQKjS4Caetla9r/d13lpEcwcoe057fYczQu2fzi.', 'Nam', '2024-04-30 09:27:52', '2024-04-25 04:49:28', '2024-04-25 04:49:28'),
(3, 'Trịnh Trần Phương Tuấn', 'iack5cu', 'huyvoicontre12@gmail.com', NULL, NULL, NULL, NULL, NULL, 1, '$2b$10$7j99fI1leBoSdnQxnpcFmeH1uTYlkdW9u.A94Y/dU5UEuOHe.MPQG', 'Nam', '2024-04-30 09:46:17', '2024-04-30 09:45:59', '2024-04-30 09:45:59');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quanlykho`
--

CREATE TABLE `quanlykho` (
  `id_kho` int(11) NOT NULL,
  `id_chitietsp` int(11) DEFAULT NULL,
  `id_mau` int(11) DEFAULT NULL,
  `id_size` int(11) DEFAULT NULL,
  `so_luong` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `quanlykho`
--

INSERT INTO `quanlykho` (`id_kho`, `id_chitietsp`, `id_mau`, `id_size`, `so_luong`) VALUES
(1, 7, 7, 6, 15),
(2, 7, 7, 7, 20),
(3, 2, 2, 1, 0),
(4, 2, 2, 2, -3),
(5, 10, 10, 5, 10),
(6, 10, 10, 6, 10),
(7, 10, 10, 7, 10),
(8, 10, 10, 8, 4),
(9, 25, 25, 2, 1),
(10, 25, 25, 3, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham`
--

CREATE TABLE `sanpham` (
  `id_sanpham` int(11) NOT NULL,
  `ten_sanpham` varchar(255) NOT NULL,
  `id_DanhMuc` int(11) DEFAULT NULL,
  `mota` varchar(255) NOT NULL,
  `chatlieu` varchar(255) NOT NULL,
  `url_product` varchar(255) NOT NULL,
  `kieu_dang` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `trang_thai` tinyint(4) DEFAULT 1 COMMENT '1. ẩn.  2. hiện',
  `time_add` timestamp NOT NULL DEFAULT current_timestamp(),
  `time_update` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`id_sanpham`, `ten_sanpham`, `id_DanhMuc`, `mota`, `chatlieu`, `url_product`, `kieu_dang`, `description`, `trang_thai`, `time_add`, `time_update`) VALUES
(1, 'EMBROIDERED TERRY FABRIC T-SHIRT', 2, 'EMBROIDERED TERRY FABRIC T-SHIRT', 'Cotton 80% - 20% polyter', 'EMBROIDERED-TERRY-FABRIC-T-SHIRT', 'relax fit', '', 2, '2024-04-15 09:55:54', '2024-04-15 06:25:51'),
(2, 'SHORT SLEEVE STWD T-SHIRT', 2, 'SHORT SLEEVE STWD T-SHIRT', '100% cotton', 'SHORT-SLEEVE-STWD-T-SHIRT', 'relex fit', '', 2, '2024-04-15 10:08:23', NULL),
(3, 'WASHED STWD GRAPHIC T-SHIRT', 2, 'WASHED STWD GRAPHIC T-SHIRT', '100% cotton', 'WASHED-STWD-GRAPHIC-T-SHIRT', 'relax fit', '', 2, '2024-04-15 10:11:43', NULL),
(4, 'BAGGY JEANS', 7, 'BAGGY JEANS', 'jean 100%', 'BAGGY-JEANS', 'fit', '', 2, '2024-04-15 10:18:19', NULL),
(5, 'SKATER JEANS', 7, 'SKATER JEANS', 'jean 100%', 'SKATER-JEANS', 'relax', '', 2, '2024-04-15 10:20:18', NULL),
(6, 'SMART BAGGY TROUSERS', 12, 'SMART BAGGY TROUSERS', 'cotton 80% - polyter 20%', 'SMART-BAGGY-TROUSERS', 'Relax', '', 2, '2024-04-15 10:25:40', NULL),
(7, 'SHORT SLEEVE SHIRT IN RIPSTOP FABRIC', 4, 'Short sleeve T-shirt in ripstop fabric with a front flap pocket and button fastening.', '100% cotton', 'SHORT-SLEEVE-SHIRT-IN-RIPSTOP-FABRIC', 'Boxy', '', 2, '2024-04-26 14:21:19', NULL),
(9, 'RIPSTOP CARGO BERMUDA SHORTS', 9, 'Cargo Bermuda shorts in ripstop fabric with an elasticated waistband and flap pockets on the legs. Made of 100% cotton.', '100% Cotton ', 'RIPSTOP-CARGO-BERMUDA-SHORTS', 'Relax', '', 2, '2024-04-26 15:50:38', NULL),
(10, 'RIBBED VEST TOP', 5, 'Basic strappy top with a round neck and ribbed trims. Available in assorted colours. Made of cotton.', '100% cotton', 'RIBBED-VEST-TOP', 'Fit', '', 2, '2024-04-26 15:59:08', NULL),
(11, 'BASIC SHORT SLEEVE KNIT POLO SHIRT', 3, 'Basic short sleeve knit polo shirt with button fastening on the neckline. Available in assorted colours. Made of a viscose blend.', '70% viscose - 30% polyamide', 'BASIC-SHORT-SLEEVE-KNIT-POLO-SHIRT', 'Fit', '', 2, '2024-04-26 17:26:30', NULL),
(12, 'BASIC BLACK JACKET', 13, 'Basic black jacket with side pockets, zip fastening and logo detail on the front. Made of cotton.', '100% polyester', 'BASIC-BLACK-JACKET', 'Boxy', '', 2, '2024-04-30 11:34:31', NULL),
(13, 'BAGGY DENIM BERMUDA SHORTS', 9, 'Baggy denim Bermuda shorts with a five-pocket design, waistband with belt loops, zip fly and top button fastening. Made of cotton.', '100% cotton', 'BAGGY-DENIM-BERMUDA-SHORTS', 'Short', '', 2, '2024-04-30 11:39:58', NULL),
(14, 'MINI CROSSBODY BAG WITH STRAP', 15, 'Mini crossbody bag available in several colours. Soft exterior. Long adjustable shoulder strap. Zip closure.', '100% polyurethane - 100% polyester', 'MINI-CROSSBODY-BAG-WITH-STRAP', 'Belt Bag', '', 2, '2024-04-30 11:48:23', NULL),
(15, 'MOBILE PHONE BAG WITH FLAPMOBILE PHONE BAG WITH FLAP', 15, 'Mobile phone bag available in black. Outer coin purse detail. Long adjustable strap. Front flap with magnetic clasp closure.', '10% polyester - 90% polyurethane', 'MOBILE PHONE-BAG-WITH-FLAPMOBILE-PHONE-BAG-WITH-FLAP', 'SADDLE', '', 2, '2024-04-30 11:53:04', NULL),
(16, 'FAUX LEATHER TRUCKER JACKET', 13, 'Faux leather trucker jacket with a shirt collar, front pockets and button fastening. Available in assorted colours.', '50% polyester - 50% polyurethane', 'FAUX-LEATHER-TRUCKER-JACKET', 'Boxy', '', 2, '2024-04-30 12:00:09', NULL),
(17, 'DENIM SKATER BERMUDA SHORTS', 9, 'Baggy skater denim Bermuda shorts with a five-pocket design, waistband with belt loops, zip fly and top button fastening. Made of cotton.', '100% cotton', 'DENIM-SKATER-BERMUDA-SHORTS', 'Short', '', 2, '2024-04-30 12:05:16', NULL),
(18, 'WASHED CARGO BERMUDA SHORTS', 9, 'Cargo Bermuda shorts available in assorted colours with a washed finish, flap pockets on the leg and an elasticated waistband with drawstrings. Made of cotton.', '100% cotton', 'WASHED-CARGO-BERMUDA-SHORTS', 'Short', '', 2, '2024-04-30 12:09:49', NULL),
(19, 'TIGER RANCH” TRUCKER CAP', 16, 'Trucker cap with a curved peak and Tiger Ranch embroidery on the front panel.', '60% cotton - 40% polyester', 'TIGER-RANCH-TRUCKER-CAP', 'fit', '', 2, '2024-04-30 12:14:36', NULL),
(21, 'BLACK WASHED CAP WITH EMBROIDERY', 16, '', 'cotton 100%', 'BLACK-WASHED-CAP-WITH-EMBROIDERY', '', '', 2, '2024-04-30 12:17:03', '2024-04-30 05:22:01'),
(22, 'LOOSE-FIT BAGGY JEANS', 7, 'Loose-fit baggy jeans with a five-pocket design, belt loops and zip fly and top button fastening. Made of cotton.', '100% cotton', 'LOOSE-FIT_BAGGY_JEANS', 'Fit', '', 2, '2024-04-30 12:21:26', '2024-04-30 05:22:14'),
(25, 'RIPPED STANDARD FIT JEANS', 7, 'Loose-fit baggy jeans with a five-pocket design, belt loops and zip fly and top button fastening. Made of cotton.', '100% Cotton', 'RIPPED STANDARD FIT JEANS', 'Fit', '', 2, '2024-04-30 12:25:39', NULL),
(26, 'BASIC SHORT SLEEVE COTTON T-SHIRT', 2, 'Basic short sleeve T-shirt with a round neck. Made of 100% cotton.', '100% cotton', 'BASIC SHORT SLEEVE COTTON T-SHIRT', 'Relax', '', 2, '2024-04-30 12:30:52', NULL),
(27, 'ENCINO LA HOODIE', 11, 'Hoodie with adjustable drawstrings, a pouch pocket and embroidered Encino Los Angeles slogan detail.', '60% cotton - 39% polyester - 1% elastane', 'ENCINO LA HOODIE', 'Over-Size', '', 2, '2024-04-30 12:37:42', NULL),
(28, 'HOODIE WITH FRONT GRAPHIC', 11, 'Long sleeve hoodie with a contrast graphic on the front.', '70% cotton - 30% polyester - 0% elastane', 'HOODIE WITH FRONT GRAPHIC', 'Over-size', '', 2, '2024-04-30 12:40:59', NULL),
(29, 'WIDE-LEG SMART TROUSERS', 8, 'Wide-leg tailored fit smart trousers featuring front darts, belt loops and button and zip fly fastening.', '72% polyester - 25% viscose - 3% elastane', 'Wide-leg smart trousers, Black Wide-leg smart trousers, Black Wide-leg smart trousers, Black Wide-leg smart trousers, Black Wide-leg smart trousers, Black Wide-leg smart trousers, Black Wide-leg smart trousers, Black Wide-leg smart trousers, Black WIDE-LE', 'Relax', '', 2, '2024-04-30 12:44:47', '2024-04-30 05:45:19'),
(30, 'STRAIGHT CHINO TROUSERS', 8, 'Straight chino trousers with belt loops and zip fly and top button fastening.', '59% cotton - 41% polyester', 'STRAIGHT CHINO TROUSERS', 'Relax', '', 2, '2024-04-30 12:47:54', NULL),
(31, 'BASIC COLOURED HOODIE', 11, 'Basic hoodie with a front pouch pocket and ribbed cuffs and hem. Available in a range of colours. Made from a cotton blend.', '51% cotton - 49% polyester - 0% elastane', 'BASIC COLOURED HOODIE', 'Fit', '', 2, '2024-04-30 12:59:46', NULL),
(32, 'WIDE-LEG JOGGER TROUSERS', 12, 'Wide-leg joggers with pockets and an elasticated waist.', '80% cotton - 20% polyester', 'WIDE-LEG JOGGER TROUSERS', 'Fit', '', 2, '2024-04-30 13:03:46', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanphamyeuthich`
--

CREATE TABLE `sanphamyeuthich` (
  `id` int(11) NOT NULL,
  `id_sanpham` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `time_add` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sizesanpham`
--

CREATE TABLE `sizesanpham` (
  `id_size` int(11) NOT NULL,
  `ten_size` varchar(20) NOT NULL,
  `id_size_Cha` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sizesanpham`
--

INSERT INTO `sizesanpham` (`id_size`, `ten_size`, `id_size_Cha`) VALUES
(1, 'S', 1),
(2, 'M', 1),
(3, 'L', 1),
(4, 'XL', 1),
(5, '26', 5),
(6, '27', 5),
(7, '28', 5),
(8, '29', 5),
(9, '30', 5),
(10, '31', 5),
(11, '32', 5),
(12, '33', 5),
(13, '34', 5),
(14, '35', 5),
(15, '36', 5),
(16, '37', 5),
(17, '38', 5),
(18, '39', 5),
(19, '40', 5);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `baiviet`
--
ALTER TABLE `baiviet`
  ADD PRIMARY KEY (`id_baiviet`);

--
-- Chỉ mục cho bảng `chitietsanpham`
--
ALTER TABLE `chitietsanpham`
  ADD PRIMARY KEY (`id_chitietsp`),
  ADD KEY `id_sanpham` (`id_sanpham`);

--
-- Chỉ mục cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD PRIMARY KEY (`id_DanhMuc`),
  ADD UNIQUE KEY `ten_danhmuc` (`ten_danhmuc`),
  ADD KEY `id_danhmuc_cha` (`id_danhmuc_cha`);

--
-- Chỉ mục cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD PRIMARY KEY (`id_donhang`),
  ADD KEY `fk_id_user` (`id_user`),
  ADD KEY `fk_donhang_giamgia` (`id_giamgia`);

--
-- Chỉ mục cho bảng `donhangchitiet`
--
ALTER TABLE `donhangchitiet`
  ADD PRIMARY KEY (`id_donhangchitiet`),
  ADD KEY `id_donhang` (`id_donhang`);

--
-- Chỉ mục cho bảng `giamgia`
--
ALTER TABLE `giamgia`
  ADD PRIMARY KEY (`id_giamgia`),
  ADD UNIQUE KEY `ma_giamgia` (`ma_giamgia`);

--
-- Chỉ mục cho bảng `mausanpham`
--
ALTER TABLE `mausanpham`
  ADD PRIMARY KEY (`id_mau`),
  ADD KEY `id_chitietsp` (`id_chitietsp`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `unique_ten_dangnhap` (`ten_dangnhap`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- Chỉ mục cho bảng `quanlykho`
--
ALTER TABLE `quanlykho`
  ADD PRIMARY KEY (`id_kho`),
  ADD UNIQUE KEY `unique_combination` (`id_chitietsp`,`id_mau`,`id_size`),
  ADD KEY `fk_mau` (`id_mau`),
  ADD KEY `fk_size` (`id_size`);

--
-- Chỉ mục cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`id_sanpham`),
  ADD UNIQUE KEY `ten_sanpham` (`ten_sanpham`),
  ADD KEY `id_DanhMuc` (`id_DanhMuc`);

--
-- Chỉ mục cho bảng `sanphamyeuthich`
--
ALTER TABLE `sanphamyeuthich`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`id_sanpham`,`id_user`),
  ADD KEY `id_user` (`id_user`);

--
-- Chỉ mục cho bảng `sizesanpham`
--
ALTER TABLE `sizesanpham`
  ADD PRIMARY KEY (`id_size`),
  ADD UNIQUE KEY `ten_size` (`ten_size`),
  ADD KEY `id_size_Cha` (`id_size_Cha`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `baiviet`
--
ALTER TABLE `baiviet`
  MODIFY `id_baiviet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `chitietsanpham`
--
ALTER TABLE `chitietsanpham`
  MODIFY `id_chitietsp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  MODIFY `id_DanhMuc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `donhang`
--
ALTER TABLE `donhang`
  MODIFY `id_donhang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `donhangchitiet`
--
ALTER TABLE `donhangchitiet`
  MODIFY `id_donhangchitiet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `giamgia`
--
ALTER TABLE `giamgia`
  MODIFY `id_giamgia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `mausanpham`
--
ALTER TABLE `mausanpham`
  MODIFY `id_mau` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `quanlykho`
--
ALTER TABLE `quanlykho`
  MODIFY `id_kho` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `id_sanpham` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `sanphamyeuthich`
--
ALTER TABLE `sanphamyeuthich`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT cho bảng `sizesanpham`
--
ALTER TABLE `sizesanpham`
  MODIFY `id_size` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chitietsanpham`
--
ALTER TABLE `chitietsanpham`
  ADD CONSTRAINT `chitietsanpham_ibfk_1` FOREIGN KEY (`id_sanpham`) REFERENCES `sanpham` (`id_sanpham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD CONSTRAINT `danhmuc_ibfk_1` FOREIGN KEY (`id_danhmuc_cha`) REFERENCES `danhmuc` (`id_DanhMuc`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `fk_donhang_giamgia` FOREIGN KEY (`id_giamgia`) REFERENCES `giamgia` (`id_giamgia`),
  ADD CONSTRAINT `fk_id_user` FOREIGN KEY (`id_user`) REFERENCES `nguoidung` (`id_user`);

--
-- Các ràng buộc cho bảng `donhangchitiet`
--
ALTER TABLE `donhangchitiet`
  ADD CONSTRAINT `donhangchitiet_ibfk_1` FOREIGN KEY (`id_donhang`) REFERENCES `donhang` (`id_donhang`);

--
-- Các ràng buộc cho bảng `mausanpham`
--
ALTER TABLE `mausanpham`
  ADD CONSTRAINT `mausanpham_ibfk_1` FOREIGN KEY (`id_chitietsp`) REFERENCES `chitietsanpham` (`id_chitietsp`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `quanlykho`
--
ALTER TABLE `quanlykho`
  ADD CONSTRAINT `fk_chitietsp` FOREIGN KEY (`id_chitietsp`) REFERENCES `chitietsanpham` (`id_chitietsp`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_mau` FOREIGN KEY (`id_mau`) REFERENCES `mausanpham` (`id_mau`),
  ADD CONSTRAINT `fk_size` FOREIGN KEY (`id_size`) REFERENCES `sizesanpham` (`id_size`);

--
-- Các ràng buộc cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`id_DanhMuc`) REFERENCES `danhmuc` (`id_DanhMuc`);

--
-- Các ràng buộc cho bảng `sanphamyeuthich`
--
ALTER TABLE `sanphamyeuthich`
  ADD CONSTRAINT `sanphamyeuthich_ibfk_1` FOREIGN KEY (`id_sanpham`) REFERENCES `sanpham` (`id_sanpham`),
  ADD CONSTRAINT `sanphamyeuthich_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `nguoidung` (`id_user`);

--
-- Các ràng buộc cho bảng `sizesanpham`
--
ALTER TABLE `sizesanpham`
  ADD CONSTRAINT `sizesanpham_ibfk_1` FOREIGN KEY (`id_size_Cha`) REFERENCES `sizesanpham` (`id_size`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
