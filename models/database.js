//Database trả về kết nối với cơ sở dữ liệu
var mysql = require('mysql');
const util = require('util');

var db = mysql.createConnection({
   host: 'localhost',
   user: 'root', 
   password: '', 
   database: 'beef4'
}); 
db.queryPromise = util.promisify(db.query);
db.connect(() => console.log('Da ket noi database !'));


module.exports = db; 

