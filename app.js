var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var bodyParser = require('body-parser');

var DanhMuc = require('./routes/DanhMuc');
var SanPham = require('./routes/SanPham');
var ChiTietSanPham = require('./routes/ChiTietSanPham');
var KhoHang = require('./routes/KhoHang');
var DonHang = require('./routes/donhang');
var TaiKhoan = require('./routes/user');
// var order = require('./routes/order');
var payment = require('./routes/payment');
var GiamGia = require('./routes/GiamGia');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


app.use('/danhmuc', DanhMuc);
app.use('/sanpham', SanPham);
app.use('/chitietsanpham', ChiTietSanPham);
app.use('/khohang', KhoHang );
app.use('/donhang', DonHang );
app.use('/taikhoan', TaiKhoan );
app.use('/voucher', GiamGia );
// app.use('/order', order);
app.use('/payment', payment);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
