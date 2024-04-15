let express = require("express");
let router = express.Router();
let $ = require("jquery");
const request = require("request");
const moment = require("moment");
const db = require("../models/database");

router.post("/create_payment_url", function (req, res, next) {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let config = require("../config/vnpayment_config.json");

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;
    let orderId = req.body.orderId;
    let amount = req.body.amount;
    locale = "vn";

    let currCode = "VND";
    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    res.set("Content-Type", "text/html");
    res.send(vnpUrl);
  } catch (error) {
    console.error("Error creating payment URL:", error);
    res.status(500).send("Error creating payment URL");
  }
});

router.get("/vnpay_return", async function (req, res, next) {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    // Xóa các tham số liên quan đến mã bảo mật khỏi vnp_Params để tính toán lại mã bảo mật
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    // Sắp xếp các tham số trong vnp_Params để đảm bảo thứ tự giống nhau khi tính toán mã bảo mật
    vnp_Params = sortObject(vnp_Params);

    let config = require("../config/vnpayment_config.json");
    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;

    let querystring = require("qs");
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      const orderId = req.query.vnp_TxnRef;
      const sqlUpdateDonHang = "UPDATE `donhang` SET stt_pay = ?, ngay_thanh_toan = CURRENT_TIMESTAMP WHERE id_donhang = ?";
      const resultUpdateDonHang = await db.queryPromise(sqlUpdateDonHang, [2, orderId.toString()]);
      
      console.log("Number of records updated in DonHang table: " + resultUpdateDonHang.affectedRows);

      // Redirect đến trang thành công sau khi cập nhật thành công trong cơ sở dữ liệu
      res.redirect("http://localhost:3000/thanhtoanthanhcong/" + orderId);
    } else {
      res.render("success", { code: "97" });
    }
  } catch (error) {
    console.error("Error handling VNPay return:", error);
    res.status(500).send("Error handling VNPay return");
  }
});


function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = router;
