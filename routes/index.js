var express = require('express');
var passport = require('passport');
var User = require('../models/user.js');
var Word = require('../models/word.js');
var router = express.Router();
router.get('/', function (req, res, next) {
  res.render('index', {
    message: req.flash('loginMessage')
  });
});
router.get('/yourPage', function (req, res, next) {
  console.log("start");
  console.log('req.user '+ req.user.username);
    Word.find({
        'owner': req.user.username
      }, function (err, docs) {
           console.log(docs);
            res.json(docs);
        });
})
router.get('/Page', function (req, res, next) {
  console.log("start");
  console.log('req.user '+ req.user.username);
    Word.find({
      }, function (err, docs) {
           console.log(docs);
            res.json(docs);
        });
})

router.delete('/delPost',function(req,res,next){
  console.log(req.body.id);
  // console.log(req.user.local.email);
  Word.remove({ _id: req.body.id }, function (err) {
      if (err){
          console.log(err);
      }
      console.log('removed! ');
  });
  Word.find({owner:req.body.owner},function(err,docs){
    res.json(docs);
  });
})
router.post('/likePost',function(req,res,next){
  console.log(req.body.id);
  // console.log(req.body.liker);
  // console.log(req.user.local.email);
  Word.findById(req.body.id, function (err,data) {
      if (err){
          console.log(err);
      }
      User.findOne({'username': data.owner },function(err,result){
        console.log(result);
        var test = 0;
        for(var i = 0 ; i< result.profile.like.length;i++){
            if(result.profile.like[i].title === data.title){
              test = 1;
              break;
            }
        }
        console.log('test= ' +test);
          if(test == 0){
            result.profile.like.push({title: data.title});
            result.save(function(err){
              if(err) console.log(err);
            })
              data.soLike+=1;
              data.like.push({user: req.user.username});
              data.save(function(err){
              if(err) console.log('chua them duoc nguoi like');
               console.log('added liker!!! ');
               Word.find({},function(err,docs){
                  res.json(docs);
              });

            });
          }
           
      });
      
  });
 
})
router.post('/likePostmyPage',function(req,res,next){
  console.log(req.body.id);
  console.log(req.body.owner);
  // console.log('user: '+user);
  Word.findById(req.body.id, function (err,data) {
      if (err){
          console.log(err);
      }
        User.findOne({'username': data.owner },function(err,result){
        console.log(result);
        var test = 0;
        for(var i = 0 ; i< result.profile.like.length;i++){
            if(result.profile.like[i].title === data.title){
              test = 1;
              break;
            }
        }
        console.log('test= ' +test);
          if(test == 0){
            result.profile.like.push({title: data.title});
            result.save(function(err){
              if(err) console.log(err);
            })
              data.soLike+=1;
              data.like.push({user: req.user.username});
              data.save(function(err){
              if(err) console.log('chua them duoc nguoi like');
               console.log('added liker!!! ');
               Word.find({owner:req.body.owner},function(err,docs){
                  res.json(docs);
              });

            });
          }
           
      });
    //   data.soLike+=1;
    //   data.like.push({'user': req.user.username});
    //   data.save(function(err){
    //     if(err) console.log('chua them duoc nguoi like');
    //      console.log('added liker!!! ');
    //      Word.find({owner:req.body.owner},function(err,docs){
    //     res.json(docs);
    // })
    // });
  });
 
})
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    login = true;
    return next();
  }

  res.redirect('/');
}