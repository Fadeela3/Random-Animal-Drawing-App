const cloudinary = require('cloudinary').v2;
const drawing = require('./models/Drawing');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
app.use(express.static(__dirname));
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

app.get('/drawing', async (req, res) => {
    try {
        const response = await fetch("https://random-animal-api.vercel.app/api/random-animal");
        const json = await response.json();
        res.render("drawing", { animal: json.city });
    } catch (err) {
        res.render("drawing", { animal: "Mystery Animal" }); // fallback if API fails
    }
});

app.post('/drawing', async (req, res) => {
    try {
        const { animalPrompt, title, artistName, message, imageUrl } = req.body;

        // Upload to Cloudinary, fall back to base64 if it fails
        let finalImageUrl;
        try {
            const uploadResult = await cloudinary.uploader.upload(imageUrl, {
                public_id: `drawing_${Date.now()}`,
            });
            finalImageUrl = uploadResult.secure_url;
        } catch (err) {
            console.log("Cloudinary failed, saving as base64");
            finalImageUrl = imageUrl;
        }

        const newDrawing = new drawing({
            animalPrompt, title, artistName, message,
            imageUrl: finalImageUrl,
        });
        await newDrawing.save();
        res.redirect('/gallery');
    } catch (err) {
        console.error("Failed to save drawing:", err);
        res.status(500).send("Something went wrong saving your drawing.");
    }
})

app.get('/gallery', async (req, res) => {
    try {
        const allDrawings = await drawing.find({}).sort({ dateCreated: -1 }); // newest first
        res.render("gallery", { drawings: allDrawings });
    } catch (err) {
        console.error("Failed to fetch drawings:", err);
        res.status(500).send("Something went wrong loading the gallery.");
    }
});



app.use('/', drawingRoute);
app.use('/', promptRoute);