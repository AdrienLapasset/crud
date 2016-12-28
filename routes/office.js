var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer  = require('multer');
var upload = multer({ dest: 'front/images/' });
var fs = require('fs');
var jwt = require('jsonwebtoken');
var ejwt = require('express-jwt');
var auth = ejwt({secret: 'secret'});
// Models
var User = mongoose.model('User');
var Project = mongoose.model('Project');

router.get('/login', function(req, res, next) {
	res.render('login');
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index');
});

// GET projects
router.get('/projects', function(req, res, next) {
	Project.find().exec(function(err, data) {
		if(err) {
			return next(err);
		}
		res.json(data);
	});
});

// POST new project
router.post('/addProject', upload.single('file'), function(req, res, next) {
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

// Update project by id
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
});

// DELETE project by id
router.delete('/removeProject/:id', function(req, res) {
	Project.findByIdAndRemove(req.params.id, function(err, data) {
		var link = 'front/images/' + data.image;
		fs.unlink(link);
		res.json(data);
	});
});

// Check login form end send a token
router.post('/authenticate', function(req, res, next){
	User.findOne({
		name: req.body.name
	}, function(err, user) {
		if (err) throw err;
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				var token = jwt.sign(user, 'secret', {
					expiresIn: '5s'
				});
				res.json({ success: true, message:'Authentication successed !', token: token});
			}
		}
	})
});

module.exports = router;
