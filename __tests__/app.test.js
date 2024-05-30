const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  connection.end();
});

describe("GET /api/topics", () => {
  it("200: should respond with a 200 status code ", () => {
    return request(app).get("/api/topics").expect(200);
  });

  it("200: should return an array", () => {
    return request(app)
      .get("/api/topics")
      .then((data) => {
        expect(Array.isArray(data.body)).toBe(true);
      });
  });

  it("200 should respond with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body;
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });

  it("200 should respond with an empty array if the topics folder is empty", () => {
    return connection
      .query("DELETE FROM comments")
      .then(() => {
        return connection.query("DELETE FROM articles");
      })
      .then(() => {
        return connection.query("DELETE FROM topics");
      })
      .then(() => {
        return request(app).get("/api/topics").expect(200);
      })
      .then((data) => {
        expect(data.body).toEqual([]);
      });
  });

  it("404 should respond with a 404 error code if passed an invalid route", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api", () => {
  it("200: should respond with a 200 status code", () => {
    return request(app).get("/api").expect(200);
  });
  it("200: should return the endpoints json file", () => {
    return request(app)
      .get("/api")
      .then((data) => {
        expect(data.body.endpoints).toEqual(endpoints);
      });
  });
  it("200: should return the endpoints json file", () => {
    return request(app)
      .get("/api")
      .then((data) => {
        expect(data.body.endpoints).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("200: should return a valid article object when passed a valid article id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((data) => {
        expect(data.body.article).toMatchObject({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("404: should return a 404 error message when passed a well formed but non existant article id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Article not found");
      });
  });
  it("400: should return a 400 error message when passed an invalid article id", () => {
    return request(app)
      .get("/api/articles/pigeon")
      .expect(400)
      .then((data) => {
        expect(data.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  it("200: should respond with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("200: articles array should be sorted by date if there are no queries", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  it("200: each article should have an accurate comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles[0]).toMatchObject({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
        expect(articles[2]).toMatchObject({
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          article_id: 2,
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 0,
        });
      });
  });

  it("200: can accept queries to allow articles array to be sorted by other parameters, such as 'topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;

        expect(articles).toBeSortedBy("topic");
      });
  });
  it("200: can accept an author query", () => {
    return request(app)
      .get("/api/articles?author=icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(6);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: "icellusedkars",
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("200: can accept a topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("200: can accept multiple queries at once", () => {
    return request(app)
      .get("/api/articles?topic=mitch&author=rogersop&sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        expect(articles).toHaveLength(2);
        expect(articles).toBeSortedBy("topic");
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: "rogersop",
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("400: responds with an error message when passed an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=flavour")
      .expect(400)
      .then((data) => {
        expect(data.body.msg).toBe("Your sort query is invalid");
      });
  });
  it("400: responds with an error message when passed an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=backwards")
      .expect(400)
      .then((data) => {
        expect(data.body.msg).toBe("Your sort query is invalid");
      });
  });
  it("404: responds with an error message when the error endpoint is spelt incorrectly", () => {
    return request(app)
      .get("/api/articlez")
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Route not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: should respond with all comments for the given article ID", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            article_id: 1,
            created_at: expect.any(String),
          });
        });
      });
  });
  it("200: should respond with an empty array if the article id is valid but there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toEqual([]);
      });
  });
  it("404: should return a 404 error message when passed a well formed but non existant article id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Article not found");
      });
  });
  it("400: should return a 400 error message when passed an invalid article id", () => {
    return request(app)
      .get("/api/articles/pigeon/comments")
      .expect(400)
      .then((data) => {
        expect(data.body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: should post a new comment to the given article", () => {
    const newComment = {
      body: "this is terrible and i hate it",
      votes: 50000,
      author: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "this is terrible and i hate it",
          votes: 50000,
          author: "icellusedkars",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  it("404: should return a 404 error message when passed a well formed but non existant article id", () => {
    const newComment = {
      body: "this is terrible and i hate it",
      votes: 50000,
      author: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/100000/comments")
      .send(newComment)
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Article not found");
      });
  });
  it("400: should return a 400 error message when passed an invalid article id", () => {
    const newComment = {
      body: "this is terrible and i hate it",
      votes: 50000,
      author: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/pigeon/comments")
      .send(newComment)
      .expect(400)
      .then((data) => {
        expect(data.body.msg).toBe("Bad request");
      });
  });

  it("404: should return a 404 error message when passed a non-existant author name", () => {
    const newComment = {
      body: "this is terrible and i hate it",
      votes: 50000,
      author: "brian",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: should return the selected article with the correct new number of votes - where article initially has no votes", () => {
    const voteObj = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/2")
      .send(voteObj)
      .expect(200)
      .then((data) => {
        expect(data.body.article).toMatchObject({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          votes: 3,
        });
      });
  });
  it("200: should return the selected article with the correct new number of votes - where article already has votes", () => {
    const voteObj = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteObj)
      .expect(200)
      .then((data) => {
        expect(data.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 103,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  it("404: should respond with a 404 error if the article id is well formed but non-existant", () => {
    const voteObj = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/10000")
      .send(voteObj)
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Article not found");
      });
  });
  it("400: should respond with a 400 error if the article id is not well formed", () => {
    const voteObj = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/clogs")
      .send(voteObj)
      .expect(400)
      .then((data) => {
        expect(data.body.msg).toBe("Bad request");
      });
  });

  it("400: should respond with a 400 error if the request body contains an invalid key", () => {
    const voteObj = { inc_votez: 3 };
    return request(app)
      .patch("/api/articles/1")
      .send(voteObj)
      .expect(400)
      .then((data) => {
        expect(data.body.msg).toBe("Bad request");
      });
  });
  it("400: should respond with a 400 error if the request body contains an invalid value", () => {
    const voteObj = { inc_votes: "clogs" };
    return request(app)
      .patch("/api/articles/1")
      .send(voteObj)
      .expect(400)
      .then((data) => {
        expect(data.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("204: should remove ride from the database", () => {
    return request(app)
      .delete("/api/comments/10")
      .expect(204)
      .then(() => {
        return connection.query(
          `SELECT * FROM comments
            WHERE comment_id = 10`
        );
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      }); 
  })
  it('404: should respond with a 404 error message if the comment id is well formed but non-existant', () => {
    return request(app)
    .delete("/api/comments/10000")
    .expect(404)
    .then((data) => {
      expect(data.body.msg).toBe("Comment not found");
    });
    
  });
  it('400: should respond with a 400 error message if the comment id is not well formed', () => {
    return request(app)
    .delete("/api/comments/greyhound")
    .expect(400)
    .then((data) => {
      expect(data.body.msg).toBe("Bad request");
    });
    
  });
});

describe("GET /api/users", () => {
  it("200: should respond with a 200 status code ", () => {
    return request(app).get("/api/users").expect(200);
  });

  it("200: should return an array", () => {
    return request(app)
      .get("/api/users")
      .then((data) => {
        expect(Array.isArray(data.body)).toBe(true);
      });
  });

  it("200 should respond with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url : expect.any(String)
          });
        });
      });
  });

  // it("200 should respond with an empty array if the users folder is empty", () => {
  //   return connection
  //     .query("DELETE FROM comments")
  //     .then(() => {
  //       return connection.query("DELETE FROM articles");
  //     })
  //     .then(() => {
  //       return connection.query("DELETE FROM users");
  //     })
  //     .then(() => {
  //       return request(app).get("/api/users").expect(200);
  //     })
  //     .then((data) => {
  //       expect(data.body).toEqual([]);
  //     });
  // });

  it("404 should respond with a 404 error code if passed an invalid route", () => {
    return request(app)
      .get("/notARoute")
      .expect(404)
      .then((data) => {
        expect(data.body.msg).toBe("Route not found");
      });
  });
});
