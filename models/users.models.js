const db = require("../db/connection")

const fetchUsers = ()=>{
    let sqlQuery  = 'SELECT * FROM users'
    const queryValues = []
    return db.query(sqlQuery,queryValues)
    .then(({rows})=>{
            return rows
    })
}

const fetchUser = (username)=>{
    let sqlQuery = 'SELECT * FROM users where username = $1'
    const queryValues = [username]
    return db.query(sqlQuery, queryValues)
    .then(({rows})=>{
        if(!rows.length){
            return Promise.reject({status:404, msg: "User not found"})
        }
        return rows[0]
    })
}

module.exports = {fetchUsers, fetchUser}