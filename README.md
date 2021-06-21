# RiaEventServer
This project is within the scope of obtaining bachelor’s degree in Computer Sciences and
Multimedia in the Higher Institute of Computer Sciences and Multimedia of Gabes.
Our project carried out within Ria Box organism.The subject of the project is "Conception
and development of web mobile application for event management".
This part include the server of our application.

To download this project : git clone https://github.com/HoucemZribi/RiaEventServer.git.

npm install 

Add config.js file : 
module.exports = {
  MONGODB:
    "Your_Mongo_URI",
  SECRET_KEY: "Your_Secret_Key",
};


Add .env file with the following : 
  - MONGO_URI 
  - JWT_SECRET
  - JWT_EXPIRES_IN
  - EMAIL
  - PASSWORD
