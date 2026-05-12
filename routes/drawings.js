// this file handles saving and retriving the drawings
const express = require('express');
const router = express.Router();
const drawing = require('../models/Drawing');
const bodyParser = require("body-parser");
const cloudinary = require('cloudinary').v2;
router.use(express.json());
router.use(bodyParser.urlencoded({extended:false})); // this will allow me to use request.body with post information
//cloudinary configs
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


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
    const dateCreated = req.body.dateCreated;

    // upload the drawing to cloudinary with a base64 fallback (if uploading to cloudinary doesnt work)
    let imageUrl;
    try {
        const uploadResult = await cloudinary.uploader.upload(req.body.imageUrl, {
            public_id: `drawing_${Date.now()}`,
        });
        imageUrl = uploadResult.secure_url;
    } catch (error) { //cloudinary fail --> save as base64 instead
        console.log("Cloudinary failed, saving drawing as base64");
        imageUrl = req.body.imageUrl;
    }

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