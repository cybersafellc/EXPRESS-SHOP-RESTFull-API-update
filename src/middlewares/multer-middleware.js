import multer from "multer";

//2
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/static/images");
  },
  filename: (req, file, cb) => {
    const newFileName = file.originalname.split(".");
    if (newFileName[1] === "png") {
      newFileName[1] = "png";
    } else if (newFileName[1] === "jpg") {
      newFileName[1] = "jpg";
    } else if (newFileName[1] === "jpeg") {
      newFileName[1] = "jpeg";
    } else {
      newFileName[1] = "png";
    }
    cb(null, newFileName.join("."));
  },
});

//1
const fileFilters = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const multers = multer({
  storage: fileStorage,
  fileFilter: fileFilters,
}).single("images");
