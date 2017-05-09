var express = require('express');
var passport = require('passport');
var User = require('../models/user.js');
var Word = require('../models/word.js');
var router = express.Router();
var markdown = require( "markdown" ).markdown;
router.get('/:id', function (req, res, next) {
	var id = req.params.id;
	console.log(id);

	Word.findById(id, function (err, doc) {
		if (err) console.log(err);
		console.log(doc);
		var content = markdown.toHTML(doc.content);
		var title = doc.title;
		User.findOne({
			username: doc.owner
		}, function (err, data) {
			if (err) console.log(err);
			console.log(data);
			res.render('word.ejs', {
				message: req.flash('loginMessage'),
				reqUser: req.user,
				// id: doc._id,
				doc: doc,
				content: content,
				title: title,
				user: data
			});
		})

	});

});


module.exports = router;

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		login = true;
		return next();
	}

	res.redirect('/');
}