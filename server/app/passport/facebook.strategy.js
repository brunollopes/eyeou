const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/users.model');
const emailHelper = require('../helpers/mail.helper')

passport.use(
  new FacebookStrategy({
    clientID: process.env.facebook_clientID,
    clientSecret: process.env.facebook_clientSecret,
    callbackURL: 'https://www.eyeou.net/auth/facebook/redirect',
    // callbackURL: 'http://localhost:8080/auth/facebook/redirect',
    profileFields: ['emails']
  }, (accessToken, refreshToken, profile, done) => {
    let query = {
      email: profile.emails ? profile.emails[0].value : undefined,
      facebookID: profile.id
    }
    Object.keys(query).forEach(key => query[key] === undefined && delete query[key]);
    if (query.email && query.facebookID) delete query.facebookID;

    User.findOne(query)
      .exec((err, currentUser) => {
        if (err) console.log(err)
        if (currentUser) {
          if (currentUser.facebookID) {
            done(null, currentUser)
          } else {
            User.findOneAndUpdate({ email: profile.emails[0].value }, { facebookID: profile.id }, (err, doc) => {
              done(null, currentUser)
            })
          }
        } else {
          new User({
            fullName: profile.displayName,
            facebookID: profile.id,
            verified: true,
            email: profile.emails ? profile.emails[0].value : null
          }).save((err, user) => {
            if (err) console.log(err)
            emailHelper.registrationEmail({ $mailTo: user.email })
            emailHelper.sendEmail({
              $mailTo: 'geral@eyeou.net',
              $subject: 'New user registration',
              $html: `User ${user.email} signed up`
            })
            done(null, user)
          })
        }
      })
  })
)