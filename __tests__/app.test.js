const {topicData, articleData, userData, commentData} = require("../db/data/test-data/index")
const request = require ("supertest")
const app = require("../app")
const connection = require("../db/connection")
const seed = require("../db/seeds/seed")
const endpoints = require("../endpoints.json")


beforeEach(()=>{
return seed({topicData, articleData, userData, commentData})
})

afterAll(()=>{connection.end()})

describe('GET /api/topics', () => {
    it('200: should respond with a 200 status code ', () => {
        return request(app).get("/api/topics").expect(200)
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

      it("404 should respond with a 404 error code if passed an invalid route", () =>{
        return request(app)
        .get("/notARoute")
        .expect(404)
        .then(()=>{
            expect(data.body.msg).toBe("Route not found")
        })
      })
});

describe.only('GET /api', () => {
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

    
});