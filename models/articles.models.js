const db = require("../db/connection");

const fetchArticle = (id) => {
  let sqlQuery = "SELECT * FROM articles WHERE article_id = $1";
  const queryValues = [id];
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else {
      return rows[0];
    }
  });
};

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

  //find comment counts for each article
  return db
    .query(
      `
    SELECT article_id, COUNT(*) AS comment_count
    FROM comments

    GROUP BY article_id
    `
    )
    .then(({ rows }) => {
      //use this info to create lookup object
      const comment_counts = rows;
      const lookupObj = {};
      comment_counts.forEach((article) => {
        lookupObj[article.article_id] = Number(article.comment_count);
      });

      //initialise SQL query
      let sqlQuery = `
        SELECT author, title, article_id, topic, created_at, votes, article_img_url 
        FROM articles `;

      const queryValues = [];

      //extend sqlQuery string to accomodate author and topic queries
      if (author) {
        sqlQuery += `WHERE author = $1 `;
        queryValues.push(author);
        if (topic) {
          sqlQuery += `AND topic = $2 `;
          queryValues.push(topic);
        }
      } else if (topic) {
        sqlQuery += `WHERE topic = $1 `;
        queryValues.push(topic);
      }

      //add order by queries to sqlQuery string
      sqlQuery += `ORDER BY ${sort_by} ${order}`;
      sqlQuery += `;`;

      //query database again to get the rest of the information required
      return db.query(sqlQuery, queryValues).then(({ rows }) => {
        const table = rows;
        //reject with a 404 if nothing is found
        if (!table.length) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }

        //use lookup object to append comment counts to each article
        else {
          table.forEach((article) => {
            if (lookupObj[article.article_id]) {
              article.comment_count = lookupObj[article.article_id];
            } else {
              article.comment_count = 0;
            }
          });
          return table;
        }
      });
    });
};

const fetchComments = (article_id) => {
  let sqlQuery = "SELECT * FROM articles WHERE article_id = $1"
  let queryValues = [article_id]
  return db.query(sqlQuery, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "Article not found" });
    } else {
      sqlQuery = "SELECT * FROM comments WHERE article_id = $1";
      return db.query(sqlQuery, queryValues).then(({ rows }) => {
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

  let sqlQuery = 'SELECT * FROM users WHERE username = $1'
  let queryValues = [author]
  
  return db.query(sqlQuery, queryValues).then(({rows})=>{
    if(!rows.length){
      return Promise.reject({status: 404, msg: "User not found"});
    }else{
      sqlQuery = "SELECT * FROM comments WHERE article_id = $1";
      queryValues = [article_id];
      return db.query(sqlQuery, queryValues).then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: "Article not found" });
        } else {
          return db
            .query(
              `INSERT INTO comments
              (body, votes, article_id, author)
              values ($1, $2, $3, $4) RETURNING *`,
              [body, votes, article_id, author]
            )
            .then((result) => {
              return result.rows[0];
            });
        }
      });

    }

  })



};

module.exports = { fetchArticle, fetchArticles, fetchComments, writeComment };
