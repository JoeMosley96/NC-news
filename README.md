# Northcoders News API

This is a RESTful API which provides the backend for a news website. It was built using Express.js and Node Postgres, and interacts with a PostgreSQL database.
The available endpoints support the following features:
* Retrieving news data
* Filtering news data by topic
* Sorting news data by attribute
* Leaving comments and votes on individual articles
* Deleting comments
* Voting on comments
* Posting articles

Link to hosted version
https://jm-news.onrender.com

To run this project locally:
Make sure that Node.js is installed - at least version v21.6.2  
Make sure that Node Postgres is installed - at least version v8.7.3  

Clone the main branch of the repository  
```
git clone https://github.com/JoeMosley96/NC-news  
```

Navigate to the project directory
```
cd NC-news
```

Install dependencies  
```
npm install
```
Create a .env.development file in the root folder containing the following text 
```
PGDATABASE=nc_news  
```

Create a .env.test file in the root folder contaning the following text 
```
PGDATABASE = nc_news_test  
```

Use following terminal command to setup database:  
```
npm run setup-dbs
```

Use following terminal command to seed local database:  
```
npm run seed
```

Start the server:
```
npm start
```

Use following terminal command to run tests:  
```
npm run test-super
```

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).