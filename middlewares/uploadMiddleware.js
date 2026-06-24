const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configurar Cloudinary con variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Si las variables de Cloudinary no están configuradas, usamos memoria local
// para que el servidor no crashee en desarrollo
const storage = process.env.CLOUDINARY_CLOUD_NAME
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'voy-project/eventos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1200, height: 675, crop: 'limit' }]
      }
    })
  : multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB máximo
});

module.exports = upload;
