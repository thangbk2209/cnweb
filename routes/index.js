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
router.get('/yourPage/:username', function (req, res, next) {
  console.log("start");
  var username = req.params.username;
  console.log('req.user '+ req.user.username);
   Word.find({owner:username
      }, function (err, docs) {
          console.log(docs);
           console.log('all doc= '+docs.length);
           var result = [];
           var size = parseInt(docs.length/5);
           var du = parseInt(docs.length%5);
           console.log(du);
           console.log(size);
           // Truong hop so bai viet nho hon 5
           if(size == 0){
            for(var i = 0 ; i< docs.length;i++){
              var isLike = false;
              for(var j = 0 ; j < docs[i].like.length;j++){  
                if(docs[i].like[j].user === req.user.username){
                  isLike = true;
                  break;
                }
              }
              
              result.push({
                        id: docs[i]._id,
                        owner: docs[i].owner,
                        title: docs[i].title,
                        content:docs[i].content,
                        soLike: docs[i].soLike,
                        soCmt: docs[i].soCmt,
                        like: docs[i].like,
                        time: docs[i].time,
                        isLike: isLike
                    });
            }
            var abc=[];
            abc.push(result);
            
            abc.push()
            res.json(abc);
           }
           else{
            // Truong hop so bai viet lon hon 5
              for(var i = 0 ; i<= size ; i++){
                var doc = [];
                  if( du!=0){
                    // Truong hop so bai viet chia cho 5 co gia tri du khac 0
                    if(i==size){
                      for(var j = 0 ; j<du ; j++){
                          var isLike = false;
                          for(var k = 0 ; k < docs[i*5+j].like.length;k++){
                            
                            if(docs[i*5+j].like[k].user === req.user.username){
                              isLike = true;
                              break;
                            }
                          }
                          doc.push({
                            id: docs[i*5+j]._id,
                            owner: docs[i*5+j].owner,
                            title: docs[i*5+j].title,
                            content:docs[i*5+j].content,
                            soLike: docs[i*5+j].soLike,
                            soCmt: docs[i*5+j].soCmt,
                            like: docs[i*5+j].like,
                            time: docs[i*5+j].time,
                            isLike: isLike
                          });
                          // doc.push(docs[i*5+j]);
                        }
                    }else{
                        for(var j= 0;j<5;j++){
                        var isLike = false;
                        for(var k = 0 ; k < docs[i*5+j].like.length;k++){                      
                          if(docs[i*5+j].like[k].user === req.user.username){
                            isLike = true;
                            break;
                          }
                        }
                        doc.push({
                          id: docs[i*5+j]._id,
                          owner: docs[i*5+j].owner,
                          title: docs[i*5+j].title,
                          soLike: docs[i*5+j].soLike,
                          content:docs[i*5+j].content,
                          soCmt: docs[i*5+j].soCmt,
                          like: docs[i*5+j].like,
                          time: docs[i*5+j].time,
                          isLike: isLike
                        });
                      }
                    }
                  }else{
                    // Truong hop so bai viet chia cho 5 co gia tri du bang 0
                    if(i==size){

                    }else{
                      for(var j= 0;j<5;j++){
                        var isLike = false;
                        for(var k = 0 ; k < docs[i*5+j].like.length;k++){                      
                          if(docs[i*5+j].like[k].user === req.user.username){
                            isLike = true;
                            break;
                          }
                        }
                        doc.push({
                          id: docs[i*5+j]._id,
                          owner: docs[i*5+j].owner,
                          title: docs[i*5+j].title,
                          content:docs[i*5+j].content,
                          soLike: docs[i*5+j].soLike,
                          soCmt: docs[i*5+j].soCmt,
                          like: docs[i*5+j].like,
                          time: docs[i*5+j].time,
                          isLike: isLike
                        });
                      }
                    }
                }
                  result.push(doc);

              }
              res.json(result);
           }
        }); 
})
router.get('/word/:id',function(req,res,next){
  console.log(req.params.id);
  var id = req.params.id;
  var result=[];
  Word.findById(id, function(err,docs){
    User.findById(req.user._id,function(err,data){
      console.log('user comment: '+data);
      var isLike = false;     
              for(var i=0 ; i<docs.like.length ; i++){        
                  if(docs.like[i].user === req.user.username){
                    isLike = true;
                    break;
                  } 
              }
              result.push({
                        id: docs._id,
                        owner: docs.owner,
                        title: docs.title,
                        content: docs.content,
                        soLike: docs.soLike,
                        soCmt: docs.soCmt,
                        comment: docs.comment,
                        reqUser: data,
                        like: docs.like,
                        isLike: isLike
                    });
              res.json(result);
    })
              

  })
})
router.get('/Page', function (req, res, next) {
  console.log("start");
  console.log('req.user '+ req.user.username);
    Word.find({
      }, function (err, docs) {
          console.log(docs);
           console.log('all doc= '+docs.length);
           var result = [];
           var size = parseInt(docs.length/5);
           var du = parseInt(docs.length%5);
           console.log(du);
           console.log(size);
           // Truong hop so bai viet nho hon 5
           if(size == 0){
            for(var i = 0 ; i< docs.length;i++){
              var isLike = false;
              for(var j = 0 ; j < docs[i].like.length;j++){  
                if(docs[i].like[j].user === req.user.username){
                  isLike = true;
                  break;
                }
              }
              
              result.push({
                        id: docs[i]._id,
                        owner: docs[i].owner,
                        title: docs[i].title,
                        soLike: docs[i].soLike,
                        soCmt: docs[i].soCmt,
                        like: docs[i].like,
                        time: docs[i].time,
                        isLike: isLike
                    });
            }
            var abc=[];
            abc.push(result);
            res.json(abc);
           }
           else{
            // Truong hop so bai viet lon hon 5
              for(var i = 0 ; i<= size ; i++){
                var doc = [];
                  if( du!=0){
                    // Truong hop so bai viet chia cho 5 co gia tri du khac 0
                    if(i==size){
                      for(var j = 0 ; j<du ; j++){
                          var isLike = false;
                          for(var k = 0 ; k < docs[i*5+j].like.length;k++){
                            
                            if(docs[i*5+j].like[k].user === req.user.username){
                              isLike = true;
                              break;
                            }
                          }
                          doc.push({
                            id: docs[i*5+j]._id,
                            owner: docs[i*5+j].owner,
                            title: docs[i*5+j].title,
                            soLike: docs[i*5+j].soLike,
                            soCmt: docs[i*5+j].soCmt,
                            like: docs[i*5+j].like,
                            time: docs[i*5+j].time,
                            isLike: isLike
                          });
                          // doc.push(docs[i*5+j]);
                        }
                    }else{
                        for(var j= 0;j<5;j++){
                        var isLike = false;
                        for(var k = 0 ; k < docs[i*5+j].like.length;k++){                      
                          if(docs[i*5+j].like[k].user === req.user.username){
                            isLike = true;
                            break;
                          }
                        }
                        doc.push({
                          id: docs[i*5+j]._id,
                          owner: docs[i*5+j].owner,
                          title: docs[i*5+j].title,
                          soLike: docs[i*5+j].soLike,
                          soCmt: docs[i*5+j].soCmt,
                          like: docs[i*5+j].like,
                          time: docs[i*5+j].time,
                          isLike: isLike
                        });
                      }
                    }
                  }else{
                    // Truong hop so bai viet chia cho 5 co gia tri du bang 0
                    if(i==size){

                    }else{
                      for(var j= 0;j<5;j++){
                        var isLike = false;
                        for(var k = 0 ; k < docs[i*5+j].like.length;k++){                      
                          if(docs[i*5+j].like[k].user === req.user.username){
                            isLike = true;
                            break;
                          }
                        }
                        doc.push({
                          id: docs[i*5+j]._id,
                          owner: docs[i*5+j].owner,
                          title: docs[i*5+j].title,
                          soLike: docs[i*5+j].soLike,
                          soCmt: docs[i*5+j].soCmt,
                          like: docs[i*5+j].like,
                          time: docs[i*5+j].time,
                          isLike: isLike
                        });
                      }
                    }
                }
                  result.push(doc);

              }
              res.json(result);
           }
        });
})
router.get('/edit/:id', function (req, res, next) {
  console.log("start edit");
  console.log(req.params.id);
  var id = req.params.id;
  console.log('req.user '+ req.user.username);
  Word.findById(id,function(err,data){
    if(err) console.log(err);
    console.log(data);
    res.render('write.ejs', {
      reqUser: req.user,
      title: data.title,
      content: data.content
    });
  })
  
  // res.redirect('/users/write');
})
router.post('/addCmt',function(req,res,next){
  console.log(req.body.yourCmt);
  Word.findById(req.body.id,function(err,data){
    if(err) console.log(err);
    data.soCmt++;
    data.comment.push({
      user: req.user.username,
      avatar: req.user.profile.avatar,
      cmt: req.body.yourCmt
    });
    data.save(function(err){
      if(err) console.log(err);
      console.log('Added cmt');
    });
    Word.find({},function(err,cmts){
      if(err) console.log(err);
      res.json(cmts);
    });
  })
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
   console.log('like ' + req.body.id);
   Word.findById(req.body.id,function(err,data){
      if(err) console.log(err);
      console.log(data);
      data.soLike+=1;
      data.like.push({
        user: req.user.username,
        avatar: req.user.profile.avatar
      });
      data.save(function(err,docs){
        if(err) console.log(err);
        console.log('Luu thanh cong');
        // var result=[];
        // var isLike = false;   
        //       for(var i=0;i<docs.like.length ; i++){          
        //               if(docs.like[i].user === req.user.username){
        //                 isLike = true;
        //                 break;
        //               }
        //       }
        //       result.push({
        //                 id: docs._id,
        //                 owner: docs.owner,
        //                 title: docs.title,
        //                 soLike: docs.soLike,
        //                 soCmt: docs.soCmt,
        //                 like: docs.like,
        //                 isLike: isLike
        //             });
        //       res.json(result);
      })

   })
    
})
router.post('/unlikePost',function(req,res,next){
  console.log(req.user.username);
   console.log(req.body.id);
    Word.findById(req.body.id,function(err,data){
      if(err) console.log(err);
      console.log(data);
      data.soLike-=1;
      for(var i = 0 ; i< data.like.length ;i++){
        console.log(data.like[i]);
        if(data.like[i].user == req.user.username){
          data.like.splice(i,1);
          console.log('data.like'+data.like);
          
        }
      }
      data.save(function(err,docs){
        if(err) console.log(err);
        console.log('Luu thanh cong');
      //   var result=[];
      //   var isLike = false;   
      //         for(var i=0;i<docs.like.length ; i++){          
      //                 if(docs.like[i].user === req.user.username){
      //                   isLike = true;
      //                   break;
      //                 }
      //         }
      //         result.push({
      //                   id: docs._id,
      //                   owner: docs.owner,
      //                   title: docs.title,
      //                   soLike: docs.soLike,
      //                   soCmt: docs.soCmt,
      //                   like: docs.like,
      //                   isLike: isLike
      //               });
      //         res.json(result);
      })

   })
    
})
module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    login = true;
    return next();
  }

  res.redirect('/');
}