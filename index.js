const path = require('path');
require("dotenv").config({
    path: path.resolve(__dirname, ".env"),
 });

const cloudinary = require('cloudinary').v2;
const drawing = require('./models/Drawing');
const methodOverride = require('method-override');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const http = require('http');
// const path = require('path');
// const fs = require('fs'); 
const express = require('express');
const app = express();
// require("dotenv").config({
//    path: path.resolve(__dirname, "credentialsDontPost/.env"),
// });
const PORT = process.env.PORT || 3000;

//routes
const drawingRoute = require('./routes/drawings');
const promptRoute = require('./routes/prompt');
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'templates')));
app.use(express.json({ limit: '10mb' }));        // parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // parse form bodies

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

        // keep only the 50 most recent — delete anything older
        const allDrawings = await drawing.find({}).sort({ dateCreated: -1 });
        if (allDrawings.length > 50) {
            const idsToDelete = allDrawings.slice(50).map(d => d._id);
            await drawing.deleteMany({ _id: { $in: idsToDelete } });
        }

        res.redirect('/gallery');
    } catch (err) {
        console.error("Failed to save drawing:", err);
        res.status(500).send("Something went wrong saving your drawing.");
    }
});

app.get('/gallery', async (req, res) => {
    try {
        const allDrawings = await drawing.find({}).sort({ dateCreated: -1 }).limit(50); // newest 50 only
        res.render("gallery", { drawings: allDrawings });
    } catch (err) {
        console.error("Failed to fetch drawings:", err);
        res.status(500).send("Something went wrong loading the gallery.");
    }
});

app.delete('/gallery', async (req, res) => {
    try {
        await drawing.deleteMany({});
        res.redirect('/gallery');
    } catch (err) {
        console.error("Failed to clear gallery:", err);
        res.status(500).send("Something went wrong clearing the gallery.");
    }
});



app.use('/', drawingRoute);
app.use('/', promptRoute);