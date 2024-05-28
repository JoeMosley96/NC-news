const {fetchTopics}=require("../models/topics.models")

const getTopics = (req, res, next)=>{
    return fetchTopics()
    .then((data)=>{
        res.status(200).send(data)
    })
    .catch((err)=>{
        next(err)
    })
}



module.exports = {getTopics}