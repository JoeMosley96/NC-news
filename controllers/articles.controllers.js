const {fetchArticle, fetchArticles, fetchComments, writeComment,changeArticle, writeArticle} = require("../models/articles.models")

const getArticle = (req, res, next) =>{
    fetchArticle(req.params.article_id)
    .then((data)=>{
        res.status(200).send({article:data})
    })
    .catch((err)=>{
        next(err)
    })

}

const getArticles = (req, res, next)=>{
    const {author, topic, sort_by, order} = req.query
    fetchArticles(author, topic, sort_by, order)
    .then((data)=>{

        res.status(200).send({articles:data})
    })
    .catch((err)=>{
   
        next(err)
    })
}

const getComments = (req, res, next)=>{
    const {article_id}=req.params
    fetchComments(article_id)
    .then((data)=>{
        res.status(200).send({comments:data})
    })
    .catch((err)=>{
   
        next(err)
    })

}

const postComment = (req, res, next)=>{
    const {article_id}=req.params
    const {comment} = req.body

    writeComment(article_id,comment)
    .then((data)=>{
        res.status(201).send({comment:data})
    })
    .catch((err)=>{
        next(err)
    })
}

const patchArticle = (req, res, next)=>{
    const {article_id}=req.params
    const {inc_votes}=req.body

    changeArticle(article_id,inc_votes)
    .then((data)=>{
        res.status(200).send({article:data})
    })
    .catch((err)=>{
        next(err)
    })
}

const postArticle = (req, res, next)=>{
    const {article_id}=req.params
    const{article} = req.body
   

    writeArticle(article)
    .then((data)=>{
 
        res.status(201).send({article:data})
    })
    .catch((err)=>{
        next(err)
    })
}


module.exports = {getArticle, getArticles, getComments, postComment, patchArticle, postArticle}

