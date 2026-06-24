const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

let storage;

// Intentar usar Cloudinary si las credenciales están definidas
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'voy-events',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
    }
  });
} else {
  // Asegurar que exista la carpeta uploads/ localmente para desarrollo
  if (!fs.existsSync('uploads/')) {
    fs.mkdirSync('uploads/', { recursive: true });
  }

  // Fallback para desarrollo local
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    }
  });
}

const upload = multer({ storage });

module.exports = upload;
