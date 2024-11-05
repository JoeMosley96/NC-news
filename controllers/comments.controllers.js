const {removeComment, changeComment} = require("../models/comments.models")

const deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch((err)=>{
        next(err)
    })
};

const patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const {inc_votes} = req.body

    changeComment(comment_id, inc_votes)
    .then((data) => {
        res.status(200).send({comment:data})
    })
    .catch((err)=>{
        next(err)
    })
};

module.exports = {deleteComment, patchComment}