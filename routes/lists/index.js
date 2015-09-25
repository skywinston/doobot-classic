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
      console.log(lists);
      res.render('lists/index', {
        lists: lists
      });
    });
  })
  .post(function(req, res, next){
    List.create( { userId : req.user._id, listTitle : req.body.listTitle }, function(err, list){
      console.log("List from DB:", list, typeof list);
      res.send(list);
    });
  });

router.route('/first')
  .get(function(req, res, next){
    res.render('lists/first');
  });

router.route('/edit')
  .get(function(req, res, next){
    res.render('lists/edit');
  });

router.route('/update')
  .post(function(req, res, next){
    List.findByIdAndUpdate(
      { _id : req.body.listId },
      { listTitle : req.body.listTitle },
      function(err, data){
        if (err) throw err;
        res.status(304).send(data);
      });
    });

router.route('/delete')
  .get(function(req, res, next){
    res.render('lists/delete');
  })
  .post(function(req, res, next){
    console.log("post to lists/delete received...");
    console.log("list ID below?");
    console.log(req.body.listId);
    List.findOneAndRemove( { _id : req.body.listId }, function(err, confirmation){
      if (err) throw err;
      res.status(304).send("List with ID of " + req.body.listId + " deleted.");
    });
  });

router.route('/new')
  .get(function(req, res, next){
    res.render('lists/new');
  });

router.route('/:listId')
  .get(function(req, res, next){
    var user = req.user;
    console.log(user);
    console.log(req.params.listId);
    List.findById( { _id : req.params.listId}, function(err, list){
      var list = list;
      console.log(list);
      Item.find( { listId : list._id }, function(err, items){
        console.log("Items: ", items);
        res.render('items/index', {
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
