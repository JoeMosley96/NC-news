# Northcoders News API
This portfolio project is a mock news website created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/).

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

Use following terminal command to run tests:  
```
npm run test-super
```