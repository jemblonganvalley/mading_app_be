const express = require("express")
const request_log = express.Router()
const fs = require("fs")
const path = require("path")

request_log.get("/request_log", async (req, res) => {
  try {
    const data = await fs.readFileSync(
      path.join(__dirname, "../logs/request.json"),
      { encoding: "utf-8" }
    )

    res.status(200).json(JSON.parse(data))
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

request_log.get("/request_clear", async (req, res) => {
  try {
    const clearLog = await fs.writeFileSync(
      path.join(__dirname, "../logs/request.json"),
      "[]",
      { encoding: "utf8" }
    )
    res.status(201).json({
      success: true,
      msg: "log clear",
    })
  } catch (error) {
    res.sendStatus(500)
  }
})

module.exports = request_log
