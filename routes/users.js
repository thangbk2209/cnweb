
var express = require('express');
var passport=require('passport');
var User = require('../models/user.js');
var Word = require('../models/word.js');
var router = express.Router();
// login=false;
/* GET users listing. */
router.get('/', function(req, res, next) {
  // console.log(req.user.profile.fullName);
  res.render('index.ejs',{message:req.flash('loginMessage')});
  
});
router.get('/posts',isLoggedIn, function(req, res, next) {
  Word.find({},function(err,data){
      console.log(data);
      res.render('posts.ejs',{message:req.flash('loginMessage'), user: req.user, posts:data});
  });
  
});

router.get('/login',function(req,res,next){

  res.render('login.ejs',{message:req.flash('loginMessage')});
});

router.get('/signup',function(req,res){
  res.render('signup.ejs',{message:req.flash('loginMessage')});
});

router.get('/profile',isLoggedIn,function(req,res){
  res.render('profile.ejs');
});

router.get('/write',isLoggedIn, function(req, res, next) {
  res.render('write.ejs', {user: req.user});
});
router.get('/logout',function(req,res){
  console.log('log out');
  req.logout();
  login=false;
  res.redirect('/users');
});
router.get('/:username',isLoggedIn,function(req,res,next){
  var username = req.params.username;
    console.log('aaa');
    User.findOne({'profile.fullName': username},function(err,data){
      console.log('linf');
      if(err) console.log(err);
      // console.log(data.profile);
      res.render('yourPage.ejs',{user: data});
    })
 
});

router.post('/upLoad',function(req,res){
  console.log(req.body);
  console.log(req.user.local.email);
  var newWord = new Word();
    newWord.title = req.body.title;
    newWord.content = req.body.content;
    newWord.owner = req.user.local.email;
    newWord.soLike = 0;
    newWord.save(function(err) {
            if (err)
              throw err;
          });
  res.redirect('/users');
})
router.post('/updateProfile',isLoggedIn,function(req,res){
   console.log("data :" + req.body);
  var city = req.body.city;
  var age = req.body.age;
  var job = req.body.job;
  var fullName = req.body.fullName;
  console.log(city);
  console.log(age);
  console.log(req.user.local.email);
  User.findOne({'local.email':req.user.local.email},function(err,result){
   
    if(err) throw err;
    console.log(result.local);
      result.profile.city = city;
      result.profile.age = age;
      result.profile.fullName = fullName;
      result.profile.job = job;
      result.save(function(err){
         if(err) throw err;
         console.log("luu du lieu thanh cong");
       });
  });
  res.redirect('/users');
})

router.post('/changePassword',isLoggedIn,function(req,res){
  var currentPassword = req.body.currentPassword;
  var newPassword = req.body.newPassword;
  console.log(currentPassword);
  console.log(newPassword);
  console.log(req.user.local.email);
  User.findOne({'local.email':req.user.local.email},function(err,result){
   
    if(err) throw err;
    console.log(result.local);
    var checked = result.validPassword(currentPassword);
    console.log(checked);
      if(checked === true){
      var myPassword=result.generateHash(newPassword);
          result.local.password = myPassword;
          console.log("myPassword");
          console.log(myPassword);
          result.save(function(err){
             if(err) throw err;
             console.log("luu du lieu thanh cong");
           });
           res.redirect('/users')
        }else{
          console.log("sai mat khau");
           res.redirect('/users/profile');
        }
      });

 
})

router.post('/signup',passport.authenticate('local-signup',{
  successRedirect:'/users/login',
  failureRedirect:'/users/signup',
  failureFlash:true,
}));

router.post('/login',passport.authenticate('local-login',{
  successRedirect: '/users/posts',
  failureRedirect: '/users/login',
  failureFlash: true,
}))



router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

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

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    login=true;
    return next();
  }
  res.redirect('/');
}
