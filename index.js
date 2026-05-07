const express = require('express');
const app = express();
const portNumber = process.env.PORT || 3000;

app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}`);
});