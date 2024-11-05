const db = require("../db/connection")
const path = require("path")
const fs = require("node:fs/promises")


const fetchEndpoints = ()=>{
    return fs.readFile(path.resolve(__dirname, "../endpoints.json"),"utf-8")
}

module.exports = {fetchEndpoints}