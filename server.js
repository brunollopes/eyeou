require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const express = require('express');
const path = require('path');
const paypal = require('paypal-rest-sdk');
const cookieSession = require('cookie-session');
const app = express();
const env = process.env.NODE_ENV || 'dev'

const passportFacebookSetup = require('./server/app/passport/facebook.strategy');
const passportGoogleSetup = require('./server/app/passport/gmail.strategy');
const passportLocalSetup = require('./server/app/passport/local.strategy');

app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.cookieSession]
}));

app.use(passport.initialize());
app.use(passport.session());
app.enable('trust proxy');

if (process.env.NODE_ENV === 'production') {
  app.use(function(req, res, next) {
    if ((req.get('X-Forwarded-Proto') !== 'https')) {
      res.redirect('https://' + req.get('Host') + req.url);
    } else
      next();
  });
}

paypal.configure({
  mode: process.env.paypal_mode,    //sandbox or live
  client_id: process.env.paypal_client_id,
  client_secret: process.env.paypal_client_secret
})

//CORS middleware
var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'example.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, userId');
  next();
}

app.use(allowCrossDomain);
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: true, limit: '1024mb' }))
app.use(bodyParser.json({ limit: '1024mb' }))
mongoose.Promise = global.Promise;

mongoose.connect(process.env.db_url, { useNewUrlParser: true })
  .then(() => {
    console.log("Successfully connected to the database");
  }).catch(err => {
    process.exit();
  });

require('./server/app/routes/eyeou.routes.js')(app);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

var server = app.listen(process.env.PORT || 8080, function () {
  console.log("app running on port.", server.address().port);
});