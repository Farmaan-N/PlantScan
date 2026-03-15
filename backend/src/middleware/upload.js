/**
 * Upload Middleware (Multer)
 * Handles multipart/form-data image uploads
 * Stores files in memory (buffer) so we can forward them to PlantNet API
 */

const multer = require('multer');

// Use memory storage - keeps the file in a buffer instead of writing to disk.
// This is ideal for when we immediately forward the image to an external API.
const storage = multer.memoryStorage();

// File filter - only accept common image formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
});

module.exports = upload;
