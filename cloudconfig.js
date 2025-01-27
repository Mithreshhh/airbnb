const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require("multer-storage-cloudinary");


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret:process.env.CLOUD_API_SCR
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "WanderLust_Dev",
      allowed_formats: ['jpg', 'png', 'jpeg','webp'] 
    },
  });
  module.exports = {cloudinary,
    storage,
};