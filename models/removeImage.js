const fs = require('fs');

function removeImage(imagePath, callback) {
    fs.unlink(imagePath, err => {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            callback(null); // Không có lỗi, gọi lại với null
        }
    });
}

module.exports = removeImage;
