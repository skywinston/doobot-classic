var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Item = new Schema({
    userId: String,
    listId: String,
    itemTitle: String,
    createdOn: { type: Date, default: Date.now },
    dueDate: { type: Date, default: null },
    notes: { type: String, default: null },
    location: { type: String, default: null },
});

module.exports = mongoose.model('Item', Item);
