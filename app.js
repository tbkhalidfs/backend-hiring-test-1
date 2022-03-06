const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

// Connection to Database
mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true}, function(err){
    if(err) console.log("err connecting to MongoDB:", err);
    else console.log("Successfully connected to Mongo DB.")
});

// Import database models
require('./models/Call');

const app = express();

// Middlewares
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

// Import routes
app.use('/', require('./routes/index'));

// Start Server
app.listen(process.env.PORT, () => {
    console.log(`Call forwarding service running on port ${process.env.PORT}`);
});