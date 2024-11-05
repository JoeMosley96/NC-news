const {getEndpoints} = require("../controllers/api.controllers")
const apiRouter = require('express').Router();
const articleRouter = require('./articles-router')
const topicRouter = require('./topics-router')
const userRouter = require('./users-router')
const commentRouter = require('./comments-router')

apiRouter.get("/", getEndpoints)

apiRouter.use('/articles', articleRouter)

apiRouter.use('/topics', topicRouter)

apiRouter.use('/users', userRouter)

apiRouter.use('/comments', commentRouter)

module.exports = apiRouter;