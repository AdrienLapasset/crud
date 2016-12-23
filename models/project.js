var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
	title: String,
	description: String,
	image: Buffer
});

mongoose.model('Project', ProjectSchema);