const db = require("../db/connection")

const fetchTopics = ()=>{
let sqlQuery  = 'SELECT * FROM topics'
const queryValues = []
return db.query(sqlQuery,queryValues)
.then(({rows})=>{
        return rows
})

}

module.exports = {fetchTopics}