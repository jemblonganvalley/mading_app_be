const express = require("express")
const cors = require("cors")
require("dotenv").config()
const path = require("path")
const fs = require("fs")
const cloud_route = require("./routes/cloudinary_routes")
const user_route = require("./routes/user_routes")
const request_log = require("./routes/request_log_routes")
const mading_route = require("./routes/mading_routes")

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use("/api", cloud_route)
app.use("/api", user_route)
app.use("/api", mading_route)

app.listen(process.env.PORT, () => {
  console.info("server berjalan di port 9000")
})
