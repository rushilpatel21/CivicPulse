const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors()); // To Allow all origins 
app.use(express.json());
app.use(bodyParser.json())

const gemini = require('./routes/gemini.js');



app.use("/api/gemini", gemini);

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});