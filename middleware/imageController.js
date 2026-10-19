import multer from "multer";
import path from "path"; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimeType);
  if(extName && mimeType){
    return cb(null, true);
  } else {
    return cb(new Error("Incorrect file type. Only jpeg, png, and jpg formats are allowed."))
  }

}