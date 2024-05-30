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

module.exports = { removeComment };
