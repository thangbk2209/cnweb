var express = require('express');
var passport = require('passport');
var User = require('../models/user.js');
var Word = require('../models/word.js');
var router = express.Router();
// login=false;
/* GET users listing. */
router.get('/', function (req, res, next) {
  // console.log(req.user.profile.fullName);
  res.render('index.ejs', {
    message: req.flash('loginMessage')
  });

});
router.get('/posts', function (req, res, next) {
  Word.find({}, function (err, data) {
    console.log(data);
    res.render('posts.ejs', {
      message: req.flash('loginMessage'),
      reqUser: req.user,
      posts: data
    });
  });

});

router.get('/login', function (req, res, next) {

  res.render('login.ejs', {
    message: req.flash('loginMessage')
  });
});

router.get('/signup', function (req, res) {
  res.render('signup.ejs', {
    message: req.flash('loginMessage')
  });
});

router.get('/profile', isLoggedIn, function (req, res) {
  res.render('profile.ejs', {
    message: req.flash('loginMessage'),
    reqUser: req.user
  });
});

router.get('/write', isLoggedIn, function (req, res, next) {
  res.render('write.ejs', {
    reqUser: req.user
  });
});
router.get('/logout', function (req, res) {
  console.log('log out');
  req.logout();
  login = false;
  res.redirect('/users');
});
router.get('/:username', isLoggedIn, function (req, res, next) {
  var username = req.params.username;
  var check = 1;
  if (username != req.user.username) {
    check = 0;
  }
  console.log("check " + check);
  console.log('aaa');
  User.findOne({
    'username': username
  }, function (err, data) {
    if (err) console.log(err);
    console.log(data);
    Word.find({
      'owner': data.username
    }, function (err, docs) {
      console.log(docs);
      res.render('yourPage.ejs', {
        reqUser: req.user,
        user: data,
        docs: docs,
        check: check
      });
    })
    console.log(data.profile);

  })

});
router.post('/follow', isLoggedIn, function (req, res) {

})

router.post('/upLoad', isLoggedIn, function (req, res) {
  console.log(req.body);
  console.log(req.user);
  console.log(req.user.local.email);
  var newWord = new Word();
  newWord.title = req.body.title;
  newWord.content = req.body.content;
  newWord.owner = req.user.username;
  newWord.soLike = 0;
  newWord.save(function (err) {
    if (err)
      throw err;
  });
  res.redirect('/users/' + req.user.username);
})
router.post('/updateProfile', isLoggedIn, function (req, res) {
  console.log("data :" + req.body);
  var city = req.body.city;
  var age = req.body.age;
  var job = req.body.job;
  var username = req.body.username;
  var avatar = req.body.avatar;
  console.log(city);
  console.log(age);
  console.log(req.user.local.email);
  User.findOne({
    'local.email': req.user.local.email
  }, function (err, result) {

    if (err) throw err;
    console.log(result);
    result.profile.city = city;
    result.profile.age = age;
    result.username = username;
    result.profile.job = job;
    result.profile.avatar = avatar;
    result.save(function (err) {
      if (err) throw err;
      console.log("luu du lieu thanh cong");
    });
    res.redirect('/users/' + result.username);
  });
  
})

router.post('/changePassword', isLoggedIn, function (req, res) {
  var currentPassword = req.body.currentPassword;
  var newPassword = req.body.newPassword;
  console.log(currentPassword);
  console.log(newPassword);
  console.log(req.user.local.email);
  User.findOne({
    'local.email': req.user.local.email
  }, function (err, result) {

    if (err) throw err;
    console.log(result.local);
    var checked = result.validPassword(currentPassword);
    console.log(checked);
    if (checked === true) {
      var myPassword = result.generateHash(newPassword);
      result.local.password = myPassword;
      console.log("myPassword");
      console.log(myPassword);
      result.save(function (err) {
        if (err) throw err;
        console.log("luu du lieu thanh cong");
      });
      res.redirect('/users')
    } else {
      console.log("sai mat khau");
      res.redirect('/users/profile');
    }
  });


})

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/users/login',
  failureRedirect: '/users/signup',
  failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {

  successRedirect: '/users/posts',
  failureRedirect: '/users/login',
  failureFlash: true,
}))



router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/users/profile',
  failureRedirect: '/home',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/users',
  failureRedirect: '/users/login',
}));


module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    login = true;
    return next();
  } else if (req.url == '/auth/facebook') {
    // NOTE: call the function returned to process the request
    passport.authenticate('facebook')(req, res, next);
    return;
  }
  res.redirect('/');
}