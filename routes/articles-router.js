const {getArticle, getArticles, getComments, postComment, patchArticle} = require("../controllers/articles.controllers")
const articleRouter = require('express').Router()

articleRouter
.route('/')
.get(getArticles)

articleRouter
.route('/:article_id')
.get(getArticle)
.patch(patchArticle)

articleRouter
.route('/:article_id/comments')
.get(getComments)
.post(postComment)

module.exports=articleRouter