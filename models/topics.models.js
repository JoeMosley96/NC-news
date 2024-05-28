const db = require("../db/connection")
const fs = require("fs")

const fetchTopics = ()=>{
let sqlQuery  = 'SELECT * FROM topics'
const queryValues = []
return db.query(sqlQuery,queryValues)
.then(({rows})=>{
    if(rows.length===0){
        return Promise.reject({status:404, msg:"Not found"})
    } else{
        return rows}
})
}



module.exports = {fetchTopics}