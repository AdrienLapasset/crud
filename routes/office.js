var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer  = require('multer');
var upload = multer({ dest: 'front/images/' });
var fs = require('fs');
// Models
var Project = mongoose.model('Project');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

// GET
router.get('/projects', function(req, res, next) {
	Project.find().exec(function(err, data) {
		if(err) {
			return next(err);
		}
		res.json(data);
	});
});

// POST
router.post('/addProject', upload.single('file'), function(req, res, next) {
	console.log(req.file);
	var project = new Project({
		title: req.body.title,
		description: req.body.description,
	});
	if (typeof req.file != "undefined") {
		project.image = req.file.filename;
	}
	project.save(function(err, data) {
		if(err) {
			return next(err);
		}
		res.redirect('/');
	});
});

// Update
router.post('/updateProject/:id', upload.single('file'), function(req, res, next) {
	Project.findById(req.params.id, function(err, data) {
		data.title = req.body.title;
		data.description = req.body.description;
		if (typeof req.file != "undefined") {
			var link = 'front/images/' + data.image;
			if (fs.existsSync(link)) {
				fs.unlink(link);
			};
			data.image = req.file.filename;
		}
		data.save(function(err, data) {
			if(err) {
				return next(err);
			}
			res.redirect('/');
		});
	});
})

// DELETE
router.delete('/removeProject/:id', function(req, res) {
	Project.findByIdAndRemove(req.params.id, function(err, data) {
		var link = 'front/images/' + data.image;
		fs.unlink(link);
		res.json(data);
	});
})

module.exports = router;
