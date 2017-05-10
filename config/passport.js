var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');
var configAuth = require('./auth.js');

module.exports = function (passport) {
  // passport.serializeUser(function(user, done) {
  //   done(null, user.id);
  // });
  // passport.deserializeUser(function(id, done) {
  //   User.findById(id, function(err, user) {
  //     done(err, user);
  //   });
  // });
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
      emailField: 'email',
    },
    function (req, username, password, done) {
      process.nextTick(function () {
        User.findOne({
          'username': username
        }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, false, {
              message: 'That username is already in use.'
            });
          } else {
            console.log(username + " ");
            var newUser = new User();
            newUser.username = username;
            newUser.local.password = newUser.generateHash(password);
            newUser.email = req.body.email;
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, true);
            });
          }
        });
      });
    }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      User.findOne({
        'username': username
      }, function (err, user) {
        if (err)
          return done(err);
        if (!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        if (!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Wrong password.'));
        return done(null, user);
      });
    }));
  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields: ['id', 'email', 'first_name', 'last_name'],
    },
    function (token, refreshToken, profile, done) {
      process.nextTick(function () {
        User.findOne({
          'facebook.id': profile.id
        }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.facebook.id = profile.id;
            newUser.facebook.token = token;
            newUser.username = profile.name.givenName + ' ' + profile.name.familyName;
            newUser.email = (profile.emails[0].value || '').toLowerCase();

            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));

  passport.use(new TwitterStrategy({
      consumerKey: configAuth.twitterAuth.consumerKey,
      consumerSecret: configAuth.twitterAuth.consumerSecret,
      callbackURL: configAuth.twitterAuth.callbackURL,
    },
    function (token, tokenSecret, profile, done) {
      process.nextTick(function () {
        User.findOne({
          'twitter.id': profile.id
        }, function (err, user) {
          if (err)
            return done(err);
          if (user) {
            return done(null, user);
          } else {
            var newUser = new User();
            newUser.twitter.id = profile.id;
            newUser.twitter.token = token;
            newUser.username = profile.username;
            newUser.profile.avatar = profile.photos[0].value;
            newUser.save(function (err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }));
};