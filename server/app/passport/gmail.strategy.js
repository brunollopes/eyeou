const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/users.model')
const emailHelper = require('../helpers/mail.helper')

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
    User.findOne({ email: profile.emails[0].value })
      .exec((err, currentUser) => {
        if (err) console.log(err)
        if (currentUser) {
          if (currentUser.googleID) {
            done(null, currentUser)
          } else {
            User.findOneAndUpdate({ email: profile.emails[0].value }, { googleID: profile.id }, (err, doc) => {
              done(null, currentUser)
            })
          }
        } else {
          new User({
            fullName: profile.displayName,
            googleID: profile.id,
            email: profile.emails[0].value,
            verified: true,
            profilePictureURL: profile._json.image.url || 'https://s3.amazonaws.com/eyeou-public/anonymous-avatar-sm.jpg'
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