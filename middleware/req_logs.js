const fs = require("fs")
const path = require("path")
const moment = require("moment")

const req_log = (req, res, next) => {
  const readJson = fs.readFileSync(path.join(__dirname, "../logs/request.json"), { encoding: "utf-8" })

  let parseJson = JSON.parse(readJson)
  let addLog = parseJson.push({
    hostname: req.hostname,
    url: req.path,
    method: req.method,
    header: req.headers,
    date: moment().format("DD/MM/YYYY hh:mm:ss"),
  })

  let writeAgain = fs.writeFileSync(path.join(__dirname, "../logs/request.json"), JSON.stringify(parseJson), {
    encoding: "utf-8",
  })

  // console.info({
  //     hostname : req.hostname,
  //     url : req.path,
  //     header : req.headers
  // })

  next()
}

module.exports = { req_log }
