const express = require ("express")
const {getTopics} = require("./controllers/topics.controllers")
const {getEndpoints} = require("./controllers/api.controllers")
const {getArticle, getArticles, getComments} = require("./controllers/articles.controllers")

const app = express()

//requests
app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticle)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getComments)

//catch all middleware block
app.all('*', (req, res) => {
    res.status(404).send({msg: "Route not found"})
      })

//error handling middleware starts here
app.use((err, req, res, next) => {
    if (err.code) {
      res.status(400).send({ msg: "Bad request" });
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: "Internal server error"})
  });


module.exports = app