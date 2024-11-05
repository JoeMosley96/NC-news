# Northcoders News API
This portfolio project is a mock news website created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).

Link to hosted version
https://jm-news.onrender.com

To run this project locally:
Make sure that Node.js is installed - at least version 2.2.0  
Create a .env.development file in the root folder containing the text PGDATABASE=nc_news  
Create a .env.test file in the root folder contaning the text PGDATABASE = nc_news_test  

Install the following dependancies  

|PACKAGE                 |TERMINAL COMMAND|NOTES                             |
|------------------------|----------------|----------------------------------|
|Dotenv                  |npm i dotenv    |                                  |
|Postgres                |npm i pg        |should be at least version 8.11.5 | 
|Postgres Format         |npm i pg-format |                                  |
|Express                 |npm i express   |                                  |

Install the following dev dependancies:

|PACKAGE                 |TERMINAL COMMAND     |
|------------------------|---------------------|       
|Supertest               |npm i supertest -D   | 
|Jest                    |npm i jest -D        |
|Jest-Sorted             |npm i jest-sorted -D | 

Use following terminal command to setup database:  
npm run setup-dbs

Use following terminal command to seed local database:  
npm run seed

Use following terminal command to run tests:  
npm run test-super
