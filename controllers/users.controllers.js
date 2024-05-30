const {fetchUsers} = require("../models/users.models")

const getUsers = (req, res, next)=>{
    fetchUsers()
    .then((data)=>{
        res.status(200).send(data)
    })
    .catch((err)=>{
        next(err)
    })
}


module.exports = {getUsers}