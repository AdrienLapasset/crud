var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
	name: String,
	password: String
});

mongoose.model('User', UserSchema);