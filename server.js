require('dotenv').config()
const bodyParser = require('body-parser');
//Install express server
const express = require('express');
const path = require('path');
const paypal = require('paypal-rest-sdk');
const app = express();

paypal.configure({
    mode: 'sandbox',    //sandbox or live
    client_id: process.env.paypal_client_id,
    client_secret: process.env.paypal_client_secret
})

// Configuring the database
const mongoose = require('mongoose');

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '1024mb' }))

// parse requests of content-type - application/json
app.use(bodyParser.json({ limit: '1024mb' }))

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(process.env.db_url, { useNewUrlParser: true })
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...' + err);
        process.exit();
    });



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


require('./server/app/routes/eyeou.routes.js')(app);

app.get('/*', function (req, res) {

    res.sendFile(path.join(__dirname + '/dist/index.html'));
});




// Start the app by listening on the default Heroku port
var server = app.listen(process.env.PORT || 8080, function () {
    console.log("app running on port.", server.address().port);
});