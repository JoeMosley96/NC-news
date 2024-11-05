const db = require("../db/connection");

function removeComment(id) {
  return db
    .query(
      `SELECT * FROM comments
          WHERE comment_id = $1`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        return db.query(
          `DELETE FROM comments
            WHERE comment_id = $1`,
          [id]
        );
      }
    });
}

const changeComment = (comment_id, inc_votes) => {
  let sqlQuery = "SELECT votes FROM comments WHERE comment_id = $1";
  let queryValues = [comment_id];

  return db
    .query(sqlQuery, queryValues)
    .then(({ rows }) => {
      console.log(rows)
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else {
        const newVotes = inc_votes + rows[0].votes;
        sqlQuery =
          "UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *";
        queryValues = [newVotes, comment_id];
        return db.query(sqlQuery, queryValues);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { removeComment, changeComment };
