
// const http = require('http');
const path = require('path');
// const fs = require('fs'); 
const express = require('express');
const app = express();
require("dotenv").config({
   path: path.resolve(__dirname, "credentialsDontPost/.env"),
});
const PORT = process.env.PORT || 3000;
//routes
const drawingRoute = require('./routes/drawings');
const promptRoute = require('./routes/prompt');
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'templates')));
app.get('/favicon.ico', (req, res) => res.status(204).end()); //get rid of the favicon 404 error in the browser terminal

// set template engine
// const { openDelimiter } = require('ejs');
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates")); // set proper folder path to the templates folder

//mongoDB and mongoose stuff
const mongoose = require("mongoose");

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

app.get('/', (req, res) => {
    res.render("main");
});

app.get('/drawing', (req, res) => {
    res.render("drawing");
});

app.get('/gallery', (req, res) => {
    res.render("gallery");
});

app.use('/', drawingRoute);
app.use('/', promptRoute);