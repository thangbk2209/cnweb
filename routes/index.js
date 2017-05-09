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
    Word.find({
        'owner': username
      }, function (err, docs) {
              console.log('all doc= '+docs.length);
           var result = [];
           var size = parseInt(docs.length/5);
           var du = parseInt(docs.length%5);
           console.log(du);
           console.log(size);
           if(size == 0){
            // res.json(docs);
            result.push(docs);
            res.json(result);
           }
           else{
              for(var i = 0 ; i<= size ; i++){
                var doc = [];
                  if(i==size && du!=0){
                    for(var j = 0 ; j<du ; j++){
                      doc.push(docs[i*5+j]);
                    }
                  }else{
                    for(var j= 0;j<5;j++){
                      doc.push(docs[i*5+j]);
                    }
                }
                  result.push(doc);

              }
              res.json(result);
           }
        });
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
   Word.findById(req.body.id,function(err,data){
      if(err) console.log(err);
      console.log(data);
      data.soLike+=1;
      data.like.push({
        user: req.user.username,
        avatar: req.user.profile.avatar
      });
      data.save(function(err){
        if(err) console.log(err);
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
                        isLike: isLike
                    });
            }
            var abc=[];
            abc.push(result);
            console.log(abc);
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

   })
    
})
router.post('/unlikePost',function(req,res,next){
  console.log(req.user.username);
   console.log(req.body.id);
   Word.findById(req.body.id,function(err,data){
      if(err) console.log(err);
      // console.log(data.like);
      data.soLike-=1;

      for(var i = 0 ; i< data.like.length ;i++){
        console.log(data.like[i]);
        if(data.like[i].username == req.user.username){
          data.like.splice(i,1);
          console.log('data.like'+data.like);
          
        }
      }
      data.save(function(err){
        if(err) console.log(err);
        Word.find({
      }, function (err, docs) {
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
                        isLike: isLike
                    });
            }
            res.json(result);
           }
           else{
            // Truong hop so bai viet lon hon 5
              for(var i = 0 ; i<= size ; i++){
                var doc = [];
                  if(i==size && du!=0){
                    // Truong hop so bai viet chia cho 5 co gia tri du khac 0
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
                        isLike: isLike
                    });
                      // doc.push(docs[i*5+j]);
                    }
                  }else{
                    // Truong hop so bai viet chia cho 5 co gia tri du bang 0
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
                        isLike: isLike
                    });
                    }
                }
                  result.push(doc);

              }
              res.json(result);
           }
        });
      })
      
   })
    
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