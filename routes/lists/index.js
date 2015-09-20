var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var List = require('../../models/list');
var router = express.Router();

router.route('/')
  .post(function(req, res, next){
    console.log("What's in the session?", req.session);
    List.create(req.body, function(err, list){
      if (err) {
        console.log("db error in POST /lists: " + err);
        res.render('500');
      } else {
        res.render('lists', {
          lists: lists,
          user: req.body
        });
      }
    });
  });

module.exports = router;
