const express = require ("express")
const apiRouter = require('./routes/api-router')
const cors = require("cors")
const app = express()

app.use(cors())

app.use(express.json())

//requests
app.use('/api', apiRouter)

//catch all middleware block
app.all('*', (req, res) => {
    res.status(404).send({msg: "Route not found"})
      })

//error handling middleware starts here

//psql errors go here - ie. errors arising from a db.query
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