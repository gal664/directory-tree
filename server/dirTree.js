const express = require("express")
const router = express.Router()
const dirTree = require("directory-tree")

router.get("/", (req, res) => {

  let path = req.query.path

  console.log(`getting tree from ${path}`)
  let tree = dirTree(`${path}`)
  
  console.log("fetched directory tree!")
  res.send(JSON.stringify(tree))

})

module.exports = router
