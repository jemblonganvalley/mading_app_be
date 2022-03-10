const cloudinary = require("cloudinary").v2
require("dotenv").config()

cloudinary.config({
  cloud_name: process.env.CLOD_CLOD_NAME,
  api_key: process.env.CLOD_API_KEY,
  api_secret: process.env.CLOD_API_SECRET,
  secure: true,
})

module.exports = cloudinary
