const express = require("express")
const path = require("path")
const fs = require("fs")
require("dotenv").config()
const bcryptjs = require("bcryptjs")
const salt = bcryptjs.genSaltSync(10)
const cryptojs = require("crypto-js")
const conn = require("../prisma/conn")
const { v4: uuidv4 } = require("uuid")
const jwt = require("jsonwebtoken")
const moment = require("moment")
const { upload_middleware } = require("../libs/upload_services")
const cloudinary = require("../libs/clodinary_services")
const checkUser = require("../middleware/checkuser")

const mading_route = express.Router()

// create mading
mading_route.post("/mading_create", upload_middleware.single("photo"), checkUser, async (req, res) => {
  try {
    const file = await req.file
    const data = await req.body
    const uploadToCloudinary = await cloudinary.uploader.upload(path.join(__dirname, `../temp/${file.filename}`), {
      use_filename: true,
      folder: "mading_app/mading_image",
      public_id: file.filename,
    })

    console.log(data)

    const createMading = await conn.madings.create({
      data: {
        user_id: data.user_id,
        content: data.content,
        image: uploadToCloudinary.secure_url,
      },
    })

    res.status(201).json({
      success: true,
      query: createMading,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

module.exports = mading_route
