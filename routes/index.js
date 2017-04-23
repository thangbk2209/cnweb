var express = require('express');
var passport = require('passport');
var router = express.Router();
router.get('/', function (req, res, next) {
  res.render('index', {
    message: req.flash('loginMessage')
  });
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    login = true;
    return next();
  }

  res.redirect('/');
}