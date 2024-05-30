const {fetchArticle, fetchArticles, fetchComments, writeComment} = require("../models/articles.models")

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
    const commentBody = req.body
    writeComment(article_id,commentBody)
    .then((data)=>{
        res.status(201).send({comment:data})
    })
    .catch((err)=>{
        next(err)
    })



}


module.exports = {getArticle, getArticles, getComments, postComment}

