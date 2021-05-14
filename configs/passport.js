const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user-model');
const bcrypt = require ('bcryptjs')

// Passport - set the user in the sessin
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});


// Passport - get the uset from the session
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});


// Passport - Authenticate usin our database
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }
    if (!foundUser) {
      next(null, false, { message: 'Invalid login' });
      return;
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Invalid login' });
      return;
    }
    next(null, foundUser);
  });
}));

