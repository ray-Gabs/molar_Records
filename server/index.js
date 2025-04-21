const fs = require("fs");
const path = require("path");
const express = require("express");

const app = express();
app.use(express.json());


// Start the API server
const port = 1337;
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
