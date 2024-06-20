const db = require("../db/connection");

const fetchArticle = (id) => {
   //query database to find comment count for given article
  let sqlQuery =`
  SELECT article_id, COUNT(*) AS comment_count
  FROM comments
  WHERE article_id = $1
  GROUP BY article_id`
  const queryValues = [id];
  return db
  .query(sqlQuery,queryValues)
  .then(({ rows }) => {
    //use this info to create lookup object
    const lookupObj = {};
    rows.forEach((article) => {
      lookupObj[article.article_id] = Number(article.comment_count);
    });

   //query database again to find rest of information required
  sqlQuery = "SELECT * FROM articles WHERE article_id = $1";
  return db.query(sqlQuery, queryValues)
  .then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else {
      rows[0].comment_count = lookupObj[rows[0].article_id]
      return rows[0];
    }
  });
})
}

const fetchArticles = (
  author,
  topic,
  sort_by = "created_at",
  order = "DESC"
) => {
  //check sql queries are on green list
  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Your sort query is invalid" });
  }
  if (!["ASC", "DESC"].includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Your sort query is invalid" });
  }
  //initialise SQL query
  let sqlQuery = `
        SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, count(c.article_id) as comment_count 
        FROM articles a
        FULL JOIN comments c
          ON a.article_id = c.article_id 
          `;

  const queryValues = [];

  //extend sqlQuery string to accomodate author and topic queries
  if (author) {
    sqlQuery += `WHERE a.author = $1 `;
    queryValues.push(author);
    if (topic) {
      sqlQuery += `AND a.topic = $2 `;
      queryValues.push(topic);
    }
  } else if (topic) {
    sqlQuery += `WHERE a.topic = $1 `;
    queryValues.push(topic);
  }

  //add order by and group by queries to sqlQuery string
  sqlQuery += `GROUP BY a.article_id `;
  sqlQuery += `ORDER BY ${sort_by} ${order}`;
  sqlQuery += `;`;

  //query database to get the information required
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    //convert the comment counts from string to number
    rows.forEach((row) => {
      row.comment_count = Number(row.comment_count);
    });

    //reject with a 404 if no articles are found
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    //return table if no 404 error
    else {
      return rows;
    }
  });
};

const fetchComments = (article_id) => {
  let sqlQuery = "SELECT * FROM articles WHERE article_id = $1";
  let queryValues = [article_id];
  return db.query(sqlQuery, queryValues)
  .then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else {
      sqlQuery = "SELECT * FROM comments WHERE article_id = $1";
      return db.query(sqlQuery, queryValues)
      .then(({ rows }) => {
        if (!rows.length) {
          return [];
        } else {
          return rows;
        }
      });
    }
  });
};

const writeComment = (article_id, { body, votes, author }) => {
  let sqlQuery = "SELECT * FROM users WHERE username = $1";
  let queryValues = [author];
  console.log(author, "<-- post author - in model")

  return db
    .query(sqlQuery, queryValues)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: `User not found` });
      } else {
        sqlQuery = "SELECT * FROM articles WHERE article_id = $1";
        queryValues = [article_id];
        return db.query(sqlQuery, queryValues);
      }
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        return db.query(
          `INSERT INTO comments
          (body, votes, article_id, author)
          values ($1, $2, $3, $4) RETURNING *`,
          [body, votes, article_id, author]
        );
      }
    })
    .then((result) => {
      return result.rows[0];
    });
};

const changeArticle = (article_id, inc_votes) => {
  let sqlQuery = "SELECT votes FROM articles WHERE article_id = $1";
  let queryValues = [article_id];

  return db
    .query(sqlQuery, queryValues)
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      } else {
        const newVotes = inc_votes + rows[0].votes;
        sqlQuery =
          "UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *";
        queryValues = [newVotes, article_id];
        return db.query(sqlQuery, queryValues);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = {
  fetchArticle,
  fetchArticles,
  fetchComments,
  writeComment,
  changeArticle,
};
