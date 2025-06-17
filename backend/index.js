const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const db = require("./config/db.js");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const pluginRoutes = require('./routes/pluginRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 5000;
db();

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: {
        status: 429,
        error: "Too many requests. Please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(helmet());

const allowedOrigins = [
    'http://localhost:3000',
    'https://llmagent.vercel.app',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); 
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());


const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

app.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use('/plugins', pluginRoutes);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
