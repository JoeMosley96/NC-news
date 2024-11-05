const {fetchEndpoints}=require("../models/api.models")

const getEndpoints =(req, res, next)=>{

    return fetchEndpoints()
    .then((data)=>{
        res.status(200).send({endpoints: JSON.parse(data)})
    })
    .catch((err)=>{
        next(err)
    })
}

module.exports = {getEndpoints}