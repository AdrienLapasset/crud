var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Project = mongoose.model('Project');

router.get('/', function(req, res) {
	res.render('index');
});

router.get('/projects', function(req, res) {
	Project.find().exec(function(err, data) {
		if(err) {
			return next(err);
		}
		res.json(data);
	});
});

module.exports = router;