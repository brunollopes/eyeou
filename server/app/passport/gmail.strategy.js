const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/users.model')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .exec((err, user) => {
      if (err) throw new Error(err)
      done(null, user)
    })
})

passport.use(
  new GoogleStrategy({
    clientID: process.env.google_clientID,
    clientSecret: process.env.google_clientSecret,
    callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id })
      .exec((err, currentUser) => {
        if (err) console.log(err)
        if (currentUser) {
          done(null, currentUser)
        } else {
          new User({
            fullName: profile.displayName,
            googleID: profile.id,
            email: profile.emails[0].value,
            verified: true
          }).save((err, user) => {
            if (err) console.log(err)
            done(null, user)
          })
        }
      })
  })
)