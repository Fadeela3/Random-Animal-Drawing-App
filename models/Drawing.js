const mongoose = require('mongoose');
// set up the mongoose schema
const drawingSchema = new mongoose.Schema({
    animalPrompt: String,
    title: String, 
    artistName: String,
    message: String,
    imageUrl: String, 
    dateCreated: {
        type: Date,
        default: () => Date.now()
    }
});

const drawing = mongoose.model("Drawing", drawingSchema);
// export the schema
module.exports = drawing;