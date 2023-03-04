const multer = require('multer');
const { failCode } = require('./response');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${process.cwd()}/public/img`);
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const newName = `${date.getTime()}_${file.originalname}`;
    cb(null, newName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      return failCode(req.res, 'Only .png, .jpg and .jpeg format allowed!');
    }
  },
});

module.exports = upload;
