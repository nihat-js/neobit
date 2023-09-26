#!/usr/bin/env node
const fs = require('fs/promises')

const { Neobit } = require("../index")
let path_ = require('path')

let path = path_.resolve(__dirname, "../default/users.json")
let name = "users"
let endpoint = "users"
async function main() {

  let port = 8000
  for (let el of process.argv) {
    if (el.startsWith("--path")) {
      path = el.split("=")[1]
    }
    if (el.startsWith("--port")) {
      console.log("port hissesi")
      port = el.split("=")[1]
    }
    if (el.startsWith("--template")) {

      let template = el.split("=")[1]
      path = path_.resolve(__dirname, "../default/" + name + ".json")
    }


    if (el.startsWith("--endpoint")) {
      let endpoint = el.split("=")[1]
    }


  }
  let arr = JSON.parse(await fs.readFile(path, "utf-8"))
  let neo = new Neobit()
  neo.buildApiFromArray({ name: endpoint, arr })
  neo.listen(port)

}
main()