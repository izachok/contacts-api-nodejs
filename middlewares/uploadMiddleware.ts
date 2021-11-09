import multer from "multer";
import path from "path";

const tempDir = path.join(__dirname, "../", "tmp");

const uploadConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: uploadConfig,
});

export { upload };
