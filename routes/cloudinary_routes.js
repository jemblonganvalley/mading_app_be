const express = require("express")
const path = require("path")
const fs = require("fs")
const { upload_middleware } = require("../libs/upload_services")
require("dotenv").config()
const cloudinary = require("../libs/clodinary_services")

const cloud_route = express.Router()

//create upload
cloud_route.post("/cloud_create", upload_middleware.single("photo"), async (req, res) => {
  try {
    const file = await req.file
    const fileLocation = await path.join(__dirname, `../temp/${file.filename}`)
    const uploadToCloudinary = await cloudinary.uploader.upload(fileLocation, {
      use_filename: true,
      folder: "mading_app/avatar",
      public_id: file.filename,
    })

    if (!uploadToCloudinary) {
      res.status(404).json({
        success: false,
        error: uploadToCloudinary,
      })
      return
    }

    res.status(201).json({
      success: true,
      response: uploadToCloudinary,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = cloud_route
