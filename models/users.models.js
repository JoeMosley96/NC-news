const db = require("../db/connection")

const fetchUsers = ()=>{
    let sqlQuery  = 'SELECT * FROM users'
    const queryValues = []
    return db.query(sqlQuery,queryValues)
    .then(({rows})=>{
            return rows
    })

}

module.exports = {fetchUsers}