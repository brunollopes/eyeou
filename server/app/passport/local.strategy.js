const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const emailHelper = require('../helpers/mail.helper')

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use('local-signup', new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err)
      if (user) {
        return done(null, false, { message: "Email Already Exists" })
      } else {
        let user = new User({
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(5), null),
          profilePictureURL: 'https://s3.amazonaws.com/eyeou-public/anonymous-avatar-sm.jpg'
        });
        user.save(err => {
          if (err) return done(err)
          emailHelper.registrationEmail({ $mailTo: user.email })
          emailHelper.sendEmail({
            $mailTo: 'geral@eyeou.net',
            $subject: 'New user registration',
            $html: `User ${user.email} signed up`
          })
          return done(null, user)
        })
      }
    })
  }
))