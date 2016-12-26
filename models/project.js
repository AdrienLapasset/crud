var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
	title: String,
	description: String,
	image: String
});

mongoose.model('Project', ProjectSchema);