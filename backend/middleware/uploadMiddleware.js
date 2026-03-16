import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = CloudinaryStorage({
  cloudinary,
  params: (req, file, cb) => {
    cb(null, {
      folder: "resumes",
      resource_type: "raw",
      public_id: Date.now() + "-" + file.originalname,
      use_filename: true,
      unique_filename: false
    });
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX files allowed"), false);
    }
  }
});

export default upload;