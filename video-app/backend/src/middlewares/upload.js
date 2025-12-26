import multer from 'multer';
const storage = multer.diskStorage({
  destination: (_req,_file,cb)=> cb(null, process.env.UPLOAD_DIR || './uploads'),
  filename: (_req,file,cb)=> {
    const ts = Date.now();
    const safe = file.originalname.replace(/\s+/g,'_');
    cb(null, `${ts}-${safe}`);
  }
});
export const videoUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  fileFilter: (_req,file,cb)=> {
    /video\/(mp4|quicktime|x-matroska|webm)/.test(file.mimetype) ? cb(null,true) : cb(new Error('Invalid file type'));
  }
});
