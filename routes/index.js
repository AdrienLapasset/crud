var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Models
var Project = mongoose.model('Project');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/projects', function(req, res, next) {
	Project.find().exec(function(err, data) {
		if(err) {
			return next(err);
		}
		res.json(data);
	});
});

router.post('/addProject', function(req, res, next) {
	var project = new Project({
		title: req.body.title,
		description: req.body.description
	});
	project.save(function(err, data) {
		if(err) {
			return next(err);
		}
		res.json(data);
	});
});

router.put('/updateProject/:id', function(req, res, next) {
	Project.findById(req.params.id, function(err, data) {
		console.log(req.body);
		data.title = req.body.title;
		data.description = req.body.description;
		data.updated = Date.now();
		data.save(function(err, data) {
			if(err) {
				return next(err);
			}
			res.json(data);
		});
	});
})

router.delete('/removeProject/:id', function(req, res) {
	Project.findByIdAndRemove(req.params.id, function(err, data) {
		res.json(data);
	});
})

module.exports = router;
