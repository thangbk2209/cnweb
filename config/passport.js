var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var configAuth=require('./auth.js');

module.exports = function(passport) {
  // passport.serializeUser(function(user, done) {
  //   done(null, user.id);
  // });
  // passport.deserializeUser(function(id, done) {
  //   User.findById(id, function(err, user) {
  //     done(err, user);
  //   });
  // });
  passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, email,password, done) {
    process.nextTick(function() {
      User.findOne({ 'local.email':  email }, function(err, user) {
        if (err)
            return done(err);
        if (user) {
          return done(null, false, { message: 'That email is already in use.'});
        } else {
          console.log(email + " ");
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);       
          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null,true);
          });
        }
      });
    });
  }));

passport.use('local-login', new LocalStrategy({
   usernameField: 'email',
   passwordField: 'password',
   passReqToCallback: true,
 },
 function(req, email, password, done) {
   User.findOne({ 'local.email':  email }, function(err, user) {
     if (err)
         return done(err);
     if (!user)
         return done(null, false, req.flash('loginMessage', 'No user found.'));
     if (!user.validPassword(password))
         return done(null, false, req.flash('loginMessage', 'Wrong password.'));
     return done(null, user);
   });
 }));
};
