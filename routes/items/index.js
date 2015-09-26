var express = require('express');
var passport = require('passport');
var Account = require('../../models/account');
var List = require('../../models/list');
var Item = require('../../models/item');
var Knwl = require('knwl.js');
var router = express.Router();

router.route('/new')
  .get(function(req, res, next){
    console.log("Received GET to /items/new.");
    res.render('items/new');
  });

module.exports = router;
