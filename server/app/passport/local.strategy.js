const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users.model');
const bcrypt = require('bcrypt');

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
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(5), null)
        });
        user.save(err => {
          if (err) return done(err)
          return done(null, user)
        })
      }
    })
  }
))