#!/usr/bin/env node
const fs = require('fs/promises')

const { Neobit } = require("../index")

let path = "../default/users.json"
let port = 8000
let name ="users"
let endpoint = "users"
async function main() {

  for (let el in process.argv) {

    if (el.startsWith("--path")) {
      path = el.split("=")[1]
    }
    if (el.startsWith("--port")) {
      port = el.split("=")[1]
    }
    if (el.startsWith("--template")) {

      let template = el.split("=")[1]
      path = "../defaults" + template.json
    }
    

    if (el.startsWith("--endpoint")) {
      let endpoint= el.split("=")[1]
    }


  }
  let arr = JSON.parse(await fs.readFile(path, "utf-8"))
  let neo = new Neobit()
  neo.buildApiFromArray({ name :endpoint, arr })
  neo.listen(port)

}
main()