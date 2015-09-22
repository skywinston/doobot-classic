var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var List = require('../models/list');
var Item = require('../models/item');
var router = express.Router();

router.route('/new')
  .get(function(req, res, next){
    var user = req.user;
    console.log(req.data);
    // res.render('items/new-item', {
    //     user : user,
    //     lists : []
    // });
  });


router.route('/')
  .get(function (req, res, next) {
    if(!req.user) { return res.redirect('/login') };
    var user = req.user;
    Account.find( { username : req.user.username }, function(err, user){
      List.find( { userId : user[0]._id }, function(err, lists){
        res.render('index', {
          user : user,
          lists : lists
        });
      });
    });
  })
  .post(function(req, res, next){
    List.create(req.body, function(err, list){
      if (err) {
        console.log("db error in POST /lists: " + err);
        res.send('Error Code 500 - Internal Server Error');
      } else {
        res.redirect('/lists');
      }
    });
  });

router.route('/lists/:listId')
  .get(function(req, res, next){
    console.log(req);
    var user = req.user;
    List.findById( { _id : req.params.listId}, function(err, list){
      var list = list;
      Item.find( { listId : list._id }, function(err, items){
        res.render('items/index', {
          user : user,
          list : list,
          items : items
        });
      });
    });
  });

router.get('/current_user', function(req, res, next) {
  console.log("Log in current_user Route", req.user);
  res.json({user: req.user});
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { info: "Sorry, that username already exists." });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;
