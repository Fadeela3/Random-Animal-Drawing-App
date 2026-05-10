
// const http = require('http');
const path = require('path');
// const fs = require('fs'); 
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
//// ! these commands are only for testing make sure you comment it out before pushing to main or there will be problems with the render deplyment
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
}); //*/
const PORT = process.env.PORT || 3000;

// set template engine
const { openDelimiter } = require('ejs');
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates")); // set proper folder path to the templates folder

//mongoDB and mongoose stuff

const mongoose = require("mongoose");
// const { MongoClient, ServerApiVersion } = require("mongodb");

app.get('/', (req, res) => {
    res.render("main");
});


mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => { //if success, start the server
        console.log(`Connected to MongoDB`);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => { //if failure, exit system
        console.log(`Failed to connect to MongoDB:, ${err}`);
        process.exit(1);
    });

//mongoose.disconnect() //apparently not needed for web servers
