var express = require('express');
var passport=require('passport');
var user = require('../models/user.js');
var Word = require('../models/word.js');
var router = express.Router();
router.get('/',isLoggedIn, function(req, res, next) {
  Word.findOne({},function(err,data){
      console.log(data);
      res.render('posts.ejs',{message:req.flash('loginMessage'), user: req.user,posts:data});
  });
  console.log(req.user.profile.fullName);
  
});