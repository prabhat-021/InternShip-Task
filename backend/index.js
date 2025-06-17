const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db=require("./config/db.js");
const pluginRoutes = require('./routes/pluginRoutes.js');
const userRoutes = require('./routes/userRoutes.js');


const app = express();
const port = process.env.PORT || 5000;
db();
app.use(cors());
app.use(bodyParser.json());

app.use('/plugins', pluginRoutes); 
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
