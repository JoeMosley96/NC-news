const express = require ("express")
const {getTopics} = require("./controllers/topics.controllers")

const app = express ()

app.get("/api/topics", getTopics)

//error handling middleware starts here
app.use((err, req, res, next) => {
    console.log(err,"<--full error")

    if (err.code) {
      res.status(400).send({ msg: "Bad request" });
    } else {
      next(err);
    }
  });
  
  app.use((err, req, res, next) => {
    console.log(err,"<--error handling 2")
    if (err.msg) {
        
      res.status(err.status).send({ msg: err.msg });
    } else {
      next(err);
    }
  });

  


module.exports = app