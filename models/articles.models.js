const db = require("../db/connection")

const fetchArticle = (id)=>{
    let sqlQuery  = 'SELECT * FROM articles WHERE article_id = $1'
    const queryValues = [id]
    return db.query(sqlQuery,queryValues)
    .then(({rows})=>{
        if (!rows.length){
            return Promise.reject({status: 404, msg: "Not found"})
        }else{
            return rows[0]}
    })

}



module.exports = {fetchArticle}