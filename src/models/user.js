var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username:  String,
    access_token: String,
    refresh_token:   String,
});

module.exports = mongoose.model('User', User);
