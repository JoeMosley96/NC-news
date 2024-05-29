const {fetchArticle} = require("../models/articles.models")

const getArticle = (req, res, next) =>{
    console.log(req.params, "<--req")
    fetchArticle(req.params.article_id)
    .then((data)=>{
        console.log(data)
        res.status(200).send({article:data})
    })
    .catch((err)=>{
        next(err)
    })

}


module.exports = {getArticle}

