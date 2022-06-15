const multer = require('multer');

const allowerExtensions = ['.jpeg', '.jpg', '.png', '.bmp', '.psd', '.dng', '.raw', '.riff', '.gif'];

module.exports = multer({
    limits: {
        fileSize: 50000000
    },
    fileFilter(req, file, callback) {
        const found = allowerExtensions.filter(item => {
            return file.originalname.endsWith(item);
        });

        if (found.length <= 0) {
            return callback(new Error('The type of file is not supported.'), undefined);
        }

        callback(undefined, true);
    }
})