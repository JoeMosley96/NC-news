const data = require("../db/data/test-data/index")
const request = require ("supertest")
const app = require("../app")
const connection = require("../db/connection")
const seed = require("../db/seeds/seed")
const endpoints = require("../endpoints.json")


beforeEach(() => {
  return seed(data);
});


beforeEach(()=>{
return seed(data)
})

afterAll(()=>{connection.end()})


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
  
describe('GET /api', () => {
    it('200: should respond with a 200 status code', () => {
        return request(app)
        .get("/api")
        .expect(200)        
    });
    it('200: should return the endpoints json file', () => {
        return request(app)
        .get("/api")
        .then((data)=>{
            expect(data.body.endpoints).toEqual(endpoints)
        })        
    });
    it('200: should return the endpoints json file', () => {
        return request(app)
        .get("/api")
        .then((data)=>{
            expect(data.body.endpoints).toEqual(endpoints)
        })        
    });

describe('GET /api/articles/:article_id', () => {
    it('200: should return a valid article object when passed a valid article id',() =>{
      return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((data)=>{
        expect(data.body.article).toMatchObject(  {
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        })
    }) 
    })
    it('404: should return a 404 error message when passed a well formed but non existant article id', () => {
      return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then((data)=>{
        expect(data.body.msg).toBe("Not found")
      })
      
    });
    it('400: should return a 400 error message when passed an invalid article id', () => {
      return request(app)
      .get("/api/articles/pigeon")
      .expect(400)
      .then((data)=>{
        expect(data.body.msg).toBe("Bad request")
      })
      
    });
  
});

    
});
