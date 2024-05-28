const express = require ("express")
const {getTopics} = require("./controllers/topics.controllers")
const {getEndpoints} = require("./controllers/api.controllers")

const app = express()

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

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