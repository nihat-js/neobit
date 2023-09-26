#!/usr/bin/env node
const fs = require('fs/promises')
const { Neobit } = require("../index")

async function main() {
  let arr =  JSON.parse (await fs.readFile("./default/users.json", "utf-8"))
  let neo = new Neobit()
  neo.buildApiFromArray({ name: "users", prefix: "api/", arr })
  neo.listen(2100)
}
main()