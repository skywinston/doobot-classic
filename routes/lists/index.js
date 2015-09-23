// Routes - Lists - Index
var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var List = require('../../models/list');
var Item = require('../../models/item');
var router = express.Router();

router.route('/')
  .get(function(req, res, next){
    console.log("Look for the user in the GET to /lists");
    console.log(req.user);
    List.find( { userId : req.user._id }, function(err, lists){
      res.render('lists/index', {
        lists: lists
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



router.route('/:listId/new')
  .get(function(req, res, next){
    console.log("We should have the List ID:");
    console.log(req.params.listId);
    console.log("and we should have the user");
    console.log(req.user);
    var user = req.user;
    List.findById( { _id : req.params.listId }, function(err, list){
      var list = list;
      res.render('items/new', {
        user : user,
        list : list
      });
    });
  });

module.exports = router;
