const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploads a file to Cloudinary under the 'doctors' folder
async function uploadDoctorPhoto(fileBase64) {
  return cloudinary.uploader.upload(fileBase64, {
    folder: 'doctors',
    resource_type: 'image',
    overwrite: true,
  });
}

module.exports = { cloudinary, uploadDoctorPhoto };
