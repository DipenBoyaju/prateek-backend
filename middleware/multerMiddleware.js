import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

export const uploadPdf = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
}).single('file'); 
