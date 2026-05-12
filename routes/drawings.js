// this file handles saving and retriving the drawings
const express = require('express');
const router = express.Router();
const drawing = require('../models/Drawing');
const bodyParser = require("body-parser");
router.use(express.json());
router.use(bodyParser.urlencoded({extended:false})); // this will allow me to use request.body with post information

router.get("/api/drawings", async (req, res) => {
    //this retrives all the drawings from mongodb
    let allDrawings = await drawing.find({});
    //^ returns an array of objects where values can be accessed like allDrawings[0].title
    res.json(allDrawings);
});

router.post("/api/drawings", async (req, res) => {
    // this saves a new drawing to mongodb
    // get data from body
    const animalPrompt = req.body.animalPrompt;
    const title = req.body.title;
    const artistName = req.body.artistName;
    const message = req.body.message;
    const imageUrl = req.body.imageUrl;
    const dateCreated = req.body.dateCreated;

    // create drawing object
    const newDrawing = new drawing({
        animalPrompt: animalPrompt,
        title: title,
        artistName: artistName,
        message: message,
        imageUrl: imageUrl,
        dateCreated: dateCreated
    });
    // add it to mongodb
    await newDrawing.save()
    res.json(newDrawing);
});

module.exports = router;