var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var List = new Schema({
    userId: String,
    listTitle: String
});

module.exports = mongoose.model('List', List);
