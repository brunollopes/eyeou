const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/users.model');

passport.use(
  new FacebookStrategy({
    clientID: process.env.facebook_clientID,
    clientSecret: process.env.facebook_clientSecret,
    callbackURL: '/auth/facebook/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookID: profile.id })
      .exec((err, currentUser) => {
        if (err) console.log(err)
        if (currentUser) {
          done(null, currentUser)
        } else {
          new User({
            fullName: profile.displayName,
            facebookID: profile.id,
            verified: true
          }).save((err, user) => {
            if (err) console.log(err)
            done(null, user)
          })
        }
      })
  })
)