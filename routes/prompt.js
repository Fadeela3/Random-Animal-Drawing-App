// this file handles fetching the animal prompt
const express = require('express');
const router = express.Router();

let randAnimalEndpoint = "https://random-animal-api.vercel.app/api/random-animal";

router.get("/api/prompt", async (req, res) => {
    const response = await fetch(randAnimalEndpoint);
    const json = await response.json();
    res.json({ animal: json.city });
});
//Ive tested the endpoint and know its working so I havent included error handling (this is mainly because of lack of time, ill add it in later just in case the API stops working)

module.exports = router;