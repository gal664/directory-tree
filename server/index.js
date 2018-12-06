const express = require("express")
const app = express()
const path = require("path")
const port = 9090
const bodyParser = require("body-parser")
const dirTree = require("./dirTree")

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../client')))

app.use("/dirtree", dirTree)

app.listen(process.env.PORT || port, () => console.log(`server is listening at port ${process.env.PORT || port}`))
// app.listen(port, () => console.log(`server is listening at port ${port}`))