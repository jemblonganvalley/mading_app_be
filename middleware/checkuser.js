const { request, response } = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const fs = require("fs")
const path = require("path")

const checkUser = async (req = request, res = response, next) => {
  try {
    const file = await req.file
    const auth = await req.headers.authorization
    if (!auth) {
      fs.unlinkSync(path.join(__dirname, `../temp/${file.filename}`))
      res.sendStatus(401)
      return
    }

    const token = await auth.split(" ")[1]
    const verifToken = await jwt.verify(token, process.env.API_SECRET)
    if (!verifToken) {
      fs.unlinkSync(path.join(__dirname, `../temp/${file.filename}`))
      res.sendStatus(401)
      return
    }

    req.body.user_id = await verifToken.user_id

    next()
  } catch (error) {
    const file = await req.file
    fs.unlinkSync(path.join(__dirname, `../temp/${file.filename}`))
    res.sendStatus(401)
  }
}

module.exports = checkUser
