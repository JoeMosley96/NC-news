const {fetchUsers, fetchUser} = require("../models/users.models")

const getUsers = (req, res, next)=>{
    fetchUsers()
    .then((data)=>{
        res.status(200).send({users: data})
    })
    .catch((err)=>{
        next(err)
    })
}

const getUser = (req, res, next)=>{
    fetchUser(req.params.username)
    .then((data)=>{
        res.status(200).send({user: data})
    })
    .catch((err)=>{
        next(err)
    })
}


module.exports = {getUsers, getUser}