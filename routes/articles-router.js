const {getArticle, getArticles, getComments, postComment, patchArticle, postArticle} = require("../controllers/articles.controllers")
const articleRouter = require('express').Router()

articleRouter
.route('/')
.get(getArticles)
.post(postArticle)

articleRouter
.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articleRouter
.route('/:article_id/comments')
.get(getComments)
.post(postComment)

module.exports=articleRouter