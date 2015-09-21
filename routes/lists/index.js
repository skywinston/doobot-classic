// Routes - Lists - Index
var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var List = require('../../models/list');
var Item = require('../../models/item');
var router = express.Router();

router.route('/')
  .get(function(req,res, next){
    res.render('/index', {
      stuff : req.body
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

router.route('/:id')
  .get(function(req, res, next){
    var user = req.user;
    List.findById( { _id : req.params.id}, function(err, list){
      var list = list;
      Item.find( { listId : list._id },function(err, items){
        res.render('items/index.jade', {
          user : user,
          list : list,
          items : items
        });
      });
    });
  });

module.exports = router;
