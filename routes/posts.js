var express = require('express');
var passport=require('passport');
var User = require('../models/user.js');
var Word = require('../models/word.js');
var router = express.Router();
router.get('/:id', function(req, res, next) {
	var id = req.params.id;
	console.log(id);
  res.render('index',{message:req.flash('loginMessage')});
});


 module.exports = router;
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    login=true;
    return next();
  }

  res.redirect('/');
}
