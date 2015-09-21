// Routes - Lists - Index
var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var List = require('../../models/list');
var Item = require('../../models/item');
var router = express.Router();

router.route('/')
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

router.route('/:listId')
  .get(function(req, res, next){
    console.log(req);
    var user = req.user;
    List.findById( { _id : req.params.listId}, function(err, list){
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

router.route('/:listId/new')
  .get(function(req, res, next){
    console.log("We should have the List ID:");
    console.log(req.params.listId);
    console.log("and we should have the user");
    console.log(req.user);

    // TASKS

    // Serve up the /items/new template and pass in the user object & listId
  });

module.exports = router;
